import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cell } from '../../core/models/cell.model';

/**
 * A single tile of the board.
 *
 * Inputs:
 *  - value     : the marker in the cell (or null when empty)
 *  - index     : 0..8 — used by the parent grid to identify which cell was tapped
 *  - winning   : true if this cell is part of the winning line — used for highlight
 *  - disabled  : true once the game is over OR the cell is already taken
 *  - delay     : staggered animation delay (ms) for board entrance
 *
 * Output:
 *  - pick      : emits this cell's index when clicked
 *
 * The X and O glyphs are drawn as SVG paths with a `stroke-dasharray`
 * trick so they appear to "draw themselves" when they first render.
 */
@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
})
export class CellComponent {
  @Input({ required: true }) value!: Cell;
  @Input({ required: true }) index!: number;
  @Input() winning = false;
  @Input() disabled = false;
  @Input() delay = 0;

  @Output() pick = new EventEmitter<number>();

  /** Click handler — only emits when interactive. */
  onActivate(): void {
    if (this.disabled || this.value !== null) return;
    this.pick.emit(this.index);
  }

  /** Keyboard-accessible activation (Enter / Space). */
  onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onActivate();
    }
  }
}
