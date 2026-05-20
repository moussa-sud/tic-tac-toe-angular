import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EMPTY_SCORE, ScoreBoard } from '../models/score.model';
import { Player } from '../models/player.model';

const STORAGE_KEY = 'tres.scoreboard.v1';

/**
 * ScoreService — owns the persistent tally of wins/draws.
 *
 * Persists to localStorage so the scoreboard survives reloads even
 * though there's no backend. Wrapped in try/catch because storage
 * can throw in private browsing modes — failures degrade silently
 * to an in-memory-only scoreboard (still functional during the session).
 */
@Injectable({ providedIn: 'root' })
export class ScoreService {
  private readonly _board$ = new BehaviorSubject<ScoreBoard>(this.load());

  /** Reactive feed of the scoreboard. */
  readonly board$: Observable<ScoreBoard> = this._board$.asObservable();

  /** Synchronous snapshot. */
  get snapshot(): ScoreBoard {
    return this._board$.value;
  }

  recordWin(player: Player): void {
    const prev = this._board$.value;
    const next: ScoreBoard = {
      ...prev,
      x: player === 'X' ? prev.x + 1 : prev.x,
      o: player === 'O' ? prev.o + 1 : prev.o,
      rounds: prev.rounds + 1,
      updatedAt: new Date().toISOString(),
    };
    this.commit(next);
  }

  recordDraw(): void {
    const prev = this._board$.value;
    this.commit({
      ...prev,
      draws: prev.draws + 1,
      rounds: prev.rounds + 1,
      updatedAt: new Date().toISOString(),
    });
  }

  clear(): void {
    this.commit({ ...EMPTY_SCORE, updatedAt: new Date().toISOString() });
  }

  // ----- persistence -------------------------------------------------

  private commit(next: ScoreBoard): void {
    this._board$.next(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (Safari private mode, etc.) — no-op.
    }
  }

  private load(): ScoreBoard {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...EMPTY_SCORE };
      const parsed = JSON.parse(raw) as ScoreBoard;
      // Light shape check — fall back to empty if the payload looks off.
      if (
        typeof parsed.x === 'number' &&
        typeof parsed.o === 'number' &&
        typeof parsed.draws === 'number'
      ) {
        return parsed;
      }
      return { ...EMPTY_SCORE };
    } catch {
      return { ...EMPTY_SCORE };
    }
  }
}
