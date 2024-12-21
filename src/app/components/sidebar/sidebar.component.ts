import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { NavigationItem } from '../../models/menu-item/navigation-item.interface';
import { SidebarMenuItemComponent } from '../sidebar-menu-item/sidebar-menu-item.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    SidebarMenuItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  navItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'User Management',
      icon: 'people',
      children: [
        {
          label: 'Users List',
          icon: 'group',
          route: '/users'
        },
        {
          label: 'Roles',
          icon: 'admin_panel_settings',
          route: '/users/roles'
        },
        {
          label: 'Permissions',
          icon: 'security',
          route: '/users/permissions'
        }
      ]
    },
    {
      label: 'Reports',
      icon: 'bar_chart',
      children: [
        {
          label: 'Sales Report',
          icon: 'trending_up',
          route: '/reports/sales'
        },
        {
          label: 'Analytics',
          icon: 'analytics',
          route: '/reports/analytics'
        }
      ]
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/settings'
    }
  ];
}
