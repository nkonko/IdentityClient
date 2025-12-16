import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-button" [style.width.px]="width()" [style.height.px]="height()"></div>
  `,
  styles: [`
    .skeleton-button {
      background: #e0e0e0;
      border-radius: 4px;
      width: 120px;
      height: 40px;
    }
  `]
})
export class SkeletonButtonComponent {
  width = input<number>(120);
  height = input<number>(40);
}
