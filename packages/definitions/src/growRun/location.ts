export type Location = Coords & { address: { city: string; country: string } };
export type Coords = { longitude: number; latitude: number };
