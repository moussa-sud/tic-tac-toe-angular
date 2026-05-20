/**
 * A Player is simply a marker: 'X' or 'O'.
 * Using a discriminated union here keeps the type system strict —
 * the game service can never accidentally place an unknown marker.
 */
export type Player = 'X' | 'O';
