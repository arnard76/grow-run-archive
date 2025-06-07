import Mailjs from '@cemalgnlts/mailjs';
import dayjs from '@grow-run-archive/dayjs';
import {
	ConditionMeasurement,
	ConditionsMeasurements,
	DateTime,
	displayFormatForDateTime,
	ExternalConditionsMeasurements,
	GrowRun,
	NotificationFormat,
	NotificationInformation,
	verboseConditionName
} from '@grow-run-archive/definitions';
import { StatusCodes } from 'http-status-codes';
import { growRunsManager } from './growRunActions';
import { UserCredentials } from './userActions';

export class GrowRunEnvironmentManager {
	growRunName: GrowRun['name'];

	constructor(growRunName: GrowRun['name']) {
		this.growRunName = growRunName;
	}

	get conditionsSection() {
		return cy.get('dialog > section').eq(3).scrollIntoView();
	}

	getSpecificConditionData(conditionName: keyof ConditionsMeasurements) {
		return this.conditionsSection
			.find('section')
			.contains(conditionName)
			.find('ul')
			.findAllByRole('listitem');
	}

	// YOU COULD EITHER RECORD ALL MEASUREMENTS FOR A SINGLE CONDITION, THEN MOVE ON TO ANOTHER CONDITION
	// ORRRRR
	// RECORD THE MEASUREMENT FOR EVERY CONDITION AT A SPECIFIC TIMESTAMP, AND MOVE ONTO THE NEXT TIME (MORE LIKELY)
	recordConditions(
		timestamp: ExternalConditionsMeasurements['dateTime'],
		conditions: ExternalConditionsMeasurements['conditions'],
		userCredentials: UserCredentials
	) {
		cy.url().then(async (url) => {
			const growRunId = url.split(growRunsManager.entityURL + '/')[1];
			expect(growRunId).to.be.a('string').with.length.greaterThan(6);
			const response = await fetch(`${Cypress.env('PUBLIC_API_URL')}/grow-run/environment`, {
				method: 'post',
				body: JSON.stringify({
					user: {
						username: userCredentials.username,
						password: userCredentials.password
					},
					growRunId,
					dateTime: timestamp,
					...conditions
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			expect(response.status).to.equal(StatusCodes.CREATED);
		});
	}

	testCondition(
		condition: keyof ExternalConditionsMeasurements['conditions'],
		value: ConditionMeasurement['value'],
		time: ConditionMeasurement['dateTime']
	) {
		this.conditionsSection
			.find('section')
			.contains(verboseConditionName(condition))
			.parent()
			.as('conditionSection');
		cy.get('@conditionSection')
			.findByRole('button', { name: /Show records/i })
			.click();
		cy.get('@conditionSection')
			.find('ul li')
			.should('contain.text', displayFormatForDateTime(time))
			.should('contain.text', `${value}°C`);
	}

	waitForAndTestNotification(
		growRunStartTime: DateTime,
		growRunId: GrowRun['id'],
		expectedNotificationFormat: NotificationFormat,
		expectedMissingData: NotificationInformation,
		mailjs: Mailjs
	) {
		// WAIT up to 2 minutes for the notification
		const timeoutThreshold = dayjs().add(2, 'minutes');
		let notification = undefined;
		// let messageSubjectFormat = notificationFormat.messageSubject(growRun.growRunName, growRunId);
		cy.recursionLoop(async () => {
			cy.wait(10000);
			let messages = (await mailjs.getMessages()).data;
			const notifications = messages.filter(
				(message) =>
					message.subject ===
						expectedNotificationFormat.messageSubject(this.growRunName, growRunId) &&
					dayjs(message.createdAt).isValid() &&
					dayjs(message.createdAt).isAfter(dayjs().subtract(2, 'minutes'))
			);

			if (notifications.length === 1) notification = notifications[0];
			if (notifications.length > 1)
				console.error('There are too many notifications generated', { notifications });

			if (timeoutThreshold.isBefore(dayjs())) throw Error('notification not recieved');
			return !notification;
		})

			.then(async () => {
				const fullNotification = await mailjs.getMessage(notification.id);
				const expectedMessageContents = expectedNotificationFormat.messageContents(
					this.growRunName,
					growRunId,
					growRunStartTime,
					expectedMissingData
				);
				this.testNotificationMessageContents(
					fullNotification.data.html[0],
					growRunStartTime,
					growRunId,
					expectedMessageContents
				);
			});
	}

	testNotificationMessageContents(
		actualNotificationHTML: string,
		growRunStartTime: DateTime,
		growRunId: GrowRun['id'],
		expectedMessageContents: string
	) {
		cy.openHTML(actualNotificationHTML);

		// SUMMARY SECTION
		cy.get('section')
			.eq(0)
			.invoke('html')
			.then((actualHTML) => expect(expectedMessageContents).contains(actualHTML));

		// TABLE OF MISSING DATA
		cy.get('section')
			.eq(1)
			.invoke('html')
			.then((actualHTML) => expect(expectedMessageContents).contains(actualHTML));
	}
}
