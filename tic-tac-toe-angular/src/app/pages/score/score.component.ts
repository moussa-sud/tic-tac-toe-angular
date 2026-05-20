import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { GameService } from '../../core/services/game.service';
import { ScoreService } from '../../core/services/score.service';
import { GameState } from '../../core/models/game-state.model';
import { ScoreBoard } from '../../core/models/score.model';
import { ButtonComponent } from '../../components/button/button.component';

/**
 * Score / Results page.
 *
 * Two responsibilities:
 *  1) If the last round just ended, headline the outcome.
 *  2) Always show the persistent running tally + reset option.
 */
@Component({
  selector: 'app-score',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit, OnDestroy {
  private readonly game = inject(GameService);
  private readonly scoreSvc = inject(ScoreService);
  private readonly router = inject(Router);

  state!: GameState;
  scores!: ScoreBoard;
  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.subs.push(
      this.game.state$.subscribe((s) => (this.state = s)),
      this.scoreSvc.board$.subscribe((b) => (this.scores = b)),
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  /** Percentage win share for the visual bar — clamped to avoid /0. */
  share(value: number): number {
    const total = Math.max(1, this.scores.rounds);
    return Math.round((value / total) * 100);
  }

  /** Pretty-format the lastUpdated ISO timestamp. */
  get updatedAtLabel(): string {
    if (!this.scores?.updatedAt) return '—';
    const d = new Date(this.scores.updatedAt);
    if (Number.isNaN(d.getTime()) || d.getTime() === 0) return 'never';
    return d.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  playAgain(): void {
    this.game.reset();
    this.router.navigateByUrl('/play');
  }

  goHome(): void {
    this.router.navigateByUrl('/');
  }

  clearTally(): void {
    // Soft confirm via native dialog — destructive, so prompt first.
    const ok = confirm('Clear the running tally? This cannot be undone.');
    if (ok) this.game.hardReset();
  }
}
