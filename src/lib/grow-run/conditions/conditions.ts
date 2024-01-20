// different type of conditions

import type { TemperatureRecord } from './temperature/types';
import type { WaterLevelRecord } from './water-level/types';

type Conditions = {
	'air-temperature'?: TemperatureRecord[];
	'water-temperature'?: TemperatureRecord[];
	'water-level'?: WaterLevelRecord[];
};

export default Conditions;
