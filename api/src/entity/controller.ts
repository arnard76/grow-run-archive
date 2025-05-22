import { Request, Response } from 'express';
type ControllerFunction = (req: Request, res: Response) => Promise<Response | void>;

export interface EntityController {
	get?: ControllerFunction;
	create?: ControllerFunction;
	delete?: ControllerFunction;
	edit?: ControllerFunction;
	replace?: ControllerFunction;
}
