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
		return cy.findParentByHeading('section', /Conditions/i).scrollIntoView();
	}

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

	// TODO: find a way to test conditions
	// before it was using the listed measurements but I removed this because it shows on the graph
	// so I need to test graph instead of list
	// testCondition(
	// 	condition: keyof ExternalConditionsMeasurements['conditions'],
	// 	value: ConditionMeasurement['value'],
	// 	time: ConditionMeasurement['dateTime']
	// ) {
	// 	this.conditionsSection
	// 		.find('section')
	// 		.contains(verboseConditionName(condition))
	// 		.parent()
	// 		.as('conditionSection');
	// 	cy.get('@conditionSection')
	// 		.findByRole('button', { name: /Show records/i })
	// 		.click();
	// 	cy.get('@conditionSection')
	// 		.find('ul li')
	// 		.should('contain.text', displayFormatForDateTime(time))
	// 		.should('contain.text', `${value}°C`);
	// }

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
		cy.recursionLoop(async () => {
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

			if (notification) return false; // break loop
			cy.wait(10000);
			return true; // continue loop
		})

			.then(async () => {
				const fullNotification = (await mailjs.getMessage(notification.id)).data;
				const expectedMessageContents = expectedNotificationFormat.messageContents(
					this.growRunName,
					growRunId,
					growRunStartTime,
					expectedMissingData
				);
				this.testNotificationMessageContents(fullNotification.html[0], expectedMessageContents);
			});
	}

	testNotificationMessageContents(actualNotificationHTML: string, expectedMessageContents: string) {
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
