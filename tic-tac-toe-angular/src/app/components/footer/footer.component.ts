import { Component } from '@angular/core';

/**
 * Slim editorial footer with a fine line above and a credit line.
 * Pure presentational component — no inputs, no state.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
