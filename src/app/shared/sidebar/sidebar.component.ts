import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() collapsed = false;

  navItems = [
    { icon: 'home', label: 'Home', link: '/home' },
    { icon: 'group', label: 'Users', link: '/users' },
    { icon: 'admin_panel_settings', label: 'Roles', link: '/roles' },
    { icon: 'history', label: 'Audit', link: '/audit' },
    { icon: 'subscriptions', label: 'Subscriptions', link: '/subscriptions' },
    { icon: 'settings', label: 'Settings', link: '/settings' },
  ];
}
