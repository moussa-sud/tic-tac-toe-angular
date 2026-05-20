import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cell } from '../../core/models/cell.model';
import { CellComponent } from '../cell/cell.component';

/**
 * The 3x3 game board.
 *
 * Pure presentational: it knows about cells and the winning line,
 * but does not own state. It receives `board` + `winningLine`
 * from the parent (the Game page) and bubbles cell clicks up via `pick`.
 *
 * This separation makes the grid easy to unit test in isolation —
 * pass it a board and it renders exactly that board.
 */
@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
  @Input({ required: true }) board: Cell[] = [];
  @Input() winningLine: number[] | null = null;
  /** When true (round over), cells stop responding to input. */
  @Input() locked = false;

  @Output() pick = new EventEmitter<number>();

  /** True when this cell index is part of the winning triple. */
  isWinning(i: number): boolean {
    return this.winningLine?.includes(i) ?? false;
  }

  /** Stagger entrance — cells nearer top-left appear first. */
  enterDelay(i: number): number {
    return i * 40;
  }

  onPick(i: number): void {
    if (this.locked) return;
    this.pick.emit(i);
  }

  /** Stable trackBy — board indices are stable, so use them directly. */
  trackByIndex(index: number): number {
    return index;
  }
}
