import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from "../footer/footer.component";
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
