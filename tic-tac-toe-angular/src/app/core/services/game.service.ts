import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { Player } from '../models/player.model';
import { Cell } from '../models/cell.model';
import { ScoreService } from './score.service';

/**
 * The 8 possible winning line index sets on a 3x3 board.
 * Three rows + three columns + two diagonals.
 * Defined once at module scope — no need to rebuild per check.
 */
const WIN_LINES: ReadonlyArray<ReadonlyArray<number>> = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // columns
  [0, 4, 8], [2, 4, 6],              // diagonals
];

/** Factory for the initial/reset GameState. */
function initialState(): GameState {
  return {
    board: Array<Cell>(9).fill(null),
    currentPlayer: 'X', // X traditionally moves first
    status: 'idle',
    winner: null,
    winningLine: null,
    moveCount: 0,
    startedAt: null,
  };
}

/**
 * GameService — single source of truth for the active round.
 *
 * Architecture: state is held in a BehaviorSubject so that any component
 * that subscribes to `state$` immediately receives the latest snapshot.
 * All mutations go through `play()` and `reset()` — components never
 * mutate the state object themselves, which keeps the model predictable.
 *
 * `providedIn: 'root'` makes this a singleton across the whole app, so
 * the Game page and HUD see the exact same data.
 */
@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly score = inject(ScoreService);

  private readonly _state$ = new BehaviorSubject<GameState>(initialState());

  /** Observable feed of game state — components consume via `async` pipe. */
  readonly state$: Observable<GameState> = this._state$.asObservable();

  /** Synchronous snapshot, useful for one-off reads. */
  get snapshot(): GameState {
    return this._state$.value;
  }

  /**
   * Attempt to place the current player's mark in the given cell.
   * Silently no-ops if the cell is taken, the game is over, or
   * the index is out of bounds — keeping consumer code simple.
   */
  play(index: number): void {
    const current = this._state$.value;

    // Guard: ignore invalid moves rather than throwing — calling
    // components don't need a try/catch around every click.
    if (
      index < 0 ||
      index > 8 ||
      current.board[index] !== null ||
      current.status === 'won' ||
      current.status === 'draw'
    ) {
      return;
    }

    // Immutable update — clone the board, place the mark.
    const board = [...current.board];
    board[index] = current.currentPlayer;

    const moveCount = current.moveCount + 1;
    const startedAt = current.startedAt ?? Date.now();

    // Did this move close out a line?
    const winningLine = this.findWinningLine(board, current.currentPlayer);

    if (winningLine) {
      // Round won — bump the scoreboard, freeze the state.
      this.score.recordWin(current.currentPlayer);
      this._state$.next({
        ...current,
        board,
        moveCount,
        startedAt,
        status: 'won',
        winner: current.currentPlayer,
        winningLine,
      });
      return;
    }

    if (moveCount === 9) {
      // All cells filled with no winner — it's a draw.
      this.score.recordDraw();
      this._state$.next({
        ...current,
        board,
        moveCount,
        startedAt,
        status: 'draw',
      });
      return;
    }

    // Continue — flip the turn.
    this._state$.next({
      ...current,
      board,
      moveCount,
      startedAt,
      status: 'playing',
      currentPlayer: current.currentPlayer === 'X' ? 'O' : 'X',
    });
  }

  /**
   * Reset the board for a new round. The active starting player
   * alternates between rounds so neither side keeps the X advantage.
   */
  reset(): void {
    const previousStarter = this._state$.value.currentPlayer;
    const next = initialState();
    // If a round was in progress, hand the next opening move to the
    // OTHER side so the X-first bias doesn't always favor the same player.
    if (this._state$.value.status === 'idle') {
      next.currentPlayer = 'X';
    } else {
      next.currentPlayer = previousStarter === 'X' ? 'O' : 'X';
    }
    this._state$.next(next);
  }

  /** Reset both round state and the scoreboard. Used by the Results page. */
  hardReset(): void {
    this.score.clear();
    this._state$.next(initialState());
  }

  /**
   * Scan all 8 win lines; if any contains three of the given player's
   * marks, return that line. Otherwise return null.
   */
  private findWinningLine(board: Cell[], player: Player): number[] | null {
    for (const line of WIN_LINES) {
      if (line.every((i) => board[i] === player)) {
        return [...line];
      }
    }
    return null;
  }
}
