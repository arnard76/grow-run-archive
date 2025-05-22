export const mockMissingEnvironmentNotifyCronJob = () => {
	if (
		!(Cypress.env('PUBLIC_API_URL') as string).includes('localhost') &&
		(Cypress.env('PUBLIC_API_URL') as string).includes('render')
	)
		return;

	return setInterval(
		() => fetch(`${Cypress.env('PUBLIC_API_URL')}/notify-if-missing-environment`),
		60 * 1000
	);
};
