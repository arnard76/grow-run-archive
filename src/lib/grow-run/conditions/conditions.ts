// different type of conditions

import type { Temperature } from './temperature/types';

type Conditions = { 'air-temperature'?: Temperature[]; 'water-temperature'?: Temperature[] };

export default Conditions;
