export type Location = Coords & { address: { city: string; suburb: string; country: string } };
export type Coords = { longitude: number; latitude: number };
