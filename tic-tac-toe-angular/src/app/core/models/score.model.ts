/**
 * Persisted scoreboard. Stored in localStorage so the player's
 * running tally survives full-page refreshes — no backend required.
 */
export interface ScoreBoard {
  x: number;
  o: number;
  draws: number;
  /** Total rounds played, derived but stored for convenience. */
  rounds: number;
  /** ISO timestamp of last update — handy on the results page. */
  updatedAt: string;
}

/** Empty/initial scoreboard used by the service. */
export const EMPTY_SCORE: ScoreBoard = {
  x: 0,
  o: 0,
  draws: 0,
  rounds: 0,
  updatedAt: new Date(0).toISOString(),
};
