import type { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';

export const zoomConfig: ZoomPluginOptions = {
	zoom: {
		wheel: {
			enabled: true
		},
		pinch: {
			enabled: true
		},
		mode: 'x'
	},
	pan: {
		enabled: true,
		mode: 'x'
	},
	limits: { x: { min: 'original', max: 'original' } }
};
