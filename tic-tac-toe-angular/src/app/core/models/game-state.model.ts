import { Cell } from './cell.model';
import { Player } from './player.model';

/**
 * GameStatus describes which phase the round is in.
 *  - 'idle'    : board reset, no moves yet
 *  - 'playing' : at least one move made, no winner yet
 *  - 'won'     : a player has won (winner + winningLine populated)
 *  - 'draw'    : board is full with no winner
 */
export type GameStatus = 'idle' | 'playing' | 'won' | 'draw';

/**
 * Complete game state as a single immutable snapshot.
 * The service emits new snapshots through a BehaviorSubject so any
 * subscribing component receives the entire updated state at once.
 */
export interface GameState {
  /** Flat 9-cell board, row-major (indices 0-2 top row, 3-5 middle, 6-8 bottom). */
  board: Cell[];
  /** The player whose turn is next. */
  currentPlayer: Player;
  /** Lifecycle phase of the round. */
  status: GameStatus;
  /** Winning player, if any. */
  winner: Player | null;
  /** Indices of the 3 winning cells — used to draw the strike-through line. */
  winningLine: number[] | null;
  /** Move count, primarily for HUD display. */
  moveCount: number;
  /** Epoch millis when the round started — used by HUD to derive elapsed time. */
  startedAt: number | null;
}
