import { Component, Inject, AfterViewInit } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Util from '../../../utils/utils';
import { ApiService } from '../../../services/api.service';
import { NodaniService } from '../../../services/nodani.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-manora-kar-aakarni',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,NgxMaskDirective],
  templateUrl: './manora-kar-aakarni.component.html',
  styleUrl: './manora-kar-aakarni.component.css'
})
export class ManoraKarAakarniComponent implements AfterViewInit {
  userDetails: any = [];
  manora_malmattechePrakar: { MILKAT_VAPAR_ID: number; MILKAT_VAPAR_NAME: String }[] = [];
  manora_malmattecheVarnan: { MALMATTA_ID: number; DESCRIPTION_NAME: String }[] = [];
  manora_manoracheBhag: { MANORAMASTER_ID: number; MANORAMASTER_NAME: String }[] = [];
  yearId: number = 0;
  YearName: string = '';
  is_edit: boolean = false;
  orginal_edit:boolean = false;
  original_new_user_id: string = '';

  // Flag to prevent infinite loops
  private isFixingTabNavigation: boolean = false;

  manoraKarForm = new FormGroup({
    milkat_vapar_id: new FormControl<number | null>(null),
    malmatta_id: new FormControl<number | null>(null),
    vaparache_prakar: new FormControl<number | null>(null),
    manoramaster_id: new FormControl<number | null>(null),
    areap: new FormControl<number | null>(null),
    areai: new FormControl<number | null>(null),
    totalarea: new FormControl<number | null>(null),
    areap1: new FormControl<number | null>(null),
    areai1: new FormControl<number | null>(null),
    totalarea1: new FormControl<number | null>(null),
    levyrate: new FormControl<number | null>(null),
    karAkarani: new FormControl<number | null>(null),
  });

  constructor(
    public dialogRef: MatDialogRef<ManoraKarAakarniComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private NodaniService: NodaniService,
    private util: Util,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    console.log('Received data in kundan:', this.data);
  }
  ngOnInit(): void {
    this.userDetails = this.apiService.getDecodedToken();
    this.route.queryParams.subscribe(params => {
      this.original_new_user_id = params['id'];
      console.log('Query ID==============:', this.original_new_user_id);
    });
    console.log('userDetails', this.userDetails);
    this.loadMalmattechePrakarDDL();
    this.loadMalmattecheVarnanDDL();
    this.loadManoracheBhagDDL();
    this.loadYearIdYearName();
    this.orginal_edit = this.data.orginal_edit || false; // Check if orginal_edit is passed
    if(this.data.tax_payer_id!= ""){
      this.is_edit = true;
      this.editManoraKarAakarni(Number(this.data.tax_payer_id), this.orginal_edit);
    }
  }

  ngAfterViewInit(): void {
    // Fix double-tab issue: Multiple attempts to ensure it works
    setTimeout(() => {
      this.fixTabNavigation();
    }, 100);

    setTimeout(() => {
      this.fixTabNavigation();
    }, 300);

    setTimeout(() => {
      this.fixTabNavigation();
      this.setupMutationObserver();
    }, 500);
  }

  private fixTabNavigation(): void {
    // Prevent recursive calls
    if (this.isFixingTabNavigation) {
      return;
    }

    this.isFixingTabNavigation = true;

    try {
      // Get all mat-form-field elements
      const matFormFields = document.querySelectorAll('mat-form-field');

      matFormFields.forEach((formField: Element) => {
        // Remove tabindex from the mat-form-field itself
        (formField as HTMLElement).removeAttribute('tabindex');
        (formField as HTMLElement).setAttribute('tabindex', '-1');

        // Find all child elements that might be focusable
        const allChildren = (formField as HTMLElement).querySelectorAll('*');
        allChildren.forEach((child: Element) => {
          const tagName = child.tagName.toLowerCase();
          const classList = child.classList;

          // Skip actual input elements - keep them focusable
          if (tagName === 'input' ||
              tagName === 'textarea' ||
              tagName === 'mat-select' ||
              classList.contains('mat-mdc-select') ||
              classList.contains('mat-mdc-select-trigger')) {
            // Keep these elements focusable - do nothing
            return;
          }

          // Remove tabindex from all other elements (wrappers, labels, etc)
          if ((child as HTMLElement).hasAttribute('tabindex')) {
            (child as HTMLElement).removeAttribute('tabindex');
          }
          (child as HTMLElement).setAttribute('tabindex', '-1');
        });
      });

    } finally {
      // Reset flag after a delay
      setTimeout(() => {
        this.isFixingTabNavigation = false;
      }, 100);
    }
  }

