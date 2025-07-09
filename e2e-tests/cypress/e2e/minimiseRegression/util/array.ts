export function randomlySample<B>(array: B[]): B {
	return array[Math.floor(Math.random() * array.length)];
}
