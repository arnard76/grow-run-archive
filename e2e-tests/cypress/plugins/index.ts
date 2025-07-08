import cypressTypeScriptPreprocessor from './cyTypescriptPreprocessor';

export default (on: any) => {
	on('file:preprocessor', cypressTypeScriptPreprocessor);
};
