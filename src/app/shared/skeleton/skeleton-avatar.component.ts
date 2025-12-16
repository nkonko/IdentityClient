import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-avatar" [style.width.px]="size()" [style.height.px]="size()"></div>
  `,
  styles: [`
    .skeleton-avatar {
      background: #e0e0e0;
      border-radius: 50%;
      width: 120px;
      height: 120px;
      flex-shrink: 0;
    }
  `]
})
export class SkeletonAvatarComponent {
  size = input<number>(120);
}
