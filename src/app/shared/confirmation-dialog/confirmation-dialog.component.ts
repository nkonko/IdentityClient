import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirmation-dialog" [class]="'confirmation-dialog--' + (data.type || 'info')">
      <div class="dialog-header">
        <mat-icon class="dialog-icon">
          @switch (data.type) {
            @case ('danger') { warning }
            @case ('warning') { info }
            @default { help_outline }
          }
        </mat-icon>
        <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      </div>
      
      <mat-dialog-content class="dialog-content">
        <p class="dialog-message">{{ data.message }}</p>
      </mat-dialog-content>
      
      <mat-dialog-actions class="dialog-actions">
        <button 
          mat-button 
          class="cancel-button"
          (click)="onCancel()">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button 
          mat-raised-button 
          class="confirm-button"
          [class]="'confirm-button--' + (data.type || 'info')"
          (click)="onConfirm()">
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      padding: 24px;
      max-width: 400px;
      
      .dialog-header {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        
        .dialog-icon {
          margin-right: 12px;
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
        
        .dialog-title {
          margin: 0;
          font-weight: 500;
        }
      }
      
      .dialog-content {
        margin-bottom: 24px;
        
        .dialog-message {
          margin: 0;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.7);
        }
      }
      
      .dialog-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin: 0;
        padding: 0;
        
        .cancel-button {
          color: rgba(0, 0, 0, 0.6);
        }
        
        .confirm-button {
          min-width: 80px;
          
          &--info {
            background-color: #2196f3;
            color: white;
          }
          
          &--warning {
            background-color: #ff9800;
            color: white;
          }
          
          &--danger {
            background-color: #f44336;
            color: white;
          }
        }
      }
      
      &--info {
        .dialog-icon { color: #2196f3; }
        .dialog-title { color: #1976d2; }
      }
      
      &--warning {
        .dialog-icon { color: #ff9800; }
        .dialog-title { color: #f57c00; }
      }
      
      &--danger {
        .dialog-icon { color: #f44336; }
        .dialog-title { color: #d32f2f; }
      }
    }
    
    @media (prefers-color-scheme: dark) {
      .confirmation-dialog {
        .dialog-content .dialog-message {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .dialog-actions .cancel-button {
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}