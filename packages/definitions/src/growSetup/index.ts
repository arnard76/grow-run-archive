import z from 'zod/v4';
import { ActionNames } from '../entity/actions.js';

const versionRegex = /^(\d+\.)?(\d+\.)?(\*|\d+)$/;

const GrowSetupSchema = z.object({
	id: z.string(),
	// should match 'number.number.number' ....
	version: z.string().regex(versionRegex),
	nickname: z.string().optional(),
	link: z.url().optional()
});

export type GrowSetupType = z.infer<typeof GrowSetupSchema>;

export class GrowSetup {
	id: GrowSetupType['id'];
	version: GrowSetupType['version'];
	nickname: GrowSetupType['nickname'];
	link: GrowSetupType['link'];

	constructor(growSetupData: GrowSetupType) {
		const { id, version, link, nickname } = GrowSetupSchema.parse(growSetupData);
		this.id = id;
		this.version = version;
		this.nickname = nickname;
		this.link = link;
	}

	get name(): string {
		if (!this.nickname) return `Grow Setup #${this.version}`;
		return `Grow Setup #${this.version} - ${this.nickname}`;
	}

	/** name but without the nickname */
	get shortName() {
		return this.name.split('-')[0];
	}
}

class GrowSetupActionNames extends ActionNames {
	constructor() {
		super('Grow Setup');
	}
}

export const growSetupActionNames = new GrowSetupActionNames();
