import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MenuItem } from '../../models/menu-item/menu-item.interface';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-matrix-menu',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule,CommonModule],
  templateUrl: './matrix-menu.component.html',
  styleUrl: './matrix-menu.component.css'
})
export class MatrixMenuComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard' },
    { label: 'Users', icon: 'people' },
    { label: 'Reports', icon: 'bar_chart' },
    { label: 'Settings', icon: 'settings' },
    { label: 'Messages', icon: 'message' },
    { label: 'Calendar', icon: 'calendar_today' }
  ];
}
