import { Component, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectCompanyName, selectSupportEmail } from '../../core/store/settings/settings.selectors';
import { selectFeatureFlagsMap } from '../../core/store/feature-flags/feature-flags.selectors';

interface NavItem {
  icon: string;
  label: string;
  link: string;
  featureFlag?: string; // Optional: if set, this item is only shown when the feature flag is enabled
}

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

  // Feature flags as signal for reactivity
  private featureFlagsMap = toSignal(this.store.select(selectFeatureFlagsMap), { initialValue: {} as Record<string, boolean> });

  private readonly allNavItems: NavItem[] = [
    { icon: 'home', label: 'Home', link: '/home' },
    { icon: 'group', label: 'Users', link: '/users' },
    { icon: 'admin_panel_settings', label: 'Roles', link: '/roles' },
    { icon: 'history', label: 'Audit', link: '/audit' },
    { icon: 'subscriptions', label: 'Subscriptions', link: '/subscriptions', featureFlag: 'Subscriptions' },
    { icon: 'flag', label: 'Feature Flags', link: '/feature-flags' },
    { icon: 'settings', label: 'Settings', link: '/settings' },
  ];

  // Computed signal that filters nav items based on feature flags
  navItems = computed(() => {
    const flags = this.featureFlagsMap();
    return this.allNavItems.filter(item => {
      // If no feature flag is required, always show
      if (!item.featureFlag) {
        return true;
      }
      // Otherwise, check if the feature flag is enabled
      return flags[item.featureFlag] === true;
    });
  });
}
