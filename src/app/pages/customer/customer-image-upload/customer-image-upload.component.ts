import { Component, Inject, OnInit } from '@angular/core';
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
export class CustomerImageUploadComponent implements OnInit {
  selectedImage: string | ArrayBuffer | null = null;
  existingImageUrl: string = '';
  formData: FormData = new FormData();
  uploadData: any = [];
  userDetails:any=[];
  savedFileName: string = 'capture.jpg';
  private storageKey: string = '';
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

    ngOnInit(): void {
      // Key is per-record so a restored dialog matches the right khatedhar
      this.storageKey = 'custImgUpload_' + (this.data?.NEWUSER_ID ?? 'x');
      // If the page was reloaded while the camera was open (Android memory
      // reclaim), restore the captured image so the preview isn't lost.
      try {
        const saved = sessionStorage.getItem(this.storageKey);
        if (saved) {
          const obj = JSON.parse(saved);
          if (obj?.image) {
            this.selectedImage = obj.image;
            this.savedFileName = obj.fileName || 'capture.jpg';
          }
        }
      } catch { /* ignore storage errors */ }
    }

    onExistingImageError(): void {
      console.warn('Existing customer image failed to load:', this.existingImageUrl);
      this.existingImageUrl = '';
    }

    onCancel(): void {
      this.clearSaved();
      this.dialogRef.close(false);
    }

    private clearSaved(): void {
      try { sessionStorage.removeItem(this.storageKey); } catch { /* ignore */ }
    }

    /** Convert a base64 data URL back into a File (used when the live file
     *  input was emptied by a camera-triggered page reload). */
    private dataURLtoFile(dataurl: string, filename: string): File | null {
      try {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) { u8arr[n] = bstr.charCodeAt(n); }
        return new File([u8arr], filename, { type: mime });
      } catch {
        return null;
      }
    }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.savedFileName = file.name || 'capture.jpg';
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result;
        // Persist so a camera-triggered reload doesn't lose the photo
        try {
          sessionStorage.setItem(this.storageKey, JSON.stringify({
            image: this.selectedImage,
            fileName: this.savedFileName,
          }));
        } catch { /* ignore storage errors */ }
      };

      reader.readAsDataURL(file);
    }
  }
  addUploadData() {
    this.userDetails = this.apiService.getDecodedToken();
    const user_id = this.userDetails.userId;
    const fileInput: any = document.getElementById('data_file');  // Get file input
    let file: File | null = fileInput?.files?.[0] || null;
    // Fall back to the persisted capture if the input was cleared by a reload
    if (!file && typeof this.selectedImage === 'string') {
      file = this.dataURLtoFile(this.selectedImage, this.savedFileName);
    }
    if (!file) {
      this.toastr.error('कृपया प्रथम फोटो निवडा', 'Error!');
      return;
    }
    this.formData.set('customer_image', file, file.name);
    this.formData.set('user_id', user_id);
    this.formData.set('new_user_id', this.data.NEWUSER_ID);
    this.customerService.customerUpdate(this.formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success(res.message, "Success!");
          this.clearSaved();
          this.dialogRef.close(true);   // close only after upload succeeds
        } else {
          this.toastr.error(res.message, "Error!");
        }

      },
      error: () => {
        this.toastr.error('अपलोड अयशस्वी, पुन्हा प्रयत्न करा', 'Error!');
      }
    });
  }

}
