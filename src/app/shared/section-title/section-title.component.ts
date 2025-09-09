import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly currentRoute = signal(this.route);

  title = computed(() => {
    let ar = this.currentRoute();
    while (ar.firstChild) ar = ar.firstChild;
    return (ar.snapshot.data?.['title'] as string | undefined) ?? '';
  });

  subtitle = computed(() => {
    let ar = this.currentRoute();
    while (ar.firstChild) ar = ar.firstChild;
    return (ar.snapshot.data?.['subtitle'] as string | undefined) ?? '';
  });
}
