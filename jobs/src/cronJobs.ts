import cron from 'node-cron';
import { NotificationRequirements } from '@grow-run-archive/definitions';
import dayjs from '@grow-run-archive/dayjs';

const notificationRequirements = new NotificationRequirements(process.env.PUBLIC_ENV);

interface MissingEnvironmentNotificationsCronJob {
	start(): void;

	// stop(): void;
}

class MissingEnvironmentNotificationsCronJobLocal
	implements MissingEnvironmentNotificationsCronJob
{
	start() {
		if (!(process.env.PUBLIC_API_URL as string).includes('localhost')) return;
		let loading = false;

		const job = async () => {
			if (loading) {
				console.log('Previous run is still in progress!');
				await new Promise((r) => setTimeout(r, 2000));
				return;
			}
			loading = true;
			try {
				console.log('REQUESTING MISSING ENVIRONMENT NOTIFICATION ENDPOINT');
				setTimeout(() => (loading = false), 15000);

				const status = (await fetch(`${process.env.PUBLIC_API_URL}/notify-if-missing-environment`))
					.status;
				if (status !== 200) {
					setTimeout(() => (loading = false), 5000);
					throw Error('Cron-Job failed with status ' + status);
				}
				loading = false;
			} catch (e) {
				console.error(e);
			} finally {
			}
		};

		const intervalInSeconds = Math.ceil(
			dayjs.duration(notificationRequirements.ENVIRONMENTAL_DATA_INTERVAL / 15).asSeconds()
		);
		if (intervalInSeconds > 59) return cron.schedule('* * * * *', job);

		cron.schedule(`*/${intervalInSeconds} * * * * *`, job);
	}

	// stop() {
	// 	if (this.interval) {
	// 		clearInterval(this.interval);
	// 		this.interval = null;
	// 	}
	// }
}

class MissingEnvironmentNotificationsCronJobDeployed
	implements MissingEnvironmentNotificationsCronJob
{
	// setup on cron-jobs.com if it doesn't already exist?
	start() {}

	// delete job on cron-jobs.com?
	// stop() {}
}

console.log('Cron jobs time');

async function createMissingEnvironmentNotificationsCronJob() {
	if (!process.env.PUBLIC_API_URL) throw Error('PUBLIC_API_URL not defined');

	return process.env.PUBLIC_API_URL.includes('localhost')
		? new MissingEnvironmentNotificationsCronJobLocal()
		: new MissingEnvironmentNotificationsCronJobDeployed();
}

createMissingEnvironmentNotificationsCronJob().then((cronJob) => cronJob.start());
