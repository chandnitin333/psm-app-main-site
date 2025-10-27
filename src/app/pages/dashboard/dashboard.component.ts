import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LayoutModule } from '../../components/layout/layout.module';
import { CustomPaginationComponent } from '../../custom-pagination/custom-pagination.component';
import { MatDataTableComponent } from '../../mat-data-table/mat-data-table.component';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LayoutModule, CommonModule, MatDataTableComponent, CustomPaginationComponent,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  token: any = "";
  userData: any = {
    chalu_khatedar: 0,
    adhikrut: 0,
    indira_awas: 0,
    imlakar: 0,
    ghar_kar: 0,
    audyogik: 0,
    manora: 0
  };
  users: any = {
    NAME: '',
    SURNAME: '',
    USERNAME: '',
    DISTRICT_NAME: '',
    TALUKA_NAME: '',
    PANCHAYAT_NAME: ''
  };

  displayedColumns: { key: string; value: string }[] = [

    { key: 'NAME_NAME', value: 'पूर्ण नाव' },

    { key: 'MOBILE_NO', value: 'मोबाईल क्र.' },

    { key: 'DESIGNATION_ID', value: 'पदनाम' }

  ];
  dataSource = new MatTableDataSource<any>([]);
  @Input() totalItems!: number;
  @Input() itemsPerPage = 10;
  pagedDataSource = new MatTableDataSource<any>([]);
  currentPage: number = 0;
  isLoad: boolean = false;

  constructor(private api: ApiService, private spinner: LoaderService,private auth: AuthService) { }
  ngOnInit() {
    this.spinner.show();
    this.token = this.api.getToken();
    this.getUserActivity();
    this.checkIsloggedIn();

  }
  checkIsloggedIn() {
    if (this.auth.isTokenExpired()) {
      this.auth.logout();
    }
  }

  getUserActivity() {
    this.users = this.api.getDecodedToken();
   
    try {
      this.api.post('get-user-activity', { user_id: this.users?.userId }).subscribe({
        next: (res: any) => {
          // console.log('User Activity:', res.data);
          this.userData = res.data ?? [];
          console.log("this.userData----", this.userData)
          this.getMemberList();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error:-', error.message);
          this.spinner.hide();
        }
      });
    } catch (error) {
      console.log('Error:===', error);
      this.spinner.hide();
    }

  }

  getMemberList() {
    this.spinner.show();
    this.api.post('get-member-list', { user_id: this.users?.userId }).subscribe({
      next: (res: any) => {
        console.log('Member List:', res.data);
        this.dataSource.data = res.data;
        this.setPageData({ pageIndex: 0, pageSize: 10, length: this.dataSource.data.length });
        this.spinner.hide();
        this.isLoad = true
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error:-', error.message);
        this.spinner.hide();
      }
    });
  }

  onPageChange(event: PageEvent): void {

    this.currentPage = event.pageIndex
    this.setPageData(event);
  }


  setPageData(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedDataSource.data = this.dataSource.data.slice(startIndex, endIndex);
  }
}
