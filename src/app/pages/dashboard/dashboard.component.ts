import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { LayoutModule } from '../../components/layout/layout.module';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LayoutModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  token: any = "";
  userData: any;
  users: any;
  constructor(private api: ApiService, private spinner: LoaderService) { }
  ngOnInit() {
    this.spinner.show();
    this.token = this.api.getToken();
    this.getUserActivity();
  }

  getUserActivity() {
    this.users = this.api.getDecodedToken();
    console.log('User:', this.users);
    try {
      this.api.post('get-user-activity', { user_id: this.users?.userId }).subscribe(
        (res: any) => {
          console.log('User Activity:', res.data);
          this.userData = res.data[0] ?? [];
          this.spinner.hide();
        },
        (error: HttpErrorResponse) => {
          console.error('Error:-', error.message);
          this.spinner.hide();
        }
      );
    } catch (error) {
      console.log('Error:===', error);
      this.spinner.hide();
    }

  }

}
