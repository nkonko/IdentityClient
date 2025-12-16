import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-profile-skeleton',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule],
  template: `
    <div class="skeleton-wrapper">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      pointer-events: none;
      user-select: none;

      // Ocultar todo el texto
      :deep(*) {
        color: transparent !important;
        background-clip: padding-box !important;
      }

      // Convertir inputs, textareas, selects en skeletons
      :deep(input),
      :deep(textarea),
      :deep(select),
      :deep(.mat-mdc-form-field),
      :deep(.mat-mdc-text-field-wrapper) {
        background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%) !important;
        background-size: 200% 100% !important;
        animation: skeleton-shimmer 1.5s infinite !important;
        border-radius: 4px !important;
        border-color: transparent !important;
        color: transparent !important;
      }

      // Convertir botones en skeletons
      :deep(button),
      :deep(.mat-mdc-button),
      :deep(.mat-mdc-raised-button) {
        background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%) !important;
        background-size: 200% 100% !important;
        animation: skeleton-shimmer 1.5s infinite !important;
        border-radius: 4px !important;
        color: transparent !important;
        pointer-events: none !important;
      }

      // Convertir imágenes/avatares en skeletons circulares
      :deep(img),
      :deep(.profile-picture),
      :deep(.avatar) {
        background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%) !important;
        background-size: 200% 100% !important;
        animation: skeleton-shimmer 1.5s infinite !important;
        opacity: 0.3 !important;
      }

      // Convertir texto en skeletons
      :deep(p),
      :deep(span),
      :deep(label),
      :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
        background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%) !important;
        background-size: 200% 100% !important;
        animation: skeleton-shimmer 1.5s infinite !important;
        border-radius: 4px !important;
        color: transparent !important;
        display: inline-block;
        min-height: 1em;
        min-width: 50px;
      }

      // Convertir cards
      :deep(.mat-mdc-card),
      :deep(mat-card) {
        background: #fafafa !important;
      }

      // Deshabilitar todas las interacciones
      :deep(*) {
        pointer-events: none !important;
        cursor: default !important;
      }

      @keyframes skeleton-shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      // Dark mode
      @media (prefers-color-scheme: dark) {
        :deep(input),
        :deep(textarea),
        :deep(select),
        :deep(.mat-mdc-form-field),
        :deep(.mat-mdc-text-field-wrapper),
        :deep(button),
        :deep(.mat-mdc-button),
        :deep(.mat-mdc-raised-button),
        :deep(img),
        :deep(.profile-picture),
        :deep(.avatar),
        :deep(p),
        :deep(span),
        :deep(label),
        :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
          background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%) !important;
          background-size: 200% 100% !important;
        }

        :deep(.mat-mdc-card),
        :deep(mat-card) {
          background: #1e1e1e !important;
        }
      }
    }
  `]
})
export class ProfileSkeletonComponent {}
