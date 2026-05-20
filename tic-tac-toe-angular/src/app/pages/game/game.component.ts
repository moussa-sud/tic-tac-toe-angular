import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';

import { GameService } from '../../core/services/game.service';
import { ScoreService } from '../../core/services/score.service';
import { GameState } from '../../core/models/game-state.model';
import { ScoreBoard } from '../../core/models/score.model';

import { GridComponent } from '../../components/grid/grid.component';
import { GameHudComponent } from '../../components/game-hud/game-hud.component';
import { ButtonComponent } from '../../components/button/button.component';

/**
 * Game page — composes HUD on top, Grid in the middle, and an action
 * bar at the bottom (View results / Restart). Subscribes to both the
 * game state and the persistent scoreboard via combineLatest so a
 * single subscription drives the entire view.
 */
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, GridComponent, GameHudComponent, ButtonComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly game = inject(GameService);
  private readonly scoreSvc = inject(ScoreService);
  private readonly router = inject(Router);

  /** Current snapshots — bound directly in the template. */
  state!: GameState;
  scores!: ScoreBoard;

  private sub?: Subscription;

  ngOnInit(): void {
    // Make sure the board is reset for a fresh round when we enter
    // the page directly via URL (vs. clicking Start on the home page).
    if (this.game.snapshot.status === 'won' || this.game.snapshot.status === 'draw') {
      this.game.reset();
    }

    this.sub = combineLatest([this.game.state$, this.scoreSvc.board$]).subscribe(
      ([state, scores]) => {
        this.state = state;
        this.scores = scores;
      },
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** Forward cell click → service. */
  onPick(index: number): void {
    this.game.play(index);
  }

  /** HUD restart button → new round on same scoreboard. */
  onRestart(): void {
    this.game.reset();
  }

  /** Navigate to the results page (also reachable mid-round). */
  viewResults(): void {
    this.router.navigateByUrl('/result');
  }

  /** Convenience: true once the round is over. */
  get isOver(): boolean {
    return this.state.status === 'won' || this.state.status === 'draw';
  }
}
