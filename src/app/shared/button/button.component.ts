import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// Map color names to CSS variable tokens
const COLOR_TOKEN_MAP: Record<string, string> = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)'
};

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  /** Texto del botón. Alternativamente, puedes usar <ng-content> para contenido personalizado */
  @Input() label = '';
  /** Nombre del icono de Angular Material (ej: 'add', 'edit', etc.) */
  @Input() icon?: string;
  /** Mostrar u ocultar el icono */
  @Input() showIcon = true;
  /** Variante visual */
  @Input() variant: 'solid' | 'outline' | 'default' = 'solid';
  /** Tamaño */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  /** Color basado en tokens globales */
  @Input() color: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' = 'primary';
  /** Tipo de botón nativo */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  /** Estado deshabilitado */
  @Input() disabled = false;

  /** Reemite el click del botón por conveniencia */
  @Output() btnClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (this.disabled) return;
    this.btnClick.emit(event);
  }

  // Calcula estilos inline para aprovechar tokens sin modificar los estilos globales
  get styleVars(): { [key: string]: string } | null {
    if (this.color === 'default') return null; // Usa estilos globales por defecto

    const tokenColor = COLOR_TOKEN_MAP[this.color];

    if (this.variant === 'outline') {
      return {
        // Texto y borde del color seleccionado; fondo transparente
        color: tokenColor,
        borderColor: tokenColor,
        background: 'transparent'
      } as any;
    }

    if (this.variant === 'solid') {
      // Fondo y borde del color seleccionado; texto blanco (o contraste primario si aplica)
      const textColor = this.color === 'primary' ? 'var(--color-primary-contrast)' : '#ffffff';
      return {
        background: tokenColor,
        borderColor: tokenColor,
        color: textColor
      } as any;
    }

    return null;
  }

  get variantClass(): string {
    // Mapea a clases globales usadas en User Management cuando es primary/default
    if (this.variant === 'outline') return 'outline';
    if (this.variant === 'solid' && this.color === 'primary') return 'primary';
    return '';
  }
}
