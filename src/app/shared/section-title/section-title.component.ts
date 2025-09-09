import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent {
  private readonly route = inject(ActivatedRoute);

  // Derive title from the deepest activated route that has data.title
  private readonly currentRoute = signal(this.route);

  title = computed(() => {
    let ar = this.currentRoute();
    // Walk down to the deepest child
    while (ar.firstChild) {
      ar = ar.firstChild;
    }
    const dataTitle = ar.snapshot.data?.['title'] as string | undefined;
    return dataTitle ?? '';
  });
}
