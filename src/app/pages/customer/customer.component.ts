import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoginDialogComponent } from '../../common-dialog/login-dialog.component';
import { LayoutModule } from '../../components/layout/layout.module';
import { ITEM_PER_PAGE, PAZE_SIZE } from '../../constants/common.constant';
import { CustomPaginationComponent } from '../../custom-pagination/custom-pagination.component';
import { MatDataTableComponent } from '../../mat-data-table/mat-data-table.component';
import { ApiService } from '../../services/api.service';
import { CustomerService } from '../../services/customer.service';
import Util from '../../utils/utils';
import { NamunaprintComponent } from './namunaprint/namunaprint.component';
import { SillakjodaComponent } from './sillakjoda/sillakjoda.component';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    LayoutModule,
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDataTableComponent,
    CustomPaginationComponent,
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  userDetails: any = [];
  searchValue: string = '';
  userType: string = 'new_user_edit_joda';
  //   loginSuccess: boolean = false;
  isEdit: boolean = false;

  dataSource = new MatTableDataSource();
  @Input() totalItems!: number;
  @Input() itemsPerPage = ITEM_PER_PAGE;
  pagedDataSource = new MatTableDataSource<any>([]);
  currentPage: number = 1;
  user_id: number | undefined;
  isReadonly: boolean = true;
  primary_key_id: number = 0;
  //   loginMessage: string = '';

  customerForm = new FormGroup({
    annu_kramank: new FormControl(undefined),
    malmatta_no: new FormControl(undefined),
    ward_no: new FormControl(undefined),
    plot_no: new FormControl(undefined),
    khasara_no: new FormControl(undefined),
    survey_no: new FormControl(undefined),
    khate_dharkache_name: new FormControl(undefined),
    bhogvat_dharak_name: new FormControl(undefined),
    address: new FormControl(undefined),
    user_id: new FormControl(),
  });

  displayedColumns: any = [
    { key: '#', value: '#' },
    { key: 'ANNU_KRAMANK', value: 'अनु.क्रमांक' },
    { key: 'MALMATTA_NUMBER', value: 'मिळकत क्रं.' },
    { key: 'VARD_NUMBER', value: 'वार्ड क्रं.' },
    { key: 'KHASARA_KRAMANK', value: 'खसरा क्रं.' },
    { key: 'HOMEUSER_NAME', value: 'खातेधारकाचे नाव' },
    { key: 'BHOGATWARGARACHE_NAME', value: 'भोगवटदाराचे नाव' },
    { key: 'ADDRESS_NAGAR_SOCIETY', value: 'पत्ता' },
    { key: 'action', value: 'action' },
  ];
  constructor(
    private util: Util,
    private apiService: ApiService,
    private toastr: ToastrService,
    private customerService: CustomerService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userDetails = this.apiService.getDecodedToken();
    // console.log('userDetails', this.userDetails);
    this.customerForm.patchValue({
      user_id: this.userDetails.userId,
    });
    this.user_id = this.userDetails.userId;
    this.fetchData();
  }

  fetchData() {
    this.customerService
      .fetchCustomersList({
        page_number: this.currentPage,
        search: this.searchValue,
        user_id: this.userDetails.userId,
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
          console.error('Error fetch Parkar Data:', err);
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.fetchData();
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
    this.util.onKeydown(event, controlName, this.customerForm);
  }
  // submitCustomer() {
  //   if (!this.customerForm.invalid) {
  //     let params = {
  //       annu_kramank: this.customerForm.value.annu_kramank,
  //       malmatta_no: this.customerForm.value.malmatta_no,
  //       ward_no: this.customerForm.value.ward_no,
  //       plot_no: this.customerForm.value.plot_no,
  //       khasara_no: this.customerForm.value.khasara_no,
  //       survey_no: this.customerForm.value.survey_no,
  //       khate_dharkache_name: this.customerForm.value.khate_dharkache_name,
  //       bhogvat_dharak_name: this.customerForm.value.bhogvat_dharak_name,
  //       address: this.customerForm.value.address,
  //       user_id: this.customerForm.value.user_id,
  //     };
  //     this.customerService.addCustomer(params).subscribe({
  //       next: (res: any) => {
  //         console.log('res', res);
  //         if (res.status == 201) {
  //           console.log('inside', res);
  //           this.reset();
  //           this.toastr.success(res.message, 'Success');
  //           // this.isSubmitted = true;
  //           this.fetchData();
  //           // this.loginSuccess = false;
  //         } else {
  //           this.toastr.warning(res.message, 'Warning');
  //         }
  //         // this.isLoading = false;
  //       },
  //       error: (err: Error) => {
  //         console.error('Error adding customer:', err);
  //         this.toastr.error('There was an error adding the customer.', 'Error');
  //       },
  //     });
  //   } else {
  //     this.toastr.warning('Please fill all required fields.', 'warning');
  //   }
  // }
  searchCustomer()  {

  }

  reset() {
    const userId = this.customerForm.value.user_id;
    this.customerForm.reset();
    this.customerForm.patchValue({ user_id: userId });
  }

  getAnuKramank(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const id = parseInt(inputElement.value);
    // this.loginSuccess = false;
    // console.log("id", id)
    const param = {
      ward_no: id,
      user_id: this.user_id,
    };
    this.customerService.getAnukramankBywardNo(param).subscribe({
      next: (res: any) => {
        console.log('res', res);
        this.customerForm.patchValue({
          annu_kramank: res?.data?.ANNU_KRAMANK,
        });
      },
      error: (err: Error) => {
        console.error('Error getting anu kramank:', err);
        this.toastr.error(
          'There was an error getting the anu kramank.',
          'Error'
        );
      },
    });
  }

  verifyUser(status: any, element: any) {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
    });
    console.log('status', status);

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
                this.editInfo(element.NEWUSER_ID);
                this.primary_key_id = element.NEWUSER_ID;
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
  editInfo(id: number) {
    // this.isLoading = true;
    this.customerService.getMalmattaNodniById(id).subscribe({
      next: (res: any) => {
        console.log('response', res);
        this.customerForm.patchValue({
          //   prakarName: res?.data?.PRAKAR_NAME,
          annu_kramank: res?.data?.ANNU_KRAMANK,
          malmatta_no: res?.data?.MALMATTA_NUMBER,
          ward_no: res?.data?.VARD_NUMBER,
          plot_no: res?.data?.PLOT_NO,
          khasara_no: res?.data?.KHASARA_KRAMANK,
          survey_no: res?.data?.SURVEY_KRAMANK,
          khate_dharkache_name: res?.data?.HOMEUSER_NAME,
          bhogvat_dharak_name: res?.data?.BHOGATWARGARACHE_NAME,
          address: res?.data?.ADDRESS_NAGAR_SOCIETY,
          user_id: this.user_id,
        });

        // this.prakarId = res?.data?.PRAKAR_ID;
        this.isEdit = true;
        // this.isLoading = false;
      },
      error: (err: Error) => {
        console.error('Error getting prakar:', err);
        this.toastr.error('There was an error getting the prakar.', 'Error');
      },
    });
  }
  updateCustomer() {
    if (!this.customerForm.invalid) {
      // this.isLoading = true;
      // let params = {
      //   name: this.prakarForm.value.prakarName,
      //   prakar_id: this.prakarId,
      // };
      let params = {
        annu_kramank: this.customerForm.value.annu_kramank,
        malmatta_no: this.customerForm.value.malmatta_no,
        ward_no: this.customerForm.value.ward_no,
        plot_no: this.customerForm.value.plot_no,
        khasara_no: this.customerForm.value.khasara_no,
        survey_no: this.customerForm.value.survey_no,
        khate_dharkache_name: this.customerForm.value.khate_dharkache_name,
        bhogvat_dharak_name: this.customerForm.value.bhogvat_dharak_name,
        address: this.customerForm.value.address,
        user_id: this.customerForm.value.user_id,
        new_user_id: this.primary_key_id,
      };
      this.customerService.updateCustomerList(params).subscribe({
        next: (res: any) => {
          if (res.status !== 400) {
            this.reset();
            // this.isSubmitted = true;
            this.toastr.success(res.message, 'Success');
            this.searchValue = '';
            this.fetchData();
          } else {
            this.toastr.warning(res.message, 'Warning');
          }
          // this.isLoading = false;
        },
        error: (err: Error) => {
          console.error('Error updating customer nodni form:', err);
          this.toastr.error(
            'There was an error updating the customer nodni form.',
            'Error'
          );
        },
      });
    } else {
      this.toastr.warning('Please fill all required fields.', 'warning');
    }
  }
  onEdit(element: any) {
    const status = 'edit';
    this.verifyUser(status, element);
    // this.editInfo(element.NEWUSER_ID);
    console.log('Edit:', element);
  }

  // onDelete(element: any) {
  //   console.log('Delete:', element);
  // }
  onDelete(element: any) {
       const id = element.NEWUSER_ID;
        this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This customer nodani cannot be deleted.', 'Error');
                return;
            }
            if (res) {
                this.customerService.deleteCustomerFromNodani(id).subscribe({
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
                        console.error('Error deleting customer nodani:', err);
                        this.toastr.error('There was an error deleting the customer nodani.', 'Error');
                    }
                });
            }
        });
    }

  onView(element: any) {
    console.log('View:', element);
  }

  onPrint(element: any) {
    // console.log('Print:', element);
    this.openPrintModal(element);
  }

  onDownload(element: any) {
    console.log('Download PDF:', element);
  }

  onPreview(element: any) {
    console.log('Preview:', element);
  }

  onPrevTax(element: any) {
    // console.log('Previous Tax:', element);
    this.openModal(element);
  }

  openModal(element:any): void {
    const dialogRef = this.dialog.open(SillakjodaComponent, {
      width: '1000px', // Adjust size
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Modal Data:', result);
      }
    });
  }
  openPrintModal(element:any): void {
    const dialogRef = this.dialog.open(NamunaprintComponent, {
      width: '400px', // Adjust size
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Modal Data:', result);
      }
    });
  }
}
