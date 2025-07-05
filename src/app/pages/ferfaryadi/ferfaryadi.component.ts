import { Component, Input } from '@angular/core';
import { LayoutModule } from '../../components/layout/layout.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ITEM_PER_PAGE, PAZE_SIZE } from '../../constants/common.constant';
import { MatCard } from '@angular/material/card';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatDataTableComponent } from '../../mat-data-table/mat-data-table.component';
import { CustomPaginationComponent } from '../../custom-pagination/custom-pagination.component';
import { PageEvent } from '@angular/material/paginator';
import Util from '../../utils/utils';
import { ApiService } from '../../services/api.service';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { FerfarServiceService } from '../../services/ferfar-service.service';

@Component({
    selector: 'app-ferfaryadi',
    standalone: true,
    imports: [LayoutModule, ReactiveFormsModule, CommonModule, RouterLink,
        ToastrModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatDataTableComponent,
        CustomPaginationComponent,
    ],
    templateUrl: './ferfaryadi.component.html',
    styleUrl: './ferfaryadi.component.css'
})
export class FerfaryadiComponent {

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

    ferfaryadiForm = new FormGroup({
        annu_kramank: new FormControl(undefined),
        malmatta_no: new FormControl(undefined),
        ward_no: new FormControl(undefined),
        plot_no: new FormControl(undefined),
        khasara_no: new FormControl(undefined),
        survey_no: new FormControl(undefined),
        khate_dharkache_name: new FormControl(undefined),
        bhogvat_dharak_name: new FormControl(undefined),
        year: new FormControl(""),
        toYear: new FormControl(""),
        user_id: new FormControl(),
    });

    displayedColumns: any = [
        { key: '#', value: '#' },
        { key: 'ANNU_KRAMANK', value: 'अनु.क्रमांक' },
        { key: 'MALMATTA_NUMBER', value: 'मिळकत क्रं.' },
        { key: 'VARD_NUMBER', value: 'वार्ड क्रं.' },
        { key: 'KHASARA_KRAMANK', value: 'खसरा क्रं.' },
        { key: 'NAVINKHATEDAR_NAME', value: 'खातेधारकाचे नाव' },
        { key: 'JUNEKHATEDAR_NAME', value: 'भोगवटदाराचे नाव' },
        { key: 'YEAR_NAME', value: 'वर्ष' },
        { key: 'action', value: 'action' },
    ];

// {
//     "status": 200,
  
//   "message": "Ferfar Yadi list fetched successfully",
//     "data": [
//         {
//             "FERFAR_ID": 21,
//             "NEWUSER_ID": "16528",
//             "FERFARNAMUNAYADI_ID": "1",
//             "PANCHAYAT_ID": "1044",
//             "YEAR_ID": "25",
//             "YEAR1_ID": "26",
//             "ANNU_KRAMANK": "1",
//             "MALMATTA_NUMBER": "1",
//             "VARD_NUMBER": "1",
//             "PLOT_NO": "",
//             "KHASARA_KRAMANK": "",
//             "SURVEY_KRAMANK": "",
//             "MASIKSABHA": "10",
//             "THARAV": "15",
//             "DATE": "03/11/2024",
//             "JUNEKHATEDAR_NAME": "गजानन रामभाऊ केदार ",
//             "NAVINKHATEDAR_NAME": "संजय गजानन केदार ",
//             "SACHIV": "बावणे सर ",
//             "SARPANCH": "राठोड सर ",
//             "UPSARPANCH": "काळे सर ",
//             "TIP": "आज दिनक ",
//             "USER_ID": "1038",
//             "tdate": "2024-03-11T00:10:17.000Z",
//             "DELETED_AT": null,
//             "YEAR_NAME": "2024"
//         }
//     ],
//     "total_count": 1
// }
 



    toYearSelected: string = '2025';
    fromYearSelected: string = '2024';

    constructor(private util: Util,
        private apiService: ApiService,
        private toastr: ToastrService,
        private ferfarservice: FerfarServiceService,
        public dialog: MatDialog){

    }
    ngOnInit() {
        this.userDetails = this.apiService.getDecodedToken();
        // console.log('userDetails', this.userDetails);
        this.ferfaryadiForm.patchValue({
          user_id: this.userDetails.userId,
        });
        this.user_id = this.userDetails.userId;
        this.fetchData();
      }

    onEdit(element: any) {
        const status = 'edit';
        // this.verifyUser(status, element);
        // this.editInfo(element.NEWUSER_ID);
        console.log('Edit:', element);
    }

    // onDelete(element: any) {
    //   console.log('Delete:', element);
    // }
    onDelete(element: any) {
        //  const id = element.NEWUSER_ID;
        //   this.util.showConfirmAlert().then((res) => {
        //       if (id === 0) {
        //           this.toastr.error('This customer nodani cannot be deleted.', 'Error');
        //           return;
        //       }
        //       if (res) {
        //           this.customerService.deleteCustomerFromNodani(id).subscribe({
        //               next: (res: any) => {
        //                   if (res.status == 200) {
        //                       this.toastr.success(res.message, "Success");
        //                       this.fetchData();

        //                   } else {
        //                       this.toastr.error(res.message, "Error");
        //                   }
        //                   // this.isLoading = false;
        //               },
        //               error: (err: Error) => {
        //                   console.error('Error deleting customer nodani:', err);
        //                   this.toastr.error('There was an error deleting the customer nodani.', 'Error');
        //               }
        //           });
        //       }
        //   });
    }

    onView(element: any) {
        console.log('View:', element);
    }

    onPrint(element: any) {
        // console.log('Print:', element);
        // this.openPrintModal(element);
    }

    onDownload(element: any) {
        console.log('Download PDF:', element);
    }

    onPreview(element: any) {
        console.log('Preview:', element);
    }


    fetchData() {
        this.ferfarservice
            .searchFerfarDetails({
                page_number: this.currentPage,
                txtnumber: this.ferfaryadiForm.value.annu_kramank,
                txt_malmatta_number: this.ferfaryadiForm.value.malmatta_no,
                txt_vard_number: this.ferfaryadiForm.value.ward_no,
                txt_plot_number: this.ferfaryadiForm.value.plot_no,
                txt_khasara_number: this.ferfaryadiForm.value.khasara_no,
                txt_survey_number: this.ferfaryadiForm.value.survey_no,
                txt_khatedarache_name: this.ferfaryadiForm.value.khate_dharkache_name,
                txt_bhogatwarache_name: this.ferfaryadiForm.value.bhogvat_dharak_name,
                cmbyear: this.ferfaryadiForm.value.year,
                cmbyear1: this.ferfaryadiForm.value.toYear,



                

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

  onPrevTax(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.fetchData();
  }
  resetData() {
    this.ferfaryadiForm.reset();
    this.ferfaryadiForm.patchValue({
      user_id: this.userDetails.userId,
    });
    this.currentPage = 0;
    this.fetchData();
  }
}
