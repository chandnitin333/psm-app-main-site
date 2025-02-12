import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

@Component({
    selector: 'app-customer',
    standalone: true,
    imports: [LayoutModule, ToastrModule, FormsModule, ReactiveFormsModule, CommonModule, MatDataTableComponent, CustomPaginationComponent],
    templateUrl: './customer.component.html',
    styleUrl: './customer.component.css'
})
export class CustomerComponent {
    userDetails: any = [];
    searchValue: string = '';

    dataSource = new MatTableDataSource();
    @Input() totalItems!: number;
    @Input() itemsPerPage = ITEM_PER_PAGE;
    pagedDataSource = new MatTableDataSource<any>([]);
    currentPage: number = 1;
    user_id: number | undefined;
    isReadonly: boolean = true;
    loginMessage: string = '';

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
        user_id: new FormControl(undefined),
    });

    displayedColumns: any = [{ key: '#', value: '#' }, { key: 'ANNU_KRAMANK', value: 'अनु.क्रमांक' }, { key: 'MALMATTA_NUMBER', value: 'मिळकत क्रं.' }, { key: 'VARD_NUMBER', value: 'वार्ड क्रं.' }, { key: 'KHASARA_KRAMANK', value: 'खसरा क्रं.' }, { key: 'HOMEUSER_NAME', value: 'खातेधारकाचे नाव' }, { key: 'BHOGATWARGARACHE_NAME', value: 'भोगवटदाराचे नाव' }, { key: 'ADDRESS_NAGAR_SOCIETY', value: 'पत्ता' }, { key: 'action', value: 'action' }];
    constructor(private util: Util, private apiService: ApiService, private toastr: ToastrService, private customerService: CustomerService, public dialog: MatDialog) { }


    ngOnInit() {
        this.userDetails = this.apiService.getDecodedToken();
        this.customerForm.patchValue({
            user_id: this.userDetails.userId
        });
        this.user_id = this.userDetails.userId;
        this.fetchData();

        // this.customerForm.get('annu_kramank')?.disable();
    }

    fetchData() {
        this.customerService.fetchCustomersList({ page_number: this.currentPage, search: this.searchValue, user_id: this.userDetails.userId }).subscribe({
            next: (res: any) => {
                this.dataSource = new MatTableDataSource(res?.data ?? []);

                this.totalItems = res?.total_count ?? 0

                this.setPageData({ pageIndex: 0, pageSize: PAZE_SIZE, length: this.dataSource.data.length });
            },
            error: (err: any) => {
                console.error('Error fetch Parkar Data:', err);
            }
        });
    }



    onPageChange(event: PageEvent): void {

        this.currentPage = event.pageIndex
        this.fetchData();
    }

    setPageData(event: PageEvent): void {
        const startIndex = event.pageIndex * event.pageSize;
        const endIndex = startIndex + event.pageSize;
        this.pagedDataSource.data = this.dataSource.data.slice(startIndex, endIndex);
    }
    keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.customerForm);
    }
    submitCustomer() {
        if (!this.customerForm.invalid) {
            let params = {
                // name: this.prakarForm.value.prakarName,
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

            };
            this.customerService.addCustomer(params).subscribe({
                next: (res: any) => {
                    console.log("res", res)
                    if (res.status == 201) {
                        console.log("inside", res)
                        this.reset();
                        this.toastr.success(res.message, 'Success');
                        // this.isSubmitted = true;
                        this.fetchData();
                    }
                    else {
                        this.toastr.warning(res.message, 'Warning');
                    }
                    // this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error adding customer:', err);
                    this.toastr.error('There was an error adding the customer.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
    }

    reset() {
        const userId = this.customerForm.value.user_id;
        this.customerForm.reset();
        this.customerForm.patchValue({ user_id: userId });
    }

    getAnuKramank(event: any) {
        const inputElement = event.target as HTMLInputElement;
        const id = parseInt(inputElement.value);
        // console.log("id", id)
        const param = {
            "ward_no": id,
            "user_id": this.user_id
        }
        this.customerService.getAnukramankBywardNo(param).subscribe({
            next: (res: any) => {
                console.log("res", res)
                this.customerForm.patchValue({
                    annu_kramank: res?.data?.ANNU_KRAMANK,
                });
            },
            error: (err: Error) => {
                console.error('Error getting anu kramank:', err);
                this.toastr.error('There was an error getting the anu kramank.', 'Error');
            },
        });
    }

    verifyUser(): void {
        const dialogRef = this.dialog.open(LoginDialogComponent, {
            width: '400px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Login data:', result);
                // Handle login data (username & password)
                // api call match user name and password 
            } else {
                console.log('Login dialog was closed without submission');
            }
        });
    }
    onEdit(element: any) {
        console.log('Edit:', element);
    }

    onDelete(element: any) {
        console.log('Delete:', element);
    }

    onView(element: any) {
        console.log('View:', element);
    }

    onPrint(element: any) {
        console.log('Print:', element);
    }

    onDownload(element: any) {
        console.log('Download PDF:', element);
    }

    onPreview(element: any) {
        console.log('Preview:', element);
    }

    onPrevTax(element: any) {
        console.log('Previous Tax:', element);
    }

}
