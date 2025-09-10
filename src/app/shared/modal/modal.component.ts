import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component'; // Assuming app-button is ButtonComponent

export interface ModalButton {
  text: string;
  action: string;
  style?: 'primary' | 'secondary' | 'danger';
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() buttons: ModalButton[] = [];

  @Output() buttonClick = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  onButtonClick(action: string): void {
    this.buttonClick.emit(action);
  }

  onClose(): void {
    this.close.emit();
  }
}