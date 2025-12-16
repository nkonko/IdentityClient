import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';

export interface ModalButton {
  text: string;
  action: string;
  style?: 'primary' | 'secondary' | 'danger';
  icon?: string;
}

export type ModalSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ModalHeaderVariant = 'default' | 'primary' | 'accent';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatIconModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');
  icon = input<string>(''); // Icon for the header
  size = input<ModalSize>('medium'); // Modal size
  headerVariant = input<ModalHeaderVariant>('primary'); // Header style variant
  buttons = input<ModalButton[]>([]);
  showCloseButton = input<boolean>(true);

  @Output() buttonClick = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  onButtonClick(action: string): void {
    this.buttonClick.emit(action);
  }

  onClose(): void {
    this.close.emit();
  }

  getSizeClass(): string {
    const sizeMap = {
      small: 'modal-small',
      medium: 'modal-medium',
      large: 'modal-large',
      xlarge: 'modal-xlarge'
    };
    return sizeMap[this.size()];
  }

  getHeaderClass(): string {
    const variantMap = {
      default: 'header-default',
      primary: 'header-primary',
      accent: 'header-accent'
    };
    return variantMap[this.headerVariant()];
  }

  getButtonColor(style?: string): 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' {
    const colorMap: Record<string, 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger'> = {
      primary: 'primary',
      secondary: 'default',
      danger: 'danger',
      success: 'success',
      warning: 'warning'
    };
    return style ? (colorMap[style] || 'default') : 'default';
  }
}