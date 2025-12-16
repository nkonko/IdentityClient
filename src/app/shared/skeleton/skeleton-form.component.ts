import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-form" [class.two-columns]="columns() === 2">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .skeleton-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;

      &.two-columns {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }
    }
  `]
})
export class SkeletonFormComponent {
  columns = input<1 | 2>(1);
}
