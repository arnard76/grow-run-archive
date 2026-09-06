import z from 'zod';
import { DateTimeSchema } from '../datetime.js';

const ResourceUsageSchema = z.object({
	resourceName: z.string(),
	amountUsed: z.float64(),
	datetime: DateTimeSchema
});

export type ResourceUsage = z.infer<typeof ResourceUsageSchema>;
