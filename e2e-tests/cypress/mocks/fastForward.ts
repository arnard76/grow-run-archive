import dayjs, { ManipulateType } from 'dayjs';
export let fastForwardedTime = dayjs();

/**
 * This only fast forwards the date and time on the user's computer
 * IT DOES NOT fast forward the actual time! (so other computers are still using the actual time)
 */
export function fastForward(num: number, duration: ManipulateType = 'days') {
	cy.clock().invoke('restore');
	fastForwardedTime = fastForwardedTime.add(num, duration);
	cy.clock(new Date(fastForwardedTime.valueOf()), ['Date']);
}
