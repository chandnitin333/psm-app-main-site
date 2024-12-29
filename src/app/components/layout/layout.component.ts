import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from '../header/header.component';
import { LoaderComponent } from '../loader/loader.component';
import { LoginComponent } from '../login/login.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent, FooterComponent, LoaderComponent, LoginComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isLoginPage: boolean = false;
  constructor(private router: Router) {

    this.router.events.subscribe(() => {
      // Check if the current route is 'login'
      this.isLoginPage = this.router.url === '/login';
    });
  }

}
