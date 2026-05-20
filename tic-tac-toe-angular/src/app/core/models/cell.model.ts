import { Player } from './player.model';

/**
 * A single board cell. `null` represents an empty cell.
 * Index (0-8) is implicit by position in the GameState.board array.
 */
export type Cell = Player | null;
