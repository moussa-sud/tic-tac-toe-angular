import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';

/**
 * 404 — handled by the `**` wildcard route. Plays into the editorial
 * voice: an off-board move that doesn't count.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  goHome(): void {
    this.router.navigateByUrl('/');
  }

  play(): void {
    this.router.navigateByUrl('/play');
  }
}
