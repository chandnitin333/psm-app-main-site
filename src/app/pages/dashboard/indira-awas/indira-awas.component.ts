import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ITEM_PER_PAGE, PAZE_SIZE } from '../../../constants/common.constant';
import { CustomPaginationComponent } from '../../../custom-pagination/custom-pagination.component';
import { MatDataTableComponent } from '../../../mat-data-table/mat-data-table.component';
import { ApiService } from '../../../services/api.service';
import { CustomerService } from '../../../services/customer.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-indira-awas',
  standalone: true,
  imports: [LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDataTableComponent,
    CustomPaginationComponent, RouterLink, ToastrModule],
  templateUrl: './indira-awas.component.html',
  styleUrl: './indira-awas.component.css'
})
export class IndiraAwasComponent {
dataSource = new MatTableDataSource();
    @Input() totalItems!: number;
    @Input() itemsPerPage = ITEM_PER_PAGE;
    pagedDataSource = new MatTableDataSource<any>([]);
    currentPage: number = 1;
    userDetails:any;

    displayedColumns: any = [
      { key: '#', value: '#' },
      { key: 'ANNU_KRAMANK', value: 'अनु.क्रमांक' },
      { key: 'MALMATTA_NUMBER', value: 'मिळकत क्रं.' },
      { key: 'VARD_NUMBER', value: 'वार्ड क्रं.' },
      { key: 'KHASARA_KRAMANK', value: 'खसरा क्रं.' },
      { key: 'HOMEUSER_NAME', value: 'खातेधारकाचे नाव' },
      { key: 'BHOGATWARGARACHE_NAME', value: 'भोगवटदाराचे नाव' } 
    ];
  constructor(
    private apiService: ApiService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchData();    
  }


    onPageChange(event: PageEvent): void {
      this.currentPage = event.pageIndex;
      this.fetchData();
    }
    fetchData(): void {
      this.userDetails = this.apiService.getDecodedToken();
      const user_id = this.userDetails.userId;
      this.customerService
          .fetchIndiraAwas({
            page_number: this.currentPage,
            user_id: user_id
          })
          .subscribe({
            next: (res: any) => {
              console.log("----",res?.data)
              if(res?.data.length == 0){
                this.toastr.warning('No records found for Indira Awas.', 'Warning');
                this.router.navigate(['/dashboard']);
              }
              this.dataSource = new MatTableDataSource(res?.data ?? []);
              this.totalItems = res?.total_count ?? 0;
              //   this.loginSuccess = false;
              this.setPageData({
                pageIndex: 0,
                pageSize: PAZE_SIZE,
                length: this.dataSource.data.length,
              });
            },
            error: (err: any) => {
              console.error('Error fetch vasuli Data:', err);
            },
          });
    }

    setPageData(event: PageEvent): void {
      const startIndex = event.pageIndex * event.pageSize;
      const endIndex = startIndex + event.pageSize;
      this.pagedDataSource.data = this.dataSource.data.slice(
        startIndex,
        endIndex
      );
    }
    onEdit($event:any){
    } 
}
