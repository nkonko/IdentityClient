import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent {
  width = input<string>('100%');
  height = input<string>('1rem');
  shape = input<'rect' | 'circle'>('rect');
  borderRadius = input<string | undefined>(undefined);

  computedStyle = computed(() => {
    const style: any = {
      width: this.width(),
      height: this.height(),
    };

    if (this.borderRadius()) {
      style.borderRadius = this.borderRadius();
    } else {
      style.borderRadius = this.shape() === 'circle' ? '50%' : '4px';
    }

    return style;
  });
}
