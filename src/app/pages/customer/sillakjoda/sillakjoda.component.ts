import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ApiService } from '../../../services/api.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-sillakjoda',
  standalone: true,
  imports: [
    LayoutModule,
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './sillakjoda.component.html',
  styleUrl: './sillakjoda.component.css',
})
export class SillakjodaComponent {
  previousTaxForm = new FormGroup({
    year: new FormControl<string | null>(null),
    to: new FormControl<string | null>(null),
    to1: new FormControl<string | null>(null),
    accountHolderName: new FormControl(undefined),
    landHolderName: new FormControl(undefined),
    propertyTax: new FormControl(undefined),
    electricityTax: new FormControl(undefined),
    healthTax: new FormControl(undefined),
    cleaningTax: new FormControl(undefined),
    generalWaterTax: new FormControl(undefined),
    specialWaterTax: new FormControl(undefined),
    otherFees: new FormControl(undefined),
    noticeFees: new FormControl(undefined),
    discount5: new FormControl(undefined),
    increase5: new FormControl(undefined),
    total: new FormControl(undefined),
    newuserr_id: new FormControl(undefined),
    userr_id: new FormControl(undefined),
    RNO: new FormControl(undefined),
    annu_kramank: new FormControl(undefined),
    vard_numbers: new FormControl(undefined),
  });

  gruhBhumukar = 0;
  vijDivabattiKar = 0;
  arogyaRakshanKar = 0;
  safaiKar = 0;
  samanyaPaniKar = 0;
  vishesPaniKar = 0;
  itarFee = 0;
  noticeFee = 0;
  fivPercentSut = 0;
  fivPercentWad=0;
  totalAmount = 0;
  userDetails: any = [];
  yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];
  constructor(
    public dialogRef: MatDialogRef<SillakjodaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private apiService: ApiService,
    private customerService: CustomerService,
    private toastr: ToastrService,
  ) {
    // console.log('Received data in SillakjodaComponent:', this.data);
  }

  ngOnInit(): void {
    this.loadYearOptions();
    this.previousTaxForm.get('year')?.valueChanges.subscribe((selectedYearId) => {
      if (selectedYearId !== null && selectedYearId !== undefined) {
        this.setNextYear(Number(selectedYearId));
      }
    });
    this.userDetails = this.apiService.getDecodedToken();
    // You can prefill form fields with the received data if needed
    if (this.data) {
      this.previousTaxForm.patchValue({
        year: this.data.year,                  // Example mapping (if applicable)
        accountHolderName: this.data.HOMEUSER_NAME,  // Map to your form fields as needed
        landHolderName: this.data.BHOGATWARGARACHE_NAME,
        userr_id: this.userDetails.userId,
        newuserr_id: this.data.NEWUSER_ID,
        RNO: this.data.RNO,
        annu_kramank: this.data.ANNU_KRAMANK,
        vard_numbers: this.data.VARD_NUMBER,
      });
    }
  }

  openModal(): void {
    const dialogRef = this.dialog.open(SillakjodaComponent, {
      width: '500px', // Adjust size as needed
      data: {
        year: 2024,
        to: 'Option 1',
        accountHolderName: 'User Name',
        landHolderName: '',
        propertyTax: 0,
        electricityTax: 0,
        healthTax: 0,
        cleaningTax: 0,
        generalWaterTax: 0,
        specialWaterTax: 0,
        otherFees: 0,
        noticeFees: 0,
        discount5: 0,
        increase5: 0,
        total: 0,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Modal Data:', result);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.previousTaxForm.valid) {
      this.dialogRef.close(this.previousTaxForm.value);
    }
  }
  gruh_bhumukar(event:any):void{
    console.log('gruh_bhumukar',event.target.value);
  }
  updateTotal(): void {
    this.totalAmount =
      (this.gruhBhumukar || 0) +
      (this.vijDivabattiKar || 0) +
      (this.arogyaRakshanKar || 0) +
      (this.safaiKar || 0) +
      (this.samanyaPaniKar || 0) +
      (this.vishesPaniKar || 0) +
      (this.itarFee || 0) +
      (this.noticeFee || 0)+
      (this.fivPercentWad || 0)-
      (this.fivPercentSut || 0);
  }
  selectInputValue(event: any): void {
    event.target.select(); // Selects the entire text in the input box when focused
  }

   loadYearOptions(): void {
    // this.http.get<{ value: string; name: string }[]>('YOUR_API_ENDPOINT_HERE')
    //   .subscribe((response) => {
    //     this.yearOptions = response; // Set response to yearOptions array
    //   });
    this.customerService.getDropdownYearsList().subscribe({
      next: (res: any) => {
        console.log('res', res);
         this.yearOptions = res?.data;
         console.log('yearOptions', this.yearOptions);
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
      this.previousTaxForm.get('to')?.setValue(nextYear.YEAR_ID); // No error now
      this.previousTaxForm.get('to1')?.setValue(nextYear.YEAR_NAME); // No error now
    } else {
      this.previousTaxForm.get('to')?.setValue(null); // Handle no next year gracefully
      this.previousTaxForm.get('to1')?.setValue(null); // Handle no next year gracefully
    }
  }
  
  save_magil_kar() {
    if (!this.previousTaxForm.invalid) {
      let params = {
        "user_id": this.userDetails.userId,
        "newuser_id": this.previousTaxForm.value.newuserr_id,
        "cmbyear": this.previousTaxForm.value.year,
        "cmbyear1": this.previousTaxForm.value.to,
        "homeuser": this.previousTaxForm.value.accountHolderName,
        "kar_bhumikar": this.previousTaxForm.value.propertyTax,
        "divabatti_kar": this.previousTaxForm.value.electricityTax,
        "aarogya_rakshan_kar": this.previousTaxForm.value.healthTax,
        "safai_kar": this.previousTaxForm.value.cleaningTax,
        "samanya_pani_kar": this.previousTaxForm.value.generalWaterTax,
        "vishesh_pani_kar": this.previousTaxForm.value.specialWaterTax,
        "total": this.totalAmount,
        "rno": this.previousTaxForm.value.RNO,
        "annu_kramank": this.previousTaxForm.value.annu_kramank,
        "etar_fees": this.previousTaxForm.value.otherFees,
        "notice_fees": this.previousTaxForm.value.noticeFees,
        "less5": this.previousTaxForm.value.discount5,
        "plus5": this.previousTaxForm.value.increase5,
        "ward_numbers": this.previousTaxForm.value.vard_numbers,
        "years": this.previousTaxForm.value.year
      };
      this.customerService.addSillakJoda(params).subscribe({
        next: (res: any) => {
          console.log('res', res);
          if (res.status == 201) {
            console.log('inside', res);
            this.toastr.success(res.message, 'Success');
            // this.loginSuccess = false;
          } else {
            this.toastr.warning(res.message, 'Warning');
          }
          // this.isLoading = false;
        },
        error: (err: Error) => {
          console.error('Error adding sillak joda:', err);
          this.toastr.error('There was an error adding the sillak joda.', 'Error');
        },
      });
    } else {
      this.toastr.warning('Please fill all required fields.', 'warning');
    }
  }
}
