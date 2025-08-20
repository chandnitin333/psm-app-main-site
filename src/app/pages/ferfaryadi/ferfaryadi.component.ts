import { Component, Input } from '@angular/core';
import { LayoutModule } from '../../components/layout/layout.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ITEM_PER_PAGE, PAZE_SIZE } from '../../constants/common.constant';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatDataTableComponent } from '../../mat-data-table/mat-data-table.component';
import { CustomPaginationComponent } from '../../custom-pagination/custom-pagination.component';
import Util from '../../utils/utils';
import { ApiService } from '../../services/api.service';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { LoginDialogComponent } from '../../common-dialog/login-dialog.component';

@Component({
  selector: 'app-ferfaryadi',
  standalone: true,
  imports: [LayoutModule,
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDataTableComponent,
    CustomPaginationComponent,RouterLink],
  templateUrl: './ferfaryadi.component.html',
  styleUrl: './ferfaryadi.component.css'
})
export class FerfaryadiComponent {
toYearSelected: string = '2025';
fromYearSelected: string = '2024';
 userType: string = 'ferfar_user';
  user_id: number | undefined;
  userDetails: any = [];
  dataSource = new MatTableDataSource();
  @Input() totalItems!: number;
  @Input() itemsPerPage = ITEM_PER_PAGE;
  pagedDataSource = new MatTableDataSource<any>([]);
  currentPage: number = 1;
  yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];
 customerForm = new FormGroup({
    year: new FormControl<string | null>(null),
    to: new FormControl<string | null>(null),
    to1: new FormControl<string | null>(null),
    annu_kramank: new FormControl<number | null>(null),
    malmatta_no: new FormControl<string | null>(null),
    ward_no: new FormControl<number | null>(null),
    plot_no: new FormControl<string | null>(null),
    khasara_no: new FormControl<string | null>(null),
    survey_no: new FormControl<string | null>(null),
    khate_dharkache_name: new FormControl<string | null>(null),
    bhogvat_dharak_name: new FormControl<string | null>(null),
    address: new FormControl<string | null>(null),
    user_id: new FormControl<number | null>(null),
  });


  displayedColumns: any = [
    { key: '#', value: '#' },
    { key: 'ANNU_KRAMANK', value: 'अनु.क्रमांक' },
    { key: 'MALMATTA_NUMBER', value: 'मिळकत क्रं.' },
    { key: 'VARD_NUMBER', value: 'वार्ड क्रं.' },
    { key: 'KHASARA_KRAMANK', value: 'खसरा क्रं.' },
    { key: 'JUNEKHATEDAR_NAME', value: 'खातेधारकाचे नाव' },
    { key: 'NAVINKHATEDAR_NAME', value: 'भोगवटदाराचे नाव' }, 
    { key: 'YEAR_NAME', value: 'इयर' }, 
    { key: 'action', value: 'action' },
  ];

  constructor(
    private util: Util,
    private apiService: ApiService,
    private toastr: ToastrService,
    private customerService: CustomerService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.userDetails = this.apiService.getDecodedToken();
    console.log('userDetails', this.userDetails);
    this.customerForm.patchValue({
      user_id: this.userDetails.userId,
    });
    this.user_id = this.userDetails.userId;
    this.fetchData();
    this.loadYearOptions();
    this.customerForm.get('year')?.valueChanges.subscribe((selectedYearId) => {
      if (selectedYearId !== null && selectedYearId !== undefined) {
        this.setNextYear(Number(selectedYearId));
      }
    });
  }
  fetchData(): void {
   this.customerService
      .fetchFerfarYadiList({
        page_number: this.currentPage,
        cmbyear: this.customerForm.value.year,
        cmbyear1: this.customerForm.value.to,
        txtnumber: this.customerForm.value.annu_kramank,
        txt_malmatta_number: this.customerForm.value.malmatta_no,
        txt_vard_number: this.customerForm.value.ward_no,
        txt_plot_number: this.customerForm.value.plot_no,
        txt_khasara_number: this.customerForm.value.khasara_no,
        txt_survey_number: this.customerForm.value.survey_no,
        txt_khatedarache_name: this.customerForm.value.khate_dharkache_name,
        txt_bhogatwarache_name: this.customerForm.value.bhogvat_dharak_name
      })
      .subscribe({
        next: (res: any) => {
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
  keyDownText(event: KeyboardEvent, controlName: string): void {
    // this.util.onKeydown(event, controlName, this.customerForm);
  }

  loadYearOptions(): void {
    this.customerService.getDropdownYearsList().subscribe({
      next: (res: any) => {
        console.log('res', res);
         this.yearOptions = res?.data;
        //  console.log('yearOptions', this.yearOptions);
      },
      error: (err: Error) => {
        console.error('Error getting drop down:', err);
        this.toastr.error(
          'There was an error getting the year dropdown.',
          'Error'
        );
      },
    });
  }
  setNextYear(selectedYearId: number): void {
    const selectedIndex = this.yearOptions.findIndex((year) => Number(year.YEAR_ID) === Number(selectedYearId));

    if (selectedIndex !== -1 && selectedIndex + 1 < this.yearOptions.length) {
      const nextYear = this.yearOptions[selectedIndex + 1];
      this.customerForm.get('to')?.setValue(nextYear.YEAR_ID); // No error now
      this.customerForm.get('to1')?.setValue(nextYear.YEAR_NAME); // No error now
    } else {
      this.customerForm.get('to')?.setValue(null); // Handle no next year gracefully
      this.customerForm.get('to1')?.setValue(null); // Handle no next year gracefully
    }
  }
onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.fetchData();
  }
   onEdit(element: any) {
    const status = 'edit';
    this.verifyUser(status, element);
    // this.editInfo(element.NEWUSER_ID);
    console.log('Edit:', element);
  }

  onDelete(element: any){
    console.log('onDelete', element.FERFAR_ID);
    const id = element.FERFAR_ID;
    this.util.showConfirmAlert().then((res) => {
        if (id === 0) {
            this.toastr.error('This customer ferfar user cannot be deleted.', 'Error');
            return;
        }
        if (res) {
            this.customerService.deleteCustomerFerfar({}, id).subscribe({
                next: (res: any) => {
                    if (res.status == 200) {
                        this.toastr.success(res.message, "Success");
                        this.fetchData();

                    } else {
                        this.toastr.error(res.message, "Error");
                    }
                    // this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error deleting customer ferfar:', err);
                    this.toastr.error('There was an error deleting the customer ferfar user.', 'Error');
                }
            });
        }
    });
  }
  verifyUser(status: any, element: any) {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
    });
    console.log('status', status);
    console.log('element', element);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // console.log('Login data:', result.username);
        let params = {
          username: result.username,
          password: result.password,
          user_type: this.userType,
          district_id: this.userDetails.DISTRICT_ID,
          taluka_id: this.userDetails.TALUKA_ID,
          panchayat_id: this.userDetails.PANCHAYAT_ID,
        };
        this.customerService.verifyUserLogin(params).subscribe({
          next: (res: any) => {
            if (res.status == 200) {
              this.toastr.success('Access has been granted');
              if (status == 'edit') {
                // this.router.navigate(['/user', element]);
                this.router.navigate(['/customer-ferfar'], { queryParams: { id: element.FERFAR_ID } });
                // this.editInfo(element.NEWUSER_ID);
                // this.primary_key_id = element.NEWUSER_ID;
              }
            } else {
              this.toastr.error('You entered wrong credentials', 'Error');
            }
          },
          error: (err: Error) => {
            console.error('Error adding customer:', err);
            this.toastr.error(
              'There was an error adding the customer.',
              'Error'
            );
          },
        });
      } else {
        // this.loginSuccess = false;
        console.log('Login dialog was closed without submission');
      }
    });
  }
  onDownload(element: any) {
    console.log('onPreview', element);
    this.router.navigate(['/namuna-10-kar-vasuli'], { state: { name: 'Namuna 10 vasuli', value: element.VASULI_ID } });
  }
}
