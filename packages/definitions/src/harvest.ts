import { DateTime } from './datetime';

export type Harvest = {
	datetime: DateTime;
	numberOfLeaves: number;
	massOfLeaves: number;
	qualityNotes?: string;
};
