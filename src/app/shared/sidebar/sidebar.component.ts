import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectCompanyName, selectSupportEmail } from '../../core/store/settings/settings.selectors';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private readonly store = inject(Store);
  
  collapsed = input<boolean>(false);

  // Selectores del store
  companyName$ = this.store.select(selectCompanyName);
  supportEmail$ = this.store.select(selectSupportEmail);

  navItems = [
    { icon: 'home', label: 'Home', link: '/home' },
    { icon: 'group', label: 'Users', link: '/users' },
    { icon: 'admin_panel_settings', label: 'Roles', link: '/roles' },
    { icon: 'history', label: 'Audit', link: '/audit' },
    { icon: 'subscriptions', label: 'Subscriptions', link: '/subscriptions' },
    { icon: 'settings', label: 'Settings', link: '/settings' },
  ];
}
