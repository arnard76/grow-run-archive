import dayjs from 'dayjs';

export let fastForwardedDays = 0;

export function fastForwardDays(numDays: number) {
	cy.clock().invoke('restore');
	fastForwardedDays += numDays;
	const fastForwardedDate = new Date(dayjs().add(fastForwardedDays, 'days').valueOf());
	cy.clock(fastForwardedDate, ['Date']);
}
