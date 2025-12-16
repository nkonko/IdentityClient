import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-input-wrapper">
      <label *ngIf="label()" class="skeleton-label">{{ label() }}</label>
      <div class="skeleton-input" [style.height.px]="height()"></div>
    </div>
  `,
  styles: [`
    .skeleton-input-wrapper {
      margin-bottom: 1rem;
      width: 100%;
    }

    .skeleton-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      min-width: 80px;
      height: 14px;
    }

    .skeleton-input {
      width: 100%;
      background: #e0e0e0;
      border-radius: 4px;
      height: 40px;
    }
  `]
})
export class SkeletonInputComponent {
  label = input<string>('');
  height = input<number>(40);
}
