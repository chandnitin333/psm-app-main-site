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
    CommonModule],
  templateUrl: './customer-image-upload.component.html',
  styleUrl: './customer-image-upload.component.css'
})
export class CustomerImageUploadComponent {
  selectedImage: string | ArrayBuffer | null = null;
  constructor(
      public dialogRef: MatDialogRef<CustomerImageUploadComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialog: MatDialog,
      private apiService: ApiService,
      private customerService: CustomerService,
      private toastr: ToastrService,
    ) {
      console.log('Received data------------->', this.data);
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
  
}
