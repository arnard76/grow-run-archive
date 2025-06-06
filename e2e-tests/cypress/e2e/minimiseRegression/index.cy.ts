import Mailjs from '@cemalgnlts/mailjs';
import dayjs from '@grow-run-archive/dayjs';
import {
	DateTime,
	GrowRun,
	NotificationFormat,
	NotificationInformation,
	NotificationRequirements
} from '@grow-run-archive/definitions';
import { fastForward, fastForwardedTime } from '../../mocks/fastForward';
import { login, signup, UserCredentials } from './actions/userActions';
import { GrowRunManager, growRunsManager } from './actions/growRunActions';
import { resourcesManager } from './actions/resourceActions';
import { formatResourcesAsObjects } from './util/convertStringRequirementsToObjects';

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

const notificationRequirements = new NotificationRequirements(Cypress.env('ENV'));
const notificationFormat = new NotificationFormat(notificationRequirements);

describe('Grow Run Archive', () => {
	const mailjs = new Mailjs();
	let userCredentials: UserCredentials;

	before(() => {
		cy.wrap(null).then(async () => {
			let createdAccount = false;
			const timeoutThreshold = dayjs().add(2, 'minutes');
			cy.recursionLoop(async () => {
				createdAccount = (await mailjs.createOneAccount()).status;
				if (createdAccount) return false;

				cy.wait(20000);
				if (timeoutThreshold.isBefore(dayjs())) throw Error('temp email address not created!');
				return true;
			}).then(() => {
				console.log(createdAccount);
				userCredentials = { username: mailjs.address, password: mailjs.address };
				signup(mailjs.address, mailjs.address);
				login(mailjs.address, mailjs.address);
			});
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
	 * If there has been no environment readings in the last INTERVAL_FOR_ENVIRONMENTAL_DATA,
	 * and it has been more than any of the threholds (which haven't been previously passed)
	 * then an email notification should be sent!
	 */
	it('notifies user if grow run is missing environment', () => {
		// SETUP GROW RUN
		const growRun = new GrowRunManager('Notification test', userCredentials);
		growRun.showAllDetails();
		// start time can not be more specific than minutes because of <input type="date" />
		// start time has to be in the future otherwise test will miss the notification for first missed recording
		const startTime = dayjs().add(1, 'minute').set('seconds', 0).set('milliseconds', 0);
		growRun.start(startTime);

		// INITIAL ENVIRONMENT READINGS (but miss next one)
		const time = startTime
			.add(notificationRequirements.ENVIRONMENTAL_DATA_INTERVAL * 0.95)
			.toISOString();
		growRun.recordEnvironmentalConditions(time, { 'air-temperature': 9 });
		growRun.recordEnvironmentalConditions(time, { co2: 9 });
		growRun.recordEnvironmentalConditions(time, { humidity: 9 });

		// CHECK CURRENT MESSAGES AND
		// WAIT UNTIL NEXT READINGS "SHOULD" ARRIVE
		cy.wait(60_000); // wait until GR starts
		cy.wait(notificationRequirements.ENVIRONMENTAL_DATA_INTERVAL * 2);

		cy.url().then((url) => {
			const growRunId = url.split(growRunsManager.entityURL + '/')[1];
			growRun.waitForAndTestNotification(
				startTime.toISOString(),
				growRunId,
				notificationFormat,
				{
					'water-temperature': {
						numRecordingsMissed: 1,
						lastRecordingDateTime: null
					}
				},
				mailjs
			);

			// WAIT UNTIL ENOUGH RECORDINGS ARE MISSED TO SEND NEXT NOTIFICATION
			cy.wait(notificationRequirements.thresholdsInMS[1]).then(() => {
				growRun.waitForAndTestNotification(
					startTime.toISOString(),
					growRunId,
					notificationFormat,
					{
						'water-temperature': {
							numRecordingsMissed: 12,
							lastRecordingDateTime: null
						},
						'air-temperature': { lastRecordingDateTime: time, numRecordingsMissed: 11 },
						humidity: { lastRecordingDateTime: time, numRecordingsMissed: 11 },
						co2: { lastRecordingDateTime: time, numRecordingsMissed: 11 }
					},
					mailjs
				);
			});
		});

		growRun.delete();
	});
});
