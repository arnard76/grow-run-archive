// for nz, use county to represent the city because 'Auckland' is considered a county lol
export type Location = Coords & { address: { city: string; county: string; country: string } };
export type Coords = { longitude: number; latitude: number };
