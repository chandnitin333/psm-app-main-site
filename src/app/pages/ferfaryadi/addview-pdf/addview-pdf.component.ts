import { Component, Input } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomPaginationComponent } from '../../../custom-pagination/custom-pagination.component';
import { MatDataTableComponent } from '../../../mat-data-table/mat-data-table.component';
import { AdharListService } from '../../../services/adhar-list.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { ITEM_PER_PAGE, PAZE_SIZE } from '../../../constants/common.constant';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-addview-pdf',
  standalone: true,
  imports: [LayoutModule,ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,CustomPaginationComponent,MatDataTableComponent],
  templateUrl: './addview-pdf.component.html',
  styleUrl: './addview-pdf.component.css'
})
export class AddviewPdfComponent {
  fileName = '';
  
  // formData: FormData = new FormData();
  uploadData: any = []; 

  currentPage: number = 1;
  @Input() totalItems!: number;
  @Input() itemsPerPage = ITEM_PER_PAGE;
  dataSource = new MatTableDataSource();
  pagedDataSource = new MatTableDataSource<any>([]);

  displayedColumns: any = [
      { key: '#', value: '#' },
      { key: 'DISTRICT_NAME', value: 'ज़िला' },
      { key: 'TALUKA_NAME', value: 'तालुका' },
      { key: 'PANCHAYAT_NAME', value: 'ग्राम पंचायत' },
      { key: 'FILE_NAME', value: 'नाव' },
      { key: 'action', value: 'action'},
    ];

  uploadPdf = new FormGroup({
    file_name: new FormControl<string | null>(null),
    uploaded_file: new FormControl<File | null>(null)
  });
  receivedData: any;
  constructor(private apiService: ApiService,  private toastr: ToastrService, private router: Router,private customerService: CustomerService,) {
      this.receivedData = this.router.getCurrentNavigation()?.extras.state;
      console.log('Received data in SillakjodaComponent:', this.receivedData.value);
      if(this.receivedData === undefined || this.receivedData === null){
        // this.toastr.error('No data received');
        this.router.navigate(['/ferfar-yadi']); // Redirect to the previous page

      }
    }
    ngOnInit(): void {
      this.fetchData();
    }
    fetchData(): void {
   this.customerService
      .pefFerfarList({
        page_number: this.currentPage,
        ferfar_id: this.receivedData.value
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

    onPageChange(event: PageEvent): void {
      this.currentPage = event.pageIndex;
      // this.getTaxGenerationRecords();
    }
    setPageData(event: PageEvent): void {
      const startIndex = event.pageIndex * event.pageSize;
      const endIndex = startIndex + event.pageSize;
      this.pagedDataSource.data = this.dataSource.data.slice(
        startIndex,
        endIndex
      );
    }




    onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) return;

      const file = input.files[0];
      this.fileName = file.name;

      // Example: send to API
      // console.log('Selected file:', file);
    }

    submitPDF(){
      // const formData = {
      //   name: this.uploadPdf.get('file_name')?.value || '',
      //   upload_pdf: 
      //   ferfar_id: this.receivedData.value
      // }

    //   this.customerService.uploadPdf(formData).subscribe({
    //     next: (response) => {
    //       console.log('PDF upload response:', response);
    //       // this.toastr.success('PDF uploaded successfully');
    //       // Handle successful response
    //     },
    //     error: (error) => {
    //       this.toastr.error('Error uploading PDF');
    //       // Handle error response
    //     }
    //   });


    const formData = new FormData();
    const fileInput: any = document.getElementById('data_file');
    const pdf_name: any = document.getElementById('file_name');  // Get file input
    const file = fileInput?.files[0];
    formData.set('upload_pdf', file);
    formData.set('name', pdf_name.value);
    formData.set('ferfar_id', this.receivedData.value);
    console.log('Form Data:',formData);
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    // this.apiService.postFormData('add-ferfar-yadi-pdf', formData).subscribe({
    this.customerService.uploadPdf(formData).subscribe({
      next: (res: any) => {
        console.log('PDF upload response===============>', res);

      }
    });
    }

  onDownload(element:any){
    console.log('onDownload', element);
  }
  //   submitPDF() {
  //   const fileInput = document.getElementById('data_file') as HTMLInputElement;
  //   const pdfNameInput = document.getElementById('file_name') as HTMLInputElement;

  //   if (!fileInput?.files?.length) {
  //     console.error("No file selected!");
  //     return;
  //   }

  //   const file = fileInput.files[0];
  //   const formData = new FormData();

  //   // 👇 Proper key-value pairs
  //   formData.append("upload_pdf", file, file.name);
  //   formData.append("name", pdfNameInput?.value || "");  
  //   formData.append("ferfar_id", this.receivedData?.value || "");  

  //   // Debug print
  //   formData.forEach((value, key) => console.log(key, "=>", value));

  //   this.customerService.uploadPdf(formData).subscribe({
  //     next: (res: any) => {
  //       console.log("✅ PDF upload response:", res);
  //     },
  //     error: (err) => {
  //       console.error("❌ Upload error:", err);
  //     }
  //   });
  // }


}
