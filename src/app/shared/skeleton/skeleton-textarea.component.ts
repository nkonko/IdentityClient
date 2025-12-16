import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-textarea',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-textarea-wrapper">
      <label *ngIf="label()" class="skeleton-label">{{ label() }}</label>
      <div class="skeleton-textarea" [style.height.px]="height()"></div>
    </div>
  `,
  styles: [`
    .skeleton-textarea-wrapper {
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

    .skeleton-textarea {
      width: 100%;
      background: #e0e0e0;
      border-radius: 4px;
      height: 120px;
    }
  `]
})
export class SkeletonTextareaComponent {
  label = input<string>('');
  height = input<number>(120);
}
