import dayjs, { ManipulateType } from 'dayjs';
import MILLISECONDS_IN_DAY from '@stdlib/constants-time-milliseconds-in-day';
export let fastForwardedDays = 0;

export function fastForward(num: number, duration: ManipulateType = 'days') {
	cy.clock().invoke('restore');
	let newDate = dayjs().add(num, duration).valueOf();
	fastForwardedDays += (newDate - dayjs().valueOf()) / MILLISECONDS_IN_DAY;
	cy.clock(new Date(newDate), ['Date']);
}
