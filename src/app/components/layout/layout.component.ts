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
  isPublicPage: boolean = false;

  // Routes accessible without login — rendered without header/sidebar,
  // so no auth check (matrix-menu) runs for them.
  private publicPrefixes = ['/bill-pay'];

  constructor(private router: Router) {

    this.router.events.subscribe(() => {
      // Check if the current route is 'login'
      this.isLoginPage = this.router.url === '/login';
      this.isPublicPage = this.publicPrefixes.some(p => this.router.url.startsWith(p));
    });
  }

}
