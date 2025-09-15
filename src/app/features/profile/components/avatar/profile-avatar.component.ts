import { Component, EventEmitter, input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile-avatar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './profile-avatar.component.html',
  styleUrls: ['./profile-avatar.component.scss']
})
export class ProfileAvatarComponent {
  fullName = input<string | null>(null);
  imageUrl = input<string | null>(null);
  disabled = input<boolean>(false);

  @Output() upload = new EventEmitter<File>();

  initials = computed(() => {
    const name = (this.fullName() || '').trim();
    if (!name) return '?';
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map(p => p.charAt(0).toUpperCase()).join('');
  });

  onFileSelected(event: Event) {
    if (this.disabled()) return;
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (file) {
      this.upload.emit(file);
      input.value = '';
    }
  }
}
