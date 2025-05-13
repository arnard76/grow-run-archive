import Mailjs from '@cemalgnlts/mailjs';
import dayjs from 'dayjs';
import { login, signup } from './actions/authActions';
import {
	GrowRunManager,
	growRunsManager,
	mockMissingDataNotifyCronJob
} from './actions/growRunActions';
import { resourcesManager } from './actions/resourceActions';
import { formatResourcesAsObjects } from './util/convertStringRequirementsToObjects';
import { fastForward, fastForwardedDays } from './util/fastForward';
import {
	INTERVAL_FOR_ENVIRONMENTAL_DATA,
	INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES
} from '@grow-run-archive/definitions';

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
	let mockNotifyService = mockMissingDataNotifyCronJob();

	before(() => {
		cy.wrap(null).then(async () => {
			await mailjs.createOneAccount();
			userCredentials = { username: mailjs.address, password: mailjs.address };
			signup(mailjs.address, mailjs.address);
			login(mailjs.address, mailjs.address);
		});
	});

	it('analyses a common grow run', () => {
		let daysPassedAtStart = fastForwardedDays;
		resourcesManager.addMultiple(exampleResources);

		const growRun = new GrowRunManager('BCKIN AKL - Grow Run #17');
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
		// should be no emails
		cy.wrap(null).then(async () => {
			const messages = await mailjs.getMessages();
			console.log(messages);
		});
		cy.pause();
		cy.wrap(null).then(async () => {
			const messages = await mailjs.getMessages();
			console.log(messages);
		});
		// WAIT 15+ minutes 🧠🤯🧠🤯🧠
		// should be notified because no environmental data was recorded
		// CHECK email?

		fastForward(20);
		growRun.manuallyRecordHarvest(['23g 15leaves']);

		fastForward(13);
		growRun.manuallyRecordHarvest(['20g 13leaves']);

		fastForward(1);
		growRun.end();
		growRun.duration
			.should('be.visible')
			.should('contain.text', `${(fastForwardedDays - daysPassedAtStart).toFixed(2)} days`);

		// CHECK results - grow results and cost
		growRun.totalHarvest.should('be.visible').should('contain.text', '73.00g (53 leaves)');
		growRun.averageLeafWeight.should('be.visible').should('contain.text', '1.38g per leaf');
		growRun.totalCost.should('be.visible').should('contain.text', '$1.49');
		/** Default unit is {unitBasedOn: 'mass', amount: 100, unit: 'g'} */
		growRun.totalCostPerUnit.should('be.visible').should('contain.text', '$2.04');
	});

	it.only(`notifies user if grow run environment is not recorded every ${INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES} minutes`, () => {
		// const mailjs = new Mailjs();
		console.log({ userCredentials });
		cy.wrap(null).then(async () => {
			// await mailjs.createOneAccount();
			// signup(mailjs.address, mailjs.address);
			const growRun = new GrowRunManager(
				'Notified When Environmental Data Not Recorded',
				userCredentials
			);
			growRun.showAllDetails();
			growRun.start();
			const time = dayjs().toISOString();
			growRun.recordEnvironmentalConditions(time, { 'air-temperature': 9 });
			growRun.testEnvironmentalConditions('air-temperature', 9, time);
			cy.wrap(null).then(async () => {
				let messages = await mailjs.getMessages();
				cy.wrap(messages.data).should('have.length', 0);
			});
			cy.wait(INTERVAL_FOR_ENVIRONMENTAL_DATA);

			cy.wrap(null).then(async () => {
				let messages = await mailjs.getMessages();
				cy.wrap(messages.data).should('have.length', 0);
			});

			cy.wait(60 * 1000);
			cy.wrap(null).then(async () => {
				let messages = await mailjs.getMessages();
				console.log({ messages });
				cy.wrap(messages.data.length).should('equal', 1);
				const notification = messages.data[0];
				cy.wrap(notification.subject).should(
					'contain',
					'Losing environmental data - not being recorded'
				);

				const fullNotification = await mailjs.getMessage(notification.id);
				cy.wrap(fullNotification.message).should(
					'contain',
					`Losing environmental data - not being recorded!
					
					- Grow Run: ${growRun.growRunName} (12938472834jd)
					- Air temperature is not being recorded
					- The last recording was: 2025-05-12T21:46:00.000Z
					- Duration missing: ${INTERVAL_FOR_ENVIRONMENTAL_DATA_IN_MINUTES} minutes (1 environmental record)

					JSON:
					{"missingData":{"air-temperature":{"lastRecordingDateTime":"2025-05-12T21:46:00.000Z","growRunStartTime":"2025-05-12T21:46:00.000Z"}}}
					`
				);
			});
		});
	});

	after(() => {
		if (mockNotifyService) {
			clearInterval(mockNotifyService);
			mockNotifyService = null;
		}
	});
});
