import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { GameService } from '../../core/services/game.service';

/**
 * Home page — editorial landing with a single, decisive call to action.
 * Selecting "Start round" resets the game state and navigates to /play.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly game = inject(GameService);

  start(): void {
    this.game.reset();
    this.router.navigateByUrl('/play');
  }

  viewScores(): void {
    this.router.navigateByUrl('/result');
  }
}
