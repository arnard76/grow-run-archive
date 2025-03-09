import { GrowRun } from '@grow-run-archive/definitions';
import dayjs from 'dayjs';
import Timezone from 'dayjs/plugin/Timezone';
import DayJSUtc from 'dayjs/plugin/utc';

dayjs.extend(Timezone);
dayjs.extend(DayJSUtc);

export class GrowRunManager {
	growRunName: GrowRun['name'];

	constructor(growRunName: GrowRun['name']) {
		cy.visit('/');
		const addGrowRunButton = cy.findByRole('button', { name: /add grow run/i });
		addGrowRunButton.click();
		cy.findByPlaceholderText(/grow run name/i).type(growRunName);
		this.growRunName = growRunName;
		addGrowRunButton.click();
	}

	private openGrowRunModal() {
		cy.get('td').contains(this.growRunName).click();
	}
	start() {
		this.openGrowRunModal();
		cy.findAllByRole('button', { name: '✏️' }).eq(1).click();
		const startTime = dayjs();
		// const startTimeInput = startTime.tz('Pacific/Auckland').format('DD/MM/YYYY hh:mm a');
		const startTimeInput = startTime.tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm');
		cy.findByLabelText(/Start Date:/i).type(startTimeInput);
		cy.findByRole('button', { name: '✔️' }).click();

		// Check that GR has started
		cy.reload();
		this.openGrowRunModal();
		const displayedStartTime = startTime.tz('UTC').format('D MMM YYYY, h:mm a');
		cy.findByText(displayedStartTime).should('be.visible');
	}

	static clearAll() {
		cy.visit('/');
		cy.wait(4000);
		const growRuns = cy.get('table tr');

		growRuns.each(($growRun, index) => {
			if (index === 0) return;
			cy.wrap($growRun).click();
			cy.findByRole('button', { name: /Delete Grow Run/i }).click();
		});
	}
}
