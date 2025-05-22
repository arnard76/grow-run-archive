import { Coords } from '@grow-run-archive/definitions';

export const mockLocation = (coords: Coords) => ({
	onBeforeLoad(win) {
		cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb, err) => {
			if (coords.latitude && coords.longitude) {
				return cb({ coords });
			}
		});
	}
});
