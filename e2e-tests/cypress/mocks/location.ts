import { Coords } from '@grow-run-archive/definitions';

export const mockLocation = (coords?: Coords) => ({
	onBeforeLoad(win: Window) {
		const FAKE_POSITION: Coords = coords || {
			latitude: 22.782868482464906,
			longitude: -102.68016374274475
		};
		cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb, err) => {
			return cb({ coords: FAKE_POSITION });
		});
	}
});
