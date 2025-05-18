import dayjs, { ManipulateType } from 'dayjs';
export let fastForwardedTime = dayjs();

export function fastForward(num: number, duration: ManipulateType = 'days') {
	cy.clock().invoke('restore');
	fastForwardedTime = fastForwardedTime.add(num, duration);
	cy.clock(new Date(fastForwardedTime.valueOf()), ['Date']);
}
