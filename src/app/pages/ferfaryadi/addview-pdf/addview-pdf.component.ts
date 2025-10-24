import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ITEM_PER_PAGE, PAZE_SIZE } from '../../../constants/common.constant';
import { CustomPaginationComponent } from '../../../custom-pagination/custom-pagination.component';
import { MatDataTableComponent } from '../../../mat-data-table/mat-data-table.component';
import { ApiService } from '../../../services/api.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-addview-pdf',
  standalone: true,
  imports: [
    LayoutModule,
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomPaginationComponent,
    MatDataTableComponent,
  ],
  templateUrl: './addview-pdf.component.html',
  styleUrl: './addview-pdf.component.css',
})
export class AddviewPdfComponent {
  fileName: string = '';
  fileAttachName: string = '';

  uploadData: any = [];

  currentPage: number = 1;
  @Input() totalItems!: number;
  @Input() itemsPerPage = ITEM_PER_PAGE;
  dataSource = new MatTableDataSource();
  pagedDataSource = new MatTableDataSource<any>([]);
  // selectedFile!: File;
  selectedFile: File | null = null; // allow null
  formData: FormData = new FormData();
  displayedColumns: any = [
    { key: '#', value: '#' },
    { key: 'DISTRICT_NAME', value: 'ज़िला' },
    { key: 'TALUKA_NAME', value: 'तालुका' },
    { key: 'PANCHAYAT_NAME', value: 'ग्राम पंचायत' },
    { key: 'FILE_NAME', value: 'नाव' },
    { key: 'action', value: 'action' },
  ];

  uploadPdf = new FormGroup({
    file_name: new FormControl<string | null>(null),
    uploaded_file: new FormControl<File | null>(null),
  });
  receivedData: any;
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private customerService: CustomerService
  ) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    console.log(
      'Received data in SillakjodaComponent:',
      this.receivedData.value
    );
    if (this.receivedData === undefined || this.receivedData === null) {
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
        ferfar_id: this.receivedData.value,
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  submitPDF() {
    if (!this.selectedFile) {
      this.toastr.error('Please select a PDF file');
      return;
    }

    // Create new FormData
    // const formData = new FormData();

    // Append PDF file with explicit content type
    this.formData.append(
      'upload_pdf',
      this.selectedFile,
      this.selectedFile.name
    );

    // Append other text fields
    this.formData.append('name', this.fileAttachName || '');
    this.formData.append(
      'ferfar_id',
      this.receivedData.value?.toString() || ''
    );

    // If you have additional fields, append them here
    // formData.append('district_id', '1');
    // formData.append('taluka_id', '3');

    // Send request
    this.customerService.uploadPdf(this.formData).subscribe({
      next: (res) => {
        console.log('Upload success:', res);
        this.fetchData();
        this.toastr.success('PDF uploaded successfully');
        this.resetForm();
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.toastr.error('Error uploading PDF');
      },
    });
  }
  resetForm() {
    this.selectedFile = null;
    this.fileAttachName = '';
    this.fileName = '';
    this.formData = new FormData();
  }

  // onDownload(element: any) {
  //   // console.log('onDownload', element);
  //   // console.log('file path', this.apiService.baseUrl + element.R_PATH);
  //   // const fullUrl = this.apiService.baseUrl + element.R_PATH;

  //   // const link = document.createElement('a');
  //   // link.href = fullUrl;
  //   // link.target = '_blank';
  //   // link.download = element.R_PATH.split('/').pop() || 'file.pdf';
  //   // link.click();
  //    const fullUrl = this.apiService.baseUrl + element.R_PATH;

  //   const link = document.createElement('a');
  //   link.href = fullUrl;
  //   link.download = element.R_PATH.split('/').pop() || 'file.pdf';

  //   // Append to body to make it work in Firefox
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link); // remove the link after click

  // }
  
  onDownload(element: any) {
    // const baseKK = "http://localhost:4444";
  const fullUrl = this.apiService.file_baseUrl + element.R_PATH;
  // const fullUrl = baseKK + element.R_PATH;

  // Fetch the file as blob
  fetch(fullUrl, {
    method: 'GET',
    headers: {
      // Add auth headers if needed
    },
  })
    .then(res => res.blob())
    .then(blob => {
      // Create blob URL
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = element.R_PATH.split('/').pop() || 'file.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // cleanup
    })
    .catch(err => console.error('Download error:', err));
}




}
