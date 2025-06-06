import dayjs from '@grow-run-archive/dayjs';
import { DateTime, displayFormatForDateTime } from '../../../datetime.js';
import { GrowRunType } from '../../index.js';
import { verboseConditionName } from '../condition.js';
import { NotificationInformation, NotificationRequirements } from './NotifyRules.js';

export class NotificationFormat {
	notificationRequirements: NotificationRequirements;
	constructor(notificationRequirements: NotificationRequirements) {
		this.notificationRequirements = notificationRequirements;
	}

	messageSubject(growRunName: GrowRunType['name'], growRunId: GrowRunType['id']) {
		return `Environment not recording for ${growRunName} (${growRunId})`;
	}

	calculateDurationMissed(numRecordingsMissed: number) {
		return dayjs()
			.add(numRecordingsMissed * this.notificationRequirements.ENVIRONMENTAL_DATA_INTERVAL)
			.fromNow(true);
	}

	messageContents = (
		growRunName: GrowRunType['name'],
		growRunId: GrowRunType['id'],
		growRunStartTime: DateTime,
		notificationInfo: NotificationInformation
	) => {
		// const conditionWithTheMostDataLoss = Object.entries(notificationInfo).sort(
		// 	([, missingData], [, missingData2]) =>
		// 		missingData.numOfMissingRecordings - missingData2.numOfMissingRecordings
		// )[0][0];
		// const { lastRecordingDateTime: leastRecentRecordingDateTime } =
		// 	notificationInfo[conditionWithTheMostDataLoss];
		// const longestDurationMissed = dayjs(leastRecentRecordingDateTime).fromNow();

		const { numRecordingsMissed: mostNumRecordingsMissed } = Object.values(
			notificationInfo
		).toSorted((c1, c2) =>
			dayjs(c1.lastRecordingDateTime || growRunStartTime).diff(
				c2.lastRecordingDateTime || growRunStartTime
			)
		)[0];

		const mostDurationMissed = this.calculateDurationMissed(mostNumRecordingsMissed);

		const datasets = Object.entries(notificationInfo).map(([conditionName]) => ({
			label: conditionName,
			data: [5]
		}));

		const chartJSConfig = {
			type: 'line',

			data: {
				xLabels: [
					'GR start' + displayFormatForDateTime(growRunStartTime),
					displayFormatForDateTime(dayjs().toISOString())
				],
				datasets
			}
		};

		const sortedMissingConditions = Object.entries(notificationInfo).toSorted(function (a, b) {
			if (a[0] < b[0]) {
				return -1;
			}
			if (a[0] > b[0]) {
				return 1;
			}
			return 0;
		});

		return `
	<img src='https://static.vecteezy.com/system/resources/thumbnails/045/888/005/small_2x/mysterious-dark-tunnel-entrance-with-mossy-walls-leading-into-the-unknown-evoking-a-sense-of-adventure-and-exploration-video.jpg'>
	<br>
	<br>
	<section>
		<h3>Summary</h3>
		<p>${mostDurationMissed} worth of environmental data missing for grow run:</p>
		<ul>
		<li>name: ${growRunName}</li>
		<li>id: ${growRunId}</li>
		</ul>
		<br>
		<p>Environmental data includes:</p>

		<ul>
			${sortedMissingConditions
				.map(([conditionName, { lastRecordingDateTime, numRecordingsMissed }]) => {
					const durationMissed = this.calculateDurationMissed(numRecordingsMissed);

					return `<li>${verboseConditionName(conditionName)} (${durationMissed})</li>`;
				})
				.join('\n')}
		</ul>
	</section>
	<section>
		<h3>Missing Data</h3>
		<div style="width: 90%; overflow-x: auto;">
		<table style="width: 95vw;border-spacing: 0.3rem;">
			<thead>
				<tr style="text-align: left;">
					<th style="padding: 15px;">Environmental condition</th>
					<th style="padding: 15px;">Last recording (NZST)</th>
					<th style="padding: 15px;">Missing time</th>
					<th style="padding: 15px;">Number of missed recordings</th>
				</tr>
			</thead>

			<tbody>
				${sortedMissingConditions
					.map(([conditionName, { lastRecordingDateTime, numRecordingsMissed }]) => {
						const durationMissed = this.calculateDurationMissed(numRecordingsMissed);

						return `<tr style="background-color: lightblue;">
							<td style="padding: 5px 15px;border-top-left-radius: 10px; border-bottom-left-radius: 10px;">${verboseConditionName(conditionName)}</td>
							<td style="padding: 5px 15px;">${lastRecordingDateTime ? displayFormatForDateTime(lastRecordingDateTime, 'Pacific/Auckland') : 'GR started: ' + displayFormatForDateTime(growRunStartTime, 'Pacific/Auckland')}</td>
							<td style="padding: 5px 15px;">${durationMissed}</td>
							<td style="padding: 5px 15px;border-top-right-radius: 10px; border-bottom-right-radius: 10px;">${numRecordingsMissed}</td>
							</tr>`;
					})
					.join('\n')}
			</tbody>
		</table>
		</div>
	</section>

	<section>
		<h3>Timeline</h3>
		<p style="font-style: italic">WIP 👇👇</p>
		<img src="https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartJSConfig))}" />
		<p>☝️☝️ powered by: <a href="https://quickchart.io/documentation/use-chart-js-in-email/">Quickchart</a></p>
	</section>
`;
	};
}
