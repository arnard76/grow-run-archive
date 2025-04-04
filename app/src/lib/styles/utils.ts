export function standardiseColour(colourString: string) {
	var ctx = document.createElement('canvas').getContext('2d')!;
	ctx.fillStyle = colourString;
	return ctx.fillStyle;
}
