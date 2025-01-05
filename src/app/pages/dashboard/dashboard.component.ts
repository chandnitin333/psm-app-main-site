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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LayoutModule, CommonModule, MatDataTableComponent, CustomPaginationComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  token: any = "";
  userData: any;
  users: any;

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

  constructor(private api: ApiService, private spinner: LoaderService) { }
  ngOnInit() {
    this.spinner.show();
    this.token = this.api.getToken();
    this.getUserActivity();


  }

  getUserActivity() {
    this.users = this.api.getDecodedToken();
   
    try {
      this.api.post('get-user-activity', { user_id: this.users?.userId }).subscribe({
        next: (res: any) => {
          console.log('User Activity:', res.data);
          this.userData = res.data[0] ?? [];
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
