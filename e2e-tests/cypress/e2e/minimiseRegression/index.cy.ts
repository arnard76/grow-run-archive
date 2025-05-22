import Mailjs from '@cemalgnlts/mailjs';
import dayjs from 'dayjs';
import { login, signup, UserCredentials } from './actions/authActions';
import { GrowRunManager, growRunsManager } from './actions/growRunActions';
import { resourcesManager } from './actions/resourceActions';
import { formatResourcesAsObjects } from './util/convertStringRequirementsToObjects';
import { fastForward, fastForwardedTime } from '../../mocks/fastForward';
import { INTERVAL_FOR_ENVIRONMENTAL_DATA } from '@grow-run-archive/definitions';
import { growRunEnvironment } from '@grow-run-archive/definitions';
import { mockMissingEnvironmentNotifyCronJob } from '../../mocks/missingEnvironmentNotificationCronJob';

const exampleResources = formatResourcesAsObjects([
	'80pcs seeds for $2.00 (from https://www.thewarehouse.co.nz/p/kiwi-garden-lettuce-butterhead-seeds/R2598667.html?gStoreCode=188',
	'200mL nutrients for $14.99 (from https://gathera.com/products/re-plant-pack-rockwool?variant=40093526392966',
	'9L coco coir for $5.91 (from https://www.bunnings.co.nz/daltons-9l-coir-briquette_p0241119'
]);

const resourceUsage1 = [
	'12x seeds',
	'10mL nutrients',
	'0.1L coco coir'
	// '100mL coco coir'
];

const resourceUsage2 = ['5mL nutrients'];

describe('Grow Run Archive', () => {
	const mailjs = new Mailjs();
	let userCredentials: UserCredentials;
	let mockNotifyService = mockMissingEnvironmentNotifyCronJob();

	before(() => {
		cy.wrap(null).then(async () => {
			await mailjs.createOneAccount();
			userCredentials = { username: mailjs.address, password: mailjs.address };
			signup(mailjs.address, mailjs.address);
			login(mailjs.address, mailjs.address);
		});
	});

	it('analyses a grow run', () => {
		let daysPassedAtStart = fastForwardedTime;
		resourcesManager.addMultiple(exampleResources);

		const growRun = new GrowRunManager('BCKIN AKL - Grow Run #17', userCredentials);
		growRun.showAllDetails();
		growRun.start();

		// TODO: add location by address search
		// growRun.addLocation('address search', '7 Auburn Street, Grafton, Auckland');
		// const growRunLocationCoords = {
		// 	latitude: -36.86611935343806,
		// 	longitude: 174.76589777209952
		// };
		// growRun.addLocationByCoords('coords', growRunLocationCoords);
		// growRun.location
		// 	.should('include.text', 'Auckland')
		// 	.invoke('attr', 'href')
		// 	.should(
		// 		'equal',
		// 		`https://www.google.com/maps/place/${growRunLocationCoords.latitude},${growRunLocationCoords.longitude}`
		// 	);
		// growRunsManager.goToAll();
		// // growRun.preview.should('include.text', 'Auckland'); // TODO!!! get this working
		// growRun.showAllDetails();

		// DOESN"T WORK ON CHROME, WORKS ON EDGE
		// cy.origin('https://www.google.com', () => {
		// 	cy.url().should(
		// 		'include',
		// 		`https://www.google.com/maps/place/36%C2%B051'58.0%22S+174%C2%B045'57.2%22E/@-36.8661194,174.7658978,17z`
		// 	);
		// });

		growRun.manuallyRecordUsageOfResources(resourceUsage1);

		fastForward(30);
		growRun.manuallyRecordHarvest(['30g 25leaves']);
		growRun.manuallyRecordUsageOfResources(resourceUsage2);

		const time = dayjs().toISOString();
		growRun.recordEnvironmentalConditions(time, { 'air-temperature': 9 });
		growRun.testEnvironmentalConditions('air-temperature', 9, time);
		fastForward(20);
		growRun.manuallyRecordHarvest(['23g 15leaves']);

		fastForward(13);
		growRun.manuallyRecordHarvest(['20g 13leaves']);
		fastForward(1);
		growRun.end();
		growRun.duration
			.should('be.visible')
			.should(
				'contain.text',
				`${fastForwardedTime.diff(daysPassedAtStart, 'days').toFixed(2)} days`
			);

		// CHECK results - grow results and cost
		growRun.totalHarvest.should('be.visible').should('contain.text', '73.00g (53 leaves)');
		growRun.averageLeafWeight.should('be.visible').should('contain.text', '1.38g per leaf');
		growRun.totalCost.should('be.visible').should('contain.text', '$1.49');
		/** Default unit is {unitBasedOn: 'mass', amount: 100, unit: 'g'} */
		growRun.totalCostPerUnit.should('be.visible').should('contain.text', '$2.04');
	});

	/**
	 * If there has been no environment readings in the last INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES minutes,
	 * and it has been more than any of the threholds (which haven't been previously passed)
	 * then an email notification should be sent!
	 */
	it('notifies user if grow run is missing environment', () => {
		growRunsManager.deleteAll();

		// SETUP GROW RUN
		const growRun = new GrowRunManager('Notification test', userCredentials);
		growRun.showAllDetails();
		const startTime = dayjs().set('seconds', 0).set('milliseconds', 0);
		growRun.start(startTime);

		// INITIAL ENVIRONMENT READINGS (but miss next one)
		const time = dayjs().toISOString();
		growRun.recordEnvironmentalConditions(time, { 'air-temperature': 9 });
		growRun.testEnvironmentalConditions('air-temperature', 9, time);

		// CHECK CURRENT MESSAGES AND
		// WAIT UNTIL NEXT READINGS "SHOULD" ARRIVE
		let numMessages: undefined | number = undefined;
		cy.wrap(null).then(async () => {
			let messages = await mailjs.getMessages();
			numMessages = messages.data.length;
		});
		cy.wait(INTERVAL_FOR_ENVIRONMENTAL_DATA);

		// WAIT up to 2 minutes for the notification AND
		let timeoutThreshold = dayjs().add(2, 'minutes');
		let notification = undefined;

		cy.recursionLoop(async () => {
			let messages = (await mailjs.getMessages()).data;
			if (messages.length === numMessages + 1) notification = messages[numMessages];

			return timeoutThreshold.isBefore(dayjs()) && !notification;
		});

		// CHECK NOTIFICATION CONTENTS IS CORRECT
		cy.url().then(async (url) => {
			cy.wrap(notification).should('not.equal', undefined);
			cy.wrap(notification.subject).should(
				'contain',
				'Losing environmental data - not being recorded'
			);
			const fullNotification = await mailjs.getMessage(notification.id);
			const growRunId = url.split(growRunsManager.entityURL + '/')[1];
			cy.openHTML(fullNotification.data.html[0]);

			growRunEnvironment
				.missingEnvironmentNotification(
					growRun.growRunName,
					growRunId,
					startTime.toISOString(),
					time
				)
				.split('\n')
				.filter((line) => line.replace(/ /g, ''))
				.forEach((notificationTextPiece) =>
					cy.get('p').should('contain', notificationTextPiece).should('be.visible')
				);
			cy.go('back');
		});

		if (mockNotifyService) {
			clearInterval(mockNotifyService);
			mockNotifyService = null;
		}
		growRunsManager.deleteAll();
	});
});
