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
  selectedFile!: File;
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
        this.toastr.success('PDF uploaded successfully');
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.toastr.error('Error uploading PDF');
      },
    });
  }

  onDownload(element: any) {
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