  private setupMutationObserver(): void {
    // Add focus event interceptor to prevent wrapper elements from receiving focus
    const dialogContent = document.querySelector('mat-dialog-content');
    if (dialogContent) {
      dialogContent.addEventListener('focusin', (event: Event) => {
        const target = event.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();

        // If the focused element is NOT an input, textarea, mat-select, or mat-select-trigger, redirect focus
        if (tagName !== 'input' &&
            tagName !== 'textarea' &&
            tagName !== 'mat-select' &&
            !target.classList.contains('mat-mdc-select') &&
            !target.classList.contains('mat-mdc-select-trigger')) {

          // Find the nearest actual input element
          const nearestInput = target.querySelector('input, textarea, mat-select, .mat-mdc-select, .mat-mdc-select-trigger') as HTMLElement;
          if (nearestInput) {
            event.preventDefault();
            event.stopPropagation();
            nearestInput.focus();
          }
        }
      }, true); // Use capture phase
    }
  }

  loadMalmattechePrakarDDL(): void {
    this.NodaniService.getMalmattechePrakar_ManoraModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.manora_malmattechePrakar = res?.data;
      }
    });
  }

  loadMalmattecheVarnanDDL(): void {
    this.NodaniService.getMalmattecheVarnan_ManoraModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.manora_malmattecheVarnan = res?.data;
      }
    });
  }

  loadManoracheBhagDDL(): void {
    this.NodaniService.getBandkamachaMajla_ManoraModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.manora_manoracheBhag = res?.data;
      }
    });
  }

  loadYearIdYearName(): void {
    this.NodaniService.getyearIdName_KhulaBhukandModal().subscribe({
      next: (res: any) => {
        console.log('res', res.data);
        this.yearId = res?.data[0]?.YEAR_ID;
        this.YearName = res?.data[0]?.YEAR_NAME;
      }
    });
  }

  foot_to_meter_conversion()
  {
    let areap = Number(this.manoraKarForm.value.areap);
    let areai = Number(this.manoraKarForm.value.areai);
    let totalarea = areap * areai;
    this.manoraKarForm.get('totalarea')?.setValue(Number(totalarea) || 0);
    let areap1 = parseFloat((areap / 10.764).toFixed(2));
    this.manoraKarForm.get('areap1')?.setValue(areap1 || 0);
    let areai1 = parseFloat((areai / 10.764).toFixed(2));
    this.manoraKarForm.get('areai1')?.setValue(areai1 || 0);
    let totalarea1_cal = parseFloat((totalarea / 10.764).toFixed(2));

    this.manoraKarForm.get('totalarea1')?.setValue(Number(totalarea1_cal) || 0);
  }

  getKarAakarani(){
    // (totalarea / 100) * levyrate
    // karAkarani
    const cal = (Number(this.manoraKarForm.value.totalarea)) * Number(this.manoraKarForm.value.levyrate);
    const total = cal.toFixed(2); 
    // console.log("total", total)
    this.manoraKarForm.get('karAkarani')?.setValue(Number(total) || 0);

  }

  save_manora_form(){
    if (!this.manoraKarForm.invalid) {
      let params = {
        newuser_id:"",
        user_id: this.userDetails.userId,
        milkat_vapar_id: this.manoraKarForm.value.milkat_vapar_id,
        malmatta_id: this.manoraKarForm.value.malmatta_id,
        vaparache_prakar: this.manoraKarForm.value.vaparache_prakar,
        manoramaster_id: this.manoraKarForm.value.manoramaster_id,
        areap: this.manoraKarForm.value.areap,
        areai: this.manoraKarForm.value.areai,
        totalarea: this.manoraKarForm.value.totalarea,
        areap1: this.manoraKarForm.value.areap1,
        areai1: this.manoraKarForm.value.areai1,
        totalarea1: this.manoraKarForm.value.totalarea1,
        levyrate: this.manoraKarForm.value.levyrate,
        karAkarani: this.manoraKarForm.value.karAkarani,
        rno: localStorage.getItem('rno'),
        vard_number: this.data.ward_kramank,
        annu_kramank:this.data.anu_kramank,
        year_id: this.yearId,
        year_name: this.YearName,
        random_number:localStorage.getItem('randomNumber'),
        token: localStorage.getItem('token'),
      };
      if(this.orginal_edit == true) {
        params.newuser_id = String(this.original_new_user_id); // Set new user ID from query params 
        console.log('Params for original edit:', params);
        this.NodaniService.addManoraForm_from_original_table(params).subscribe({
          next: (res: any) => {
            console.log('save Manora kar aakarni', res);
            if (res.status == 201) {
              // console.log('inside', res);
              this.toastr.success(res.message, 'Success');
              // this.loginSuccess = false;
            } else {
              this.toastr.warning(res.message, 'Warning');
            }
            // this.isLoading = false;
          },
          error: (err: Error) => {
            console.error('Error adding manora kar form:', err);
            this.toastr.error('There was an error adding the manora kar form.', 'Error');
          },
        });
      }else{
        params.newuser_id = ""; // Set new user ID from query params
        this.NodaniService.addManoraForm(params).subscribe({
          next: (res: any) => {
            console.log('save Manora kar aakarni', res);
            if (res.status == 201) {
              // console.log('inside', res);
              this.toastr.success(res.message, 'Success');
              // this.loginSuccess = false;
            } else {
              this.toastr.warning(res.message, 'Warning');
            }
            // this.isLoading = false;
          },
          error: (err: Error) => {
            console.error('Error adding manora kar form:', err);
            this.toastr.error('There was an error adding the manora kar form.', 'Error');
          },
        });
      }
    } else {
      this.toastr.warning('Please fill all required fields.', 'warning');
    }
  }
  editManoraKarAakarni(id: number, orginal_edit: boolean = false) {
    if(orginal_edit){
      this.NodaniService.editmanoraKarAakaraniModal_from_original_edit(id).subscribe({
          next: (res: any) => {
            console.log('editmanoraKarAakaraniModal_from_original_edit', res);
            if(res.data.length > 0){
              this.manoraKarForm.patchValue({
                  milkat_vapar_id: Number(res?.data[0].MILKAT_VAPAR_ID),
                  malmatta_id: Number(res?.data[0].MALMATTA_ID),
                  vaparache_prakar: res?.data[0].VAPARACHE_PRAKAR,
                  manoramaster_id: Number(res?.data[0].MANORAMASTER_ID),
                  areap: res?.data[0].AREAP,
                  areai: res?.data[0].AREAI,
                  totalarea: res?.data[0].TOTALAREA,
                  areap1: res?.data[0].AREAP1,
                  areai1: res?.data[0].AREAI1,
                  totalarea1: res?.data[0].TOTALAREA1,
                  levyrate: res?.data[0].CAPITAL,
                  karAkarani: res?.data[0].TAXATION,
              });
            }
          },
          error: (err) => {
            console.error('Error fetching bankam kar aakarni data:', err);
            this.toastr.error('There was an error fetching the bankam kar aakarni data.', 'Error');
          }
        });
    }else{
        this.NodaniService.editmanoraKarAakaraniModal(id).subscribe({
          next: (res: any) => {
            console.log('editmanoraKarAakaraniModal', res);
            if(res.data.length > 0){
              this.manoraKarForm.patchValue({
                  milkat_vapar_id: Number(res?.data[0].MILKAT_VAPAR_ID),
                  malmatta_id: Number(res?.data[0].MALMATTA_ID),
                  vaparache_prakar: res?.data[0].VAPARACHE_PRAKAR,
                  manoramaster_id: Number(res?.data[0].MANORAMASTER_ID),
                  areap: res?.data[0].AREAP,
                  areai: res?.data[0].AREAI,
                  totalarea: res?.data[0].TOTALAREA,
                  areap1: res?.data[0].AREAP1,
                  areai1: res?.data[0].AREAI1,
                  totalarea1: res?.data[0].TOTALAREA1,
                  levyrate: res?.data[0].CAPITAL,
                  karAkarani: res?.data[0].TAXATION,
              });
            }
          },
          error: (err) => {
            console.error('Error fetching bankam kar aakarni data:', err);
            this.toastr.error('There was an error fetching the bankam kar aakarni data.', 'Error');
          }
        });
    }
    
  }
  update_manora_form(){
    if (!this.manoraKarForm.invalid) {
      let params = {
        milkat_vapar_id: this.manoraKarForm.value.milkat_vapar_id,
        malmatta_id: this.manoraKarForm.value.malmatta_id,
        vaparache_prakar: this.manoraKarForm.value.vaparache_prakar,
        manoramaster_id: this.manoraKarForm.value.manoramaster_id,
        areap: this.manoraKarForm.value.areap,
        areai: this.manoraKarForm.value.areai,
        totalarea: this.manoraKarForm.value.totalarea,
        areap1: this.manoraKarForm.value.areap1,
        areai1: this.manoraKarForm.value.areai1,
        totalarea1: this.manoraKarForm.value.totalarea1,
        levyrate: this.manoraKarForm.value.levyrate,
        karAkarani: this.manoraKarForm.value.karAkarani,
      };
      if(this.orginal_edit == true) {
        this.NodaniService.updateManoraKarModalFromOriginalTable(params, this.data.tax_payer_id).subscribe({
          next: (res: any) => {
            console.log('update Manora kar aakarni', res);
            if (res.status == 200) {
              // console.log('inside', res);
              this.toastr.success(res.message, 'Success');
              // this.loginSuccess = false;
            } else {
              this.toastr.warning(res.message, 'Warning');
            }
            // this.isLoading = false;
          },
          error: (err: Error) => {
            console.error('Error updating manora kar form:', err);
            this.toastr.error('There was an error updating the manora kar form.', 'Error');
          },
        });
      }else{
        this.NodaniService.updateManoraKarModal(params, this.data.tax_payer_id).subscribe({
          next: (res: any) => {
            console.log('update Manora kar aakarni', res);
            if (res.status == 200) {
              // console.log('inside', res);
              this.toastr.success(res.message, 'Success');
              // this.loginSuccess = false;
            } else {
              this.toastr.warning(res.message, 'Warning');
            }
            // this.isLoading = false;
          },
          error: (err: Error) => {
            console.error('Error updating manora kar form:', err);
            this.toastr.error('There was an error updating the manora kar form.', 'Error');
          },
        });
      }
      
    } else {
      this.toastr.warning('Please fill all required fields.', 'warning');
    }
  }
}
