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
    accountHolderName: new FormControl<string | null>(null),
    landHolderName: new FormControl<string | null>(null),
    propertyTax: new FormControl<number | null>(null),
    propertyTax_discount: new FormControl<number | null>(null),
    propertyTax_penalty: new FormControl<number | null>(null),
    electricityTax: new FormControl<number | null>(null),
    electricityTax_discount: new FormControl<number | null>(null),
    electricityTax_penalty: new FormControl<number | null>(null),
    healthTax: new FormControl<number | null>(null),
    healthTax_discount: new FormControl<number | null>(null),
    healthTax_penalty: new FormControl<number | null>(null),
    cleaningTax: new FormControl<number | null>(null),
    cleaningTax_discount: new FormControl<number | null>(null),
    cleaningTax_penalty: new FormControl<number | null>(null),
    generalWaterTax: new FormControl<number | null>(null),
    generalWaterTax_discount: new FormControl<number | null>(null),
    generalWaterTax_penalty: new FormControl<number | null>(null),
    specialWaterTax: new FormControl<number | null>(null),
    specialWaterTax_discount: new FormControl<number | null>(null),
    specialWaterTax_penalty: new FormControl<number | null>(null),
    otherFees: new FormControl<number | null>(null),
    noticeFees: new FormControl<number | null>(null),
    discount5: new FormControl<number | null>(null),
    increase5: new FormControl<number | null>(null),
    total: new FormControl<number | null>(null),
    newuserr_id: new FormControl<number | null>(null),
    userr_id: new FormControl<number | null>(null),
    RNO: new FormControl<string | null>(null),
    annu_kramank: new FormControl<number | null>(null),
    vard_numbers: new FormControl<number | null>(null),
  });

  gruhBhumukar = 0;
  propertyTax_sut = 0;
  propertyTax_dand = 0;
  propertyTax_sut_readonly = false;
  propertyTax_dand_readonly = false;

  vijDivabattiKar = 0;
  electricityTax_sut = 0;
  electricityTax_dand = 0;
  electricityTax_sut_readonly = false;
  electricityTax_dand_readonly = false;

  arogyaRakshanKar = 0;
  healthTax_sut = 0;
  healthTax_dand = 0;
  healthTax_sut_readonly = false;
  healthTax_dand_readonly = false;

  safaiKar = 0;
  cleaningTax_sut = 0;
  cleaningTax_dand = 0;
  cleaningTax_sut_readonly = false;
  cleaningTax_dand_readonly = false;

  samanyaPaniKar = 0;
  generalWaterTax_sut = 0;
  generalWaterTax_dand = 0;
  generalWaterTax_sut_readonly = false;
  generalWaterTax_dand_readonly = false;

  vishesPaniKar = 0;
  specialWaterTax_sut = 0;
  specialWaterTax_dand = 0;
  specialWaterTax_sut_readonly = false;
  specialWaterTax_dand_readonly = false;

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
        this.checkSillakJodaExists(Number(selectedYearId));
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
  getRowTotal(amount: number, discountPercent: number, penaltyPercent: number): number {
    const amt = amount || 0;
    const disc = discountPercent || 0;
    const pen = penaltyPercent || 0;

    // Apply percentage formula:
    // Total = amount × (1 - discount/100) × (1 + penalty/100)
    const afterDiscount = amt * (1 - disc / 100);
    const afterPenalty = afterDiscount * (1 + pen / 100);

    return Math.round(afterPenalty * 100) / 100; // Round to 2 decimal places
  }

  checkFieldLock(taxType: string, field: 'sut' | 'dand'): void {
    if (taxType === 'property') {
      if (field === 'sut' && this.propertyTax_sut > 0) {
        this.propertyTax_dand_readonly = true;
        this.propertyTax_dand = 0;
      } else if (field === 'dand' && this.propertyTax_dand > 0) {
        this.propertyTax_sut_readonly = true;
        this.propertyTax_sut = 0;
      } else if (this.propertyTax_sut === 0 && this.propertyTax_dand === 0) {
        this.propertyTax_sut_readonly = false;
        this.propertyTax_dand_readonly = false;
      }
    } else if (taxType === 'electricity') {
      if (field === 'sut' && this.electricityTax_sut > 0) {
        this.electricityTax_dand_readonly = true;
        this.electricityTax_dand = 0;
      } else if (field === 'dand' && this.electricityTax_dand > 0) {
        this.electricityTax_sut_readonly = true;
        this.electricityTax_sut = 0;
      } else if (this.electricityTax_sut === 0 && this.electricityTax_dand === 0) {
        this.electricityTax_sut_readonly = false;
        this.electricityTax_dand_readonly = false;
      }
    } else if (taxType === 'health') {
      if (field === 'sut' && this.healthTax_sut > 0) {
        this.healthTax_dand_readonly = true;
        this.healthTax_dand = 0;
      } else if (field === 'dand' && this.healthTax_dand > 0) {
        this.healthTax_sut_readonly = true;
        this.healthTax_sut = 0;
      } else if (this.healthTax_sut === 0 && this.healthTax_dand === 0) {
        this.healthTax_sut_readonly = false;
        this.healthTax_dand_readonly = false;
      }
    } else if (taxType === 'cleaning') {
      if (field === 'sut' && this.cleaningTax_sut > 0) {
        this.cleaningTax_dand_readonly = true;
        this.cleaningTax_dand = 0;
      } else if (field === 'dand' && this.cleaningTax_dand > 0) {
        this.cleaningTax_sut_readonly = true;
        this.cleaningTax_sut = 0;
      } else if (this.cleaningTax_sut === 0 && this.cleaningTax_dand === 0) {
        this.cleaningTax_sut_readonly = false;
        this.cleaningTax_dand_readonly = false;
      }
    } else if (taxType === 'generalWater') {
      if (field === 'sut' && this.generalWaterTax_sut > 0) {
        this.generalWaterTax_dand_readonly = true;
        this.generalWaterTax_dand = 0;
      } else if (field === 'dand' && this.generalWaterTax_dand > 0) {
        this.generalWaterTax_sut_readonly = true;
        this.generalWaterTax_sut = 0;
      } else if (this.generalWaterTax_sut === 0 && this.generalWaterTax_dand === 0) {
        this.generalWaterTax_sut_readonly = false;
        this.generalWaterTax_dand_readonly = false;
      }
    } else if (taxType === 'specialWater') {
      if (field === 'sut' && this.specialWaterTax_sut > 0) {
        this.specialWaterTax_dand_readonly = true;
        this.specialWaterTax_dand = 0;
      } else if (field === 'dand' && this.specialWaterTax_dand > 0) {
        this.specialWaterTax_sut_readonly = true;
        this.specialWaterTax_sut = 0;
      } else if (this.specialWaterTax_sut === 0 && this.specialWaterTax_dand === 0) {
        this.specialWaterTax_sut_readonly = false;
        this.specialWaterTax_dand_readonly = false;
      }
    }
  }

  updateTotal(): void {
    const propertyTotal = this.getRowTotal(this.gruhBhumukar, this.propertyTax_sut, this.propertyTax_dand);
    const electricityTotal = this.getRowTotal(this.vijDivabattiKar, this.electricityTax_sut, this.electricityTax_dand);
    const healthTotal = this.getRowTotal(this.arogyaRakshanKar, this.healthTax_sut, this.healthTax_dand);
    const cleaningTotal = this.getRowTotal(this.safaiKar, this.cleaningTax_sut, this.cleaningTax_dand);
    const generalWaterTotal = this.getRowTotal(this.samanyaPaniKar, this.generalWaterTax_sut, this.generalWaterTax_dand);
    const specialWaterTotal = this.getRowTotal(this.vishesPaniKar, this.specialWaterTax_sut, this.specialWaterTax_dand);
    const otherFeesTotal = this.itarFee || 0;
    const noticeFeesTotal = this.noticeFee || 0;

    this.totalAmount = propertyTotal + electricityTotal + healthTotal + cleaningTotal +
                       generalWaterTotal + specialWaterTotal + otherFeesTotal + noticeFeesTotal;
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

         // Set default year to current year if not already set
         if (this.yearOptions && this.yearOptions.length > 0 && !this.previousTaxForm.value.year) {
           const currentYear = new Date().getFullYear();
           const currentYearOption = this.yearOptions.find(year =>
             year.YEAR_NAME && year.YEAR_NAME.includes(currentYear.toString())
           );

           if (currentYearOption) {
             this.previousTaxForm.patchValue({
               year: currentYearOption.YEAR_ID
             });
           } else {
             // If current year not found, select the first option
             this.previousTaxForm.patchValue({
               year: this.yearOptions[0].YEAR_ID
             });
           }
         }
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
        "kar_bhumikar": this.gruhBhumukar,
        "divabatti_kar": this.vijDivabattiKar,
        "aarogya_rakshan_kar": this.arogyaRakshanKar,
        "safai_kar": this.safaiKar,
        "samanya_pani_kar": this.samanyaPaniKar,
        "vishesh_pani_kar": this.vishesPaniKar,
        "total": this.totalAmount,
        "rno": this.previousTaxForm.value.RNO,
        "annu_kramank": this.previousTaxForm.value.annu_kramank,
        "etar_fees": this.itarFee,
        "notice_fees": this.noticeFee,
        "less5": this.propertyTax_sut,
        "plus5": this.propertyTax_dand,
        "diva_batti_less_5": this.electricityTax_sut,
        "diva_batti_plus_5": this.electricityTax_dand,
        "aarogya_less_5": this.healthTax_sut,
        "aarogya_plus_5": this.healthTax_dand,
        "safae_less_5": this.cleaningTax_sut,
        "safae_plus_5": this.cleaningTax_dand,
        "samanya_pani_less_5": this.generalWaterTax_sut,
        "samanya_pani_plus_5": this.generalWaterTax_dand,
        "vishesh_pani_less_5": this.specialWaterTax_sut,
        "vishesh_pani_plus_5": this.specialWaterTax_dand,
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

  checkSillakJodaExists(yearId: number): void {
    const newuserId = this.previousTaxForm.value.newuserr_id;
    const wardNo = this.previousTaxForm.value.vard_numbers;

    if (!newuserId || !wardNo) {
      console.log('Missing required data for checking sillak joda');
      // Clear form fields when no data
      this.clearFormFields();
      return;
    }

    const params = {
      year_id: yearId,
      user_id: this.userDetails.userId,
      newuser_id: newuserId,
      ward_no: wardNo
    };

    console.log('Checking Sillak Joda exists with params:', params);

    this.customerService.checkSillakJodaExist(params).subscribe({
      next: (res: any) => {
        console.log('Sillak Joda check response:', res);
        if (res && res.exists === true && res.data && res.data.length > 0) {
          const existingData = res.data[0];
          this.toastr.info('Sillak Joda data loaded for this year', 'Info', {
            timeOut: 3000,
            closeButton: true,
            progressBar: true
          });
          // Populate form fields with existing data
          this.populateFormFields(existingData);
        } else {
          console.log('Sillak Joda does not exist for this year - clearing fields');
          // Clear form fields when no data exists
          this.clearFormFields();
        }
      },
      error: (err: any) => {
        console.error('Error checking sillak joda exist:', err);
        this.toastr.error('Error checking Sillak Joda existence', 'Error');
        this.clearFormFields();
      }
    });
  }

  populateFormFields(data: any): void {
    // Set tax amounts
    this.gruhBhumukar = data.BHUMI_KAR || 0;
    this.vijDivabattiKar = data.DIVA_BATTI_KAR || 0;
    this.arogyaRakshanKar = data.AAROGYA_RAKSHAN_KAR || 0;
    this.safaiKar = data.SAFAI_KAR || 0;
    this.samanyaPaniKar = data.SAMANYA_PANI_KAR || 0;
    this.vishesPaniKar = data.VISHESH_PANI_KAR || 0;
    this.itarFee = data.ETAR_FEES || 0;
    this.noticeFee = data.NOTICE_FEES || 0;

    // Set discount/penalty percentages for property tax (BHUMI_KAR uses main less5/plus5)
    this.propertyTax_sut = data.less5 || 0;
    this.propertyTax_dand = data.plus5 || 0;

    // Set discount/penalty percentages for other taxes
    this.electricityTax_sut = data.diva_batti_less_5 || 0;
    this.electricityTax_dand = data.diva_batti_plus_5 || 0;

    this.healthTax_sut = data.aarogya_less_5 || 0;
    this.healthTax_dand = data.aarogya_plus_5 || 0;

    this.cleaningTax_sut = data.safae_less_5 || 0;
    this.cleaningTax_dand = data.safae_plus_5 || 0;

    this.generalWaterTax_sut = data.samanya_pani_less_5 || 0;
    this.generalWaterTax_dand = data.samanya_pani_plus_5 || 0;

    this.specialWaterTax_sut = data.vishesh_pani_less_5 || 0;
    this.specialWaterTax_dand = data.vishesh_pani_plus_5 || 0;

    // Update readonly flags based on which field has value
    if (this.propertyTax_sut > 0) {
      this.propertyTax_dand_readonly = true;
    } else if (this.propertyTax_dand > 0) {
      this.propertyTax_sut_readonly = true;
    }

    if (this.electricityTax_sut > 0) {
      this.electricityTax_dand_readonly = true;
    } else if (this.electricityTax_dand > 0) {
      this.electricityTax_sut_readonly = true;
    }

    if (this.healthTax_sut > 0) {
      this.healthTax_dand_readonly = true;
    } else if (this.healthTax_dand > 0) {
      this.healthTax_sut_readonly = true;
    }

    if (this.cleaningTax_sut > 0) {
      this.cleaningTax_dand_readonly = true;
    } else if (this.cleaningTax_dand > 0) {
      this.cleaningTax_sut_readonly = true;
    }

    if (this.generalWaterTax_sut > 0) {
      this.generalWaterTax_dand_readonly = true;
    } else if (this.generalWaterTax_dand > 0) {
      this.generalWaterTax_sut_readonly = true;
    }

    if (this.specialWaterTax_sut > 0) {
      this.specialWaterTax_dand_readonly = true;
    } else if (this.specialWaterTax_dand > 0) {
      this.specialWaterTax_sut_readonly = true;
    }

    // Update form values
    this.previousTaxForm.patchValue({
      propertyTax: data.BHUMI_KAR || 0,
      propertyTax_discount: data.less5 || 0,
      propertyTax_penalty: data.plus5 || 0,
      electricityTax: data.DIVA_BATTI_KAR || 0,
      electricityTax_discount: data.diva_batti_less_5 || 0,
      electricityTax_penalty: data.diva_batti_plus_5 || 0,
      healthTax: data.AAROGYA_RAKSHAN_KAR || 0,
      healthTax_discount: data.aarogya_less_5 || 0,
      healthTax_penalty: data.aarogya_plus_5 || 0,
      cleaningTax: data.SAFAI_KAR || 0,
      cleaningTax_discount: data.safae_less_5 || 0,
      cleaningTax_penalty: data.safae_plus_5 || 0,
      generalWaterTax: data.SAMANYA_PANI_KAR || 0,
      generalWaterTax_discount: data.samanya_pani_less_5 || 0,
      generalWaterTax_penalty: data.samanya_pani_plus_5 || 0,
      specialWaterTax: data.VISHESH_PANI_KAR || 0,
      specialWaterTax_discount: data.vishesh_pani_less_5 || 0,
      specialWaterTax_penalty: data.vishesh_pani_plus_5 || 0,
      otherFees: data.ETAR_FEES || 0,
      noticeFees: data.NOTICE_FEES || 0,
      discount5: data.less5 || 0,
      increase5: data.plus5 || 0,
      total: data.TOTAL || 0
    });

    // Update total
    this.totalAmount = data.TOTAL || 0;
    this.updateTotal();
  }

  clearFormFields(): void {
    // Reset tax amounts to 0
    this.gruhBhumukar = 0;
    this.vijDivabattiKar = 0;
    this.arogyaRakshanKar = 0;
    this.safaiKar = 0;
    this.samanyaPaniKar = 0;
    this.vishesPaniKar = 0;
    this.itarFee = 0;
    this.noticeFee = 0;
    this.totalAmount = 0;

    // Reset discount/penalty values
    this.propertyTax_sut = 0;
    this.propertyTax_dand = 0;
    this.electricityTax_sut = 0;
    this.electricityTax_dand = 0;
    this.healthTax_sut = 0;
    this.healthTax_dand = 0;
    this.cleaningTax_sut = 0;
    this.cleaningTax_dand = 0;
    this.generalWaterTax_sut = 0;
    this.generalWaterTax_dand = 0;
    this.specialWaterTax_sut = 0;
    this.specialWaterTax_dand = 0;

    // Reset readonly flags
    this.propertyTax_sut_readonly = false;
    this.propertyTax_dand_readonly = false;
    this.electricityTax_sut_readonly = false;
    this.electricityTax_dand_readonly = false;
    this.healthTax_sut_readonly = false;
    this.healthTax_dand_readonly = false;
    this.cleaningTax_sut_readonly = false;
    this.cleaningTax_dand_readonly = false;
    this.generalWaterTax_sut_readonly = false;
    this.generalWaterTax_dand_readonly = false;
    this.specialWaterTax_sut_readonly = false;
    this.specialWaterTax_dand_readonly = false;

    // Clear form fields
    this.previousTaxForm.patchValue({
      propertyTax: 0,
      propertyTax_discount: 0,
      propertyTax_penalty: 0,
      electricityTax: 0,
      electricityTax_discount: 0,
      electricityTax_penalty: 0,
      healthTax: 0,
      healthTax_discount: 0,
      healthTax_penalty: 0,
      cleaningTax: 0,
      cleaningTax_discount: 0,
      cleaningTax_penalty: 0,
      generalWaterTax: 0,
      generalWaterTax_discount: 0,
      generalWaterTax_penalty: 0,
      specialWaterTax: 0,
      specialWaterTax_discount: 0,
      specialWaterTax_penalty: 0,
      otherFees: 0,
      noticeFees: 0,
      discount5: 0,
      increase5: 0,
      total: 0
    });
  }
}
