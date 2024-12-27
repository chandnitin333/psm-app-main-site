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
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    // {
    //   label: 'User Management',
    //   icon: 'people',
    //   children: [
    //     {
    //       label: 'Users List',
    //       icon: 'group',
    //       route: '/users'
    //     },
    //     {
    //       label: 'Roles',
    //       icon: 'admin_panel_settings',
    //       route: '/users/roles'
    //     },
    //     {
    //       label: 'Permissions',
    //       icon: 'security',
    //       route: '/users/permissions'
    //     }
    //   ]
    // },
    // {
    //   label: 'Reports',
    //   icon: 'bar_chart',
    //   children: [
    //     {
    //       label: 'Sales Report',
    //       icon: 'trending_up',
    //       route: '/reports/sales'
    //     },
    //     {
    //       label: 'Analytics',
    //       icon: 'analytics',
    //       route: '/reports/analytics'
    //     }
    //   ]
    // },
    { label: 'नोंदणी फॉर्म', icon: 'assignment', route: '/nodni-form' },
    { label: 'मालमत्ता नोंदणी',icon: 'people', route: '/customer' },
    { label: 'मालमत्ता फेरफार',icon: 'bar_chart', route: '/ferfar-yadi' },
    { label: 'कर आकारणी',icon: 'monetization_on', route: '/tax-generation' },
    { label: 'वसुली',icon: 'savings', route: '/customer-vasuli' },
    { label: 'अहवाल',icon: 'bar_chart',  children: [
        { label: 'आधार लिस्ट शो', icon: 'account_box',  route: '/aadhar-card-show' },
        { label: 'मोबाईल नंबर लिस्ट',  icon: 'phone', route: '/mobile-number' },
        { label: 'पिण्याचा पाणी लिस्ट',  icon: 'water', route: '/pani-vyavasta-yadi' },
        { label: 'शौचालय  लिस्ट',  icon: 'wc', route: '/toilet-yadi' },
        { label: 'मालमत्ता दुरुस्ती यादी',  icon: 'show_chart', route: '/malmatta-grahak-yadi' },
        { label: 'नमुना 8',  icon: 'assignment', route: '/namuna-8-form' },
        { label: 'नमुना 9',  icon: 'assignment', route: '/namuna-9-form' },
        { label: 'करांच्या मागणीचे बिल',  icon: 'receipt', route: '/magniche-bill' },
        { label: 'करांच्या मागणीचे बिल (वार्ड)',  icon: 'receipt', route: '/magniche-bill-ward' },
        { label: 'नमुना 10',  icon: 'assignment', route: '/customer-vasuli' },
        { label: 'इमला कर',  icon: 'monetization_on', route: '/imla-kar-form' },
        { label: 'इमला कर New',  icon: 'monetization_on', route: '/imla-kar-form-new' },
      ]
    },

  ];
}
