import Mailjs from '@cemalgnlts/mailjs';
import dayjs from '@grow-run-archive/dayjs';
import {
	NotificationFormat,
	NotificationRequirements,
	verboseConditionName
} from '@grow-run-archive/definitions';
import { fastForward, fastForwardedTime } from '../../mocks/fastForward';
import { GrowRunManager, growRunsManager } from './actions/growRunActions';
import { resourcesManager } from './actions/resourceActions';
import { User } from './actions/userActions';
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
const mailjs = new Mailjs();

describe('Grow Run Archive', () => {
	let user: User;

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
				user = new User({ username: mailjs.address, password: mailjs.address });
				user.signup();
				user.login();
			});
		});
	});

	it('analyses a grow run', () => {
		let daysPassedAtStart = fastForwardedTime;
		resourcesManager.addMultiple(exampleResources);

		const growRun = new GrowRunManager('BCKIN AKL - Grow Run #17');
		growRun.showAllDetails();
		growRun.start();

		const growRunCoords = {
			latitude: -36.866543630672965,
			longitude: 174.77844419626646
		};
		growRun.addLocation('with coords', growRunCoords);
		growRun.testLocationIsSet({
			coords: growRunCoords,
			address: {
				suburb: 'Newmarket',
				city: 'Auckland',
				country: 'New Zealand'
			}
		});

		growRunsManager.goToAll();
		growRun.showAllDetails();

		growRun.manuallyRecordUsageOfResources(resourceUsage1);

		fastForward(30);
		growRun.manuallyRecordHarvest(['30g 25leaves']);
		growRun.manuallyRecordUsageOfResources(resourceUsage2);

		const time = dayjs().toISOString();
		growRun.environment.recordConditions(time, { 'air-temperature': 9 }, user.credentials);
		// CHECK TODO on testCondition method
		// growRun.environment.testCondition('air-temperature', 9, time);
		growRun.environment.conditionsSection
			.findParentByHeading('section', verboseConditionName('air-temperature'))
			.find('canvas')
			.should('be.visible');
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
		const growRun = new GrowRunManager('Notification test');
		growRun.showAllDetails();
		const startTime = dayjs().add(1, 'minute').set('seconds', 0).set('milliseconds', 0); // so it starts in the same minute
		cy.wait(startTime.add(3, 'seconds').diff());
		growRun.start();

		// INITIAL ENVIRONMENT READINGS (only water temp missing)
		const time = startTime.add(notificationRequirements.ENVIRONMENTAL_DATA_INTERVAL * 0.95);
		const measurements = { 'air-temperature': 9, co2: 9, humidity: 9 };
		growRun.environment.recordConditions(time.toISOString(), measurements, user.credentials);

		// CHECK CURRENT MESSAGES AND
		// WAIT UNTIL NOTIFICATION SHOULD BE SENT
		cy.wait(notificationRequirements.ENVIRONMENTAL_DATA_INTERVAL);

		cy.url().then((url) => {
			const growRunId = url.split(growRunsManager.URL + '/')[1];
			growRun.environment.waitForAndTestNotification(
				startTime.toISOString(),
				growRunId,
				notificationFormat,
				{
					'water-temperature': {
						numRecordingsMissed: notificationRequirements.numRecordingsMissedInThresholds[0],
						lastRecordingDateTime: null
					}
				},
				mailjs
			);

			// WAIT UNTIL ENOUGH RECORDINGS ARE MISSED TO SEND NEXT NOTIFICATION
			const waitUntilSecondThreshold = startTime
				.add(notificationRequirements.thresholdsInMS[1])
				.diff();
			cy.wait(waitUntilSecondThreshold).then(() => {
				const mostRecordingsMissed = notificationRequirements.numRecordingsMissedInThresholds[1];
				growRun.environment.waitForAndTestNotification(
					startTime.toISOString(),
					growRunId,
					notificationFormat,
					{
						'water-temperature': {
							numRecordingsMissed: mostRecordingsMissed,
							lastRecordingDateTime: null
						},
						'air-temperature': {
							lastRecordingDateTime: time.toISOString(),
							numRecordingsMissed: mostRecordingsMissed - 1
						},
						humidity: {
							lastRecordingDateTime: time.toISOString(),
							numRecordingsMissed: mostRecordingsMissed - 1
						},
						co2: {
							lastRecordingDateTime: time.toISOString(),
							numRecordingsMissed: mostRecordingsMissed - 1
						}
					},
					mailjs
				);
			});
		});
	});

	after(() => {
		user.deleteUser();
	});
});
