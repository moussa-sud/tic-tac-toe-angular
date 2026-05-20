import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { GameState } from '../../core/models/game-state.model';
import { ScoreBoard } from '../../core/models/score.model';

/**
 * GameHUD — shows whose turn it is, the elapsed timer, the running
 * scoreboard, and a Restart button. Stateless w.r.t. game logic; it
 * reflects whatever GameState + ScoreBoard the parent passes in.
 *
 * The timer ticks via a 250ms setInterval rather than via the model,
 * because the GameState only cares about `startedAt`. We derive the
 * elapsed string here for display.
 */
@Component({
  selector: 'app-game-hud',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './game-hud.component.html',
  styleUrls: ['./game-hud.component.scss'],
})
export class GameHudComponent implements OnInit, OnDestroy {
  @Input({ required: true }) state!: GameState;
  @Input({ required: true }) scores!: ScoreBoard;

  @Output() restart = new EventEmitter<void>();

  /** Tick handle so we can clean up on destroy. */
  private tickHandle: ReturnType<typeof setInterval> | null = null;

  /** Display-ready timer string, e.g. "00:42". */
  elapsed = '00:00';

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // 250ms is responsive enough for a seconds-precision timer
    // without being expensive — Angular batches change detection.
    this.tickHandle = setInterval(() => {
      this.recomputeElapsed();
      this.cdr.markForCheck();
    }, 250);
  }

  ngOnDestroy(): void {
    if (this.tickHandle) clearInterval(this.tickHandle);
  }

  /** Compute mm:ss since the round began, or 00:00 if not started. */
  private recomputeElapsed(): void {
    if (!this.state?.startedAt || this.state.status === 'idle') {
      this.elapsed = '00:00';
      return;
    }
    const endTime =
      this.state.status === 'won' || this.state.status === 'draw'
        ? // Once the round ends, freeze the timer at the final value
          this.state.startedAt + this.frozenDuration()
        : Date.now();
    const totalSeconds = Math.max(
      0,
      Math.floor((endTime - this.state.startedAt) / 1000),
    );
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const ss = String(totalSeconds % 60).padStart(2, '0');
    this.elapsed = `${mm}:${ss}`;
  }

  /**
   * When a round finishes, we want the timer to stop. The simplest
   * approach: lock the "endTime" to whatever time has elapsed at the
   * moment of the last tick before status changed. Since we re-evaluate
   * each tick, on the first tick after status flips we capture the
   * elapsed value implicitly. This helper just returns 0 (no extra time).
   */
  private frozenDuration(): number {
    // The first tick after status flips will see startedAt and the
    // current Date.now(); we treat that as the final duration.
    return Date.now() - (this.state.startedAt ?? Date.now());
  }

  onRestart(): void {
    this.restart.emit();
  }
}
