import dayjs from '@grow-run-archive/dayjs';
import { DateTime, displayFormatForDateTime } from '../../datetime.js';
import { GrowRunType } from '../index.js';
import { verboseConditionName } from './condition.js';
import { NotificationInformation } from './missingDataNotification.js';

export default (
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
	const { durationMissed } = notificationInfo.mostMissingDataSummary;

	const datasets = Object.entries(notificationInfo.missingData).map(([conditionName]) => ({
		label: conditionName,
		data: [5]
	}));

	const chartJSConfig = {
		type: 'line',

		data: {
			xLabels: [
				'last\t' + displayFormatForDateTime(dayjs().subtract(2, 'months').toISOString()),
				displayFormatForDateTime(dayjs().toISOString())
			],
			datasets
		}
	};

	return `
	<img src='https://static.vecteezy.com/system/resources/thumbnails/045/888/005/small_2x/mysterious-dark-tunnel-entrance-with-mossy-walls-leading-into-the-unknown-evoking-a-sense-of-adventure-and-exploration-video.jpg'>
	<br>
	<br>
	<section>
		<h3>Summary</h3>
		<p>${durationMissed} worth of environmental data missing for grow run:</p>
		<ul>
		<li>name: ${growRunName}</li>
		<li>id: ${growRunId}</li>
		</ul>
		<br>
		<p>Environmental data includes:</p>

		<ul>
			${Object.entries(notificationInfo.missingData)
				.map(
					([conditionName, { lastRecordingDateTime }]) =>
						`<li>${verboseConditionName(conditionName)} (${dayjs(lastRecordingDateTime || growRunStartTime).fromNow(true)})</li>`
				)
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
				${Object.entries(notificationInfo.missingData)
					.map(
						([conditionName, { lastRecordingDateTime, numRecordingsMissed }]) =>
							`<tr style="background-color: lightblue;">
							<td style="padding: 5px 15px;border-top-left-radius: 10px; border-bottom-left-radius: 10px;">${verboseConditionName(conditionName)}</td>
							<td style="padding: 5px 15px;">${lastRecordingDateTime ? displayFormatForDateTime(lastRecordingDateTime, 'Pacific/Auckland') : 'GR started: ' + displayFormatForDateTime(growRunStartTime, 'Pacific/Auckland')}</td>
							<td style="padding: 5px 15px;">${dayjs(lastRecordingDateTime || growRunStartTime).fromNow(true)}</td>
							<td style="padding: 5px 15px;border-top-right-radius: 10px; border-bottom-right-radius: 10px;">${numRecordingsMissed}</td>
							</tr>`
					)
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
