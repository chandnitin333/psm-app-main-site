import { Component, Inject } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customer-image-upload',
  standalone: true,
  imports: [LayoutModule,
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,ToastrModule],
  templateUrl: './customer-image-upload.component.html',
  styleUrl: './customer-image-upload.component.css'
})
export class CustomerImageUploadComponent {
  selectedImage: string | ArrayBuffer | null = null;
  existingImageUrl: string = '';
  formData: FormData = new FormData();
  uploadData: any = [];
  userDetails:any=[];
  constructor(
      public dialogRef: MatDialogRef<CustomerImageUploadComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialog: MatDialog,
      private apiService: ApiService,
      private customerService: CustomerService,
      private toastr: ToastrService,
    ) {
      console.log('Received data------------->', this.data);
      const existingPath = this.data?.r_path || this.data?.R_PATH;
      if (existingPath) {
        const base = (this.apiService.file_baseUrl || '').replace(/\/+$/, '/');
        const cleaned = String(existingPath)
          .replace(/^\/+/, '')
          .replace(/^uploads\//i, '');
        this.existingImageUrl = (base.endsWith('/') ? base : base + '/') + cleaned;
        console.log('Existing image URL:', this.existingImageUrl);
      }
    }

    onExistingImageError(): void {
      console.warn('Existing customer image failed to load:', this.existingImageUrl);
      this.existingImageUrl = '';
    }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }
  addUploadData() {
    this.userDetails = this.apiService.getDecodedToken();
    const user_id = this.userDetails.userId;
    const fileInput: any = document.getElementById('data_file');  // Get file input
    const file = fileInput?.files[0];
    this.formData.set('customer_image', file, file.name);
    this.formData.set('user_id', user_id); 
    this.formData.set('new_user_id', this.data.NEWUSER_ID); 
    this.customerService.customerUpdate(this.formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success(res.message, "Success!");
        } else {
          this.toastr.error(res.message, "Error!");
        }

      }
    });
  }
  
}
