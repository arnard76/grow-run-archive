import { DateTime } from '../datetime.js';

export type Harvest = {
	datetime: DateTime;
	numberOfLeaves: number;
	massOfLeaves: number;
	qualityNotes?: string;
};
