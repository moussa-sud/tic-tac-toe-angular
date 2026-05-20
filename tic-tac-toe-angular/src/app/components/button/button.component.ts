import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Reusable AppButton.
 *
 * Inputs:
 *  - variant : visual treatment — 'primary' | 'ghost' | 'outline'
 *  - size    : 'sm' | 'md' | 'lg'
 *  - type    : native button type
 *  - disabled: standard disabled flag
 *
 * Output:
 *  - press   : fired on click (the name 'press' avoids colliding with
 *              DOM's native `click` event which can confuse some bindings)
 *
 * Content projection is used so callers can drop in any label or icon:
 *   <app-button variant="primary">Start round</app-button>
 */
@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'ghost' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  /** Optional aria-label, useful for icon-only buttons. */
  @Input() ariaLabel?: string;

  @Output() press = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (this.disabled) return;
    this.press.emit(event);
  }
}
