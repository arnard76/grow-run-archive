// different type of conditions

import type { TemperatureRecord } from './temperature/types';

type Conditions = {
	'air-temperature'?: TemperatureRecord[];
	'water-temperature'?: TemperatureRecord[];
};

export default Conditions;
