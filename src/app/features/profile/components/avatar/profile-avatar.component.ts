import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-profile-avatar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './profile-avatar.component.html',
  styleUrls: ['./profile-avatar.component.scss']
})
export class ProfileAvatarComponent {
  fullName = input<string | null>(null);
  imageUrl = input<string | null>(null);
  disabled = input<boolean>(false);

  upload = output<File>();
  delete = output<void>();

  initials = computed(() => {
    const name = (this.fullName() || '').trim();
    if (!name) return '?';
    const parts = name.split(/\\s+/).slice(0, 2);
    return parts.map(p => p.charAt(0).toUpperCase()).join('');
  });

  hasImage = computed(() => !!this.imageUrl());

  onFileSelected(event: Event) {
    if (this.disabled()) return;
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (file) {
      this.upload.emit(file);
      input.value = '';
    }
  }

  onDeleteClick() {
    if (this.disabled()) return;
    this.delete.emit();
  }
}
