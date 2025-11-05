import { CommonModule } from '@angular/common';
import { Component, Inject, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ApiService } from '../../../services/api.service';
import { NodaniService } from '../../../services/nodani.service';
import Util from '../../../utils/utils';
import $ from 'jquery';
@Component({
  selector: 'app-khula-bhukhand-kar-aakarani',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './khula-bhukhand-kar-aakarani.component.html',
  styleUrl: './khula-bhukhand-kar-aakarani.component.css'
})
export class KhulaBhukhandKarAakaraniComponent implements AfterViewInit {
  khulaBhukand_malmattechePrakar: { MILKAT_VAPAR_ID: number; MILKAT_VAPAR_NAME: String }[] = [];
  khulaBhukhand_gavacheNav =  [{ gatGrampanchayatId: 0, gatGrampanchayatName: '' }];
  khulaBhukhand_gavthanBaherche: { openplot_id: number; PRAKAR_NAME: string }[] = [];
  yearId: number = 0;
  YearName: string = '';
  userDetails: any = [];
  is_edit:boolean = false;
  orginal_edit:boolean = false;
  original_new_user_id : string = '';

  // Flag to prevent infinite loops
  private isFixingTabNavigation: boolean = false;
  private debounceTimer: any;

  khulaBhukhandModal = new FormGroup({
    milkat_vapar_id: new FormControl<number | null>(null),
    milkat_vapar_id1: new FormControl<number | null>(null),
    vaparache_prakar: new FormControl(undefined),
    gatgrampanchayat_id: new FormControl<number | null>(null),
    openplot_id: new FormControl<number | null>(null),
    areap: new FormControl<number | null>(null),
    areai: new FormControl<number | null>(null),
    totalarea: new FormControl<number | null>(null),
    areap1: new FormControl<number | null>(null),
    areai1: new FormControl<number | null>(null),
    totalarea1: new FormControl<number | null>(null),
    annualvalue: new FormControl<number | null>(null),
    levyrate: new FormControl<number | null>(null),
    capital:  new FormControl<number | null>(null),
    taxation: new FormControl<number | null>(null),
  });
  constructor(
    public dialogRef: MatDialogRef<KhulaBhukhandKarAakaraniComponent>,
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
    // console.log('userDetails', this.userDetails);
    // this.gavacheNav = [{ gatGrampanchayatId: 0, gatGrampanchayatName: '' }];
    this.route.queryParams.subscribe(params => {
      this.original_new_user_id = params['id'];
      console.log('Query ID==============:', this.original_new_user_id);
    });

    this.khulaBhukhand_gavacheNav[0].gatGrampanchayatId = this.userDetails?.GATGRAMPANCHAYAT_id;
    this.khulaBhukhand_gavacheNav[0].gatGrampanchayatName = this.userDetails?.GATGRAMPANCHAYAT_NAME;
    this.loadMalmattechePrakarDDL();
    this.loadYearIdYearName();
    this.orginal_edit = this.data.orginal_edit || false; // Check if orginal_edit is passed
    if(this.data.taxation_id!= ""){
      this.is_edit = true;
      this.editKhulaBhukhandForm(this.data.taxation_id, this.orginal_edit);
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

        // Check if this is a wrapper element (not an actual input/button)
        const isWrapperElement =
          tagName !== 'input' &&
          tagName !== 'textarea' &&
          tagName !== 'mat-select' &&
          tagName !== 'button' &&
          !target.classList.contains('mat-mdc-select') &&
          !target.classList.contains('mat-mdc-select-trigger') &&
          !target.classList.contains('mat-mdc-button') &&
          !target.classList.contains('mdc-button');

        if (isWrapperElement) {
          // Find the nearest actual input element within this wrapper
          const nearestInput = target.querySelector('input, textarea, mat-select, .mat-mdc-select, .mat-mdc-select-trigger, button') as HTMLElement;
          if (nearestInput) {
            event.preventDefault();
            event.stopImmediatePropagation();
            setTimeout(() => {
              nearestInput.focus();
            }, 0);
          }
        }
      }, true); // Use capture phase
    }
  }

  loadMalmattechePrakarDDL(): void {
    this.NodaniService.getMalmattechePrakar_KhulaBhukandModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.khulaBhukand_malmattechePrakar = res?.data;
      }
    });
  }
  getGavthanDDL(event: any){
    // console.log('Selected Grampanchayat:', event);
    this.NodaniService.getgavthanBaherche_KhulaBhukandModal(Number(event)).subscribe({
      next: (res: any) => {
        this.khulaBhukhand_gavthanBaherche = res?.data;
      }
    });
  }
  getLandAnnualAndAakaraniRateData(event: any) {
    this.NodaniService.getlandAnnualAndAakaraniRateValues_KhulaBhukandModal(Number(event)).subscribe({
      next: (res: any) => {
      //  console.log('Land Annual and Aakarani Rate Data:', res.data[0]);
       this.khulaBhukhandModal.get('annualvalue')?.setValue(res?.data[0]?.ANNUALCOST_NAME || 0);
       this.khulaBhukhandModal.get('levyrate')?.setValue(res?.data[0]?.LEVYRATE_NAME || 0);
      }
    });
  }
  loadYearIdYearName(): void {
    this.NodaniService.getyearIdName_KhulaBhukandModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.yearId = res?.data[0]?.YEAR_ID;
        this.YearName = res?.data[0]?.YEAR_NAME;
      }
    });
  }
  editKhulaBhukhandForm(id:any, orginal_edit:boolean) {
    if(orginal_edit == true) {
      this.NodaniService.editKhulabhukhandModal_original_edit(id).subscribe({
        next: (res: any) => {
          // console.log('Khula Bhukhand Data:============', res.data);
          if(res.data.length > 0){
            this.getGavthanDDL(res.data[0].GATGRAMPANCHAYAT_ID);
            this.khulaBhukhandModal.patchValue({
              milkat_vapar_id: Number(res.data[0].MILKAT_VAPAR_ID),
              milkat_vapar_id1: Number(res.data[0].MILKAT_VAPAR_ID1),
              vaparache_prakar: res.data[0].VAPARACHE_PRAKAR,
              gatgrampanchayat_id: Number(res.data[0].GATGRAMPANCHAYAT_ID),
              openplot_id: Number(res.data[0].OPENPLOT_ID),
              areap: res.data[0].AREAP,
              areai: res.data[0].AREAI,
              totalarea: res.data[0].TOTALAREA,
              areap1: res.data[0].AREAP1,
              areai1: res.data[0].AREAI1,
              totalarea1: res.data[0].TOTALAREA1,
              annualvalue: res.data[0].ANNUALVALUE,
              levyrate: res.data[0].LEVYRATE,
              capital: res.data[0].CAPITAL,
              taxation: res.data[0].TAXATION
            });
            
          }
        },
        error: (err) => {
          console.error('Error fetching Khula Bhukhand data:', err);
          this.toastr.error('There was an error fetching the Khula Bhukhand data.', 'Error');
        }
      });
    }else{
      this.NodaniService.editKhulabhukhandModal(id).subscribe({
        next: (res: any) => {
          // console.log('Khula Bhukhand Data:============', res.data);
          if(res.data.length > 0){
            this.getGavthanDDL(res.data[0].GATGRAMPANCHAYAT_ID);
            this.khulaBhukhandModal.patchValue({
              milkat_vapar_id: Number(res.data[0].MILKAT_VAPAR_ID),
              milkat_vapar_id1: Number(res.data[0].MILKAT_VAPAR_ID1),
              vaparache_prakar: res.data[0].VAPARACHE_PRAKAR,
              gatgrampanchayat_id: Number(res.data[0].GATGRAMPANCHAYAT_ID),
              openplot_id: Number(res.data[0].OPENPLOT_ID),
              areap: res.data[0].AREAP,
              areai: res.data[0].AREAI,
              totalarea: res.data[0].TOTALAREA,
              areap1: res.data[0].AREAP1,
              areai1: res.data[0].AREAI1,
              totalarea1: res.data[0].TOTALAREA1,
              annualvalue: res.data[0].ANNUALVALUE,
              levyrate: res.data[0].LEVYRATE,
              capital: res.data[0].CAPITAL,
              taxation: res.data[0].TAXATION
            });
            
          }
        },
        error: (err) => {
          console.error('Error fetching Khula Bhukhand data:', err);
          this.toastr.error('There was an error fetching the Khula Bhukhand data.', 'Error');
        }
      });
    }
  }
  save_khula_bhukhand_form(){
    if (!this.khulaBhukhandModal.invalid) {
      // if(this.data.anu_kramank == null || this.data.ward_kramank == null || this.data.ward_kramank == undefined || this.data.anu_kramank == undefined){
      //   this.toastr.warning("अनु क्रमांक आणि वॉर्ड क्रमांक आवश्यक आहे", 'Warning');
      //   return;
      // }
      let params = {
        newuser_id:"",
        user_id: this.userDetails.userId,
        milkat_vapar_id: this.khulaBhukhandModal.value.milkat_vapar_id,
        milkat_vapar_id1: this.khulaBhukhandModal.value.milkat_vapar_id1,
        vaparache_prakar: this.khulaBhukhandModal.value.vaparache_prakar,
        gatgrampanchayat_id: this.khulaBhukhandModal.value.gatgrampanchayat_id,
        openplot_id: this.khulaBhukhandModal.value.openplot_id,
        areap: this.khulaBhukhandModal.value.areap,
        areai: this.khulaBhukhandModal.value.areai,
        totalarea: this.khulaBhukhandModal.value.totalarea,
        areap1: this.khulaBhukhandModal.value.areap1,
        areai1: this.khulaBhukhandModal.value.areai1,
        totalarea1: this.khulaBhukhandModal.value.totalarea1,
        annualvalue: this.khulaBhukhandModal.value.annualvalue,
        levyrate: this.khulaBhukhandModal.value.levyrate,
        capital: this.khulaBhukhandModal.value.capital,
        taxation: this.khulaBhukhandModal.value.taxation,
        rno: localStorage.getItem('rno'),
        vard_number: this.data.ward_kramank,
        annu_kramank:this.data.anu_kramank,
        year_id: this.yearId,
        year_name: this.YearName,
        randomNumber:localStorage.getItem('randomNumber'),
      };
      if(this.orginal_edit == true) {
        params.newuser_id = String(this.original_new_user_id); // Set new user ID from query params
        console.log('Params for original edit:', params);
        this.NodaniService.addKhulaBhukhandFormFromoriginalTable(params).subscribe({
            next: (res: any) => {
              console.log('save khula bhukhand', res);
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
              console.error('Error adding khula bhukhand form:', err);
              this.toastr.error('There was an error adding the khula bhukhand form.', 'Error');
            },
          });
      }else{
        params.newuser_id = ""; // Set new user ID from query params
        console.log('Params for original edit:', params);
          this.NodaniService.addKhulaBhukhandForm(params).subscribe({
            next: (res: any) => {
              console.log('save khula bhukhand', res);
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
              console.error('Error adding khula bhukhand form:', err);
              this.toastr.error('There was an error adding the khula bhukhand form.', 'Error');
            },
          });
      }
      
    } else {
      this.toastr.warning('Please fill all required fields.', 'warning');
    }
  }

  foot_to_meter_conversion()
  {
    let areap = Number(this.khulaBhukhandModal.value.areap);
    let areai = Number(this.khulaBhukhandModal.value.areai);
    let totalarea = areap * areai;
    this.khulaBhukhandModal.get('totalarea')?.setValue(Number(totalarea) || 0);
    let areap1 = parseFloat((areap / 10.764).toFixed(2));
    this.khulaBhukhandModal.get('areap1')?.setValue(areap1 || 0);
    let areai1 = parseFloat((areai / 10.764).toFixed(2));
    this.khulaBhukhandModal.get('areai1')?.setValue(areai1 || 0);
    let totalarea1_cal = parseFloat((totalarea / 10.764).toFixed(2));

    this.khulaBhukhandModal.get('totalarea1')?.setValue(Number(totalarea1_cal) || 0);
    let capital = parseFloat((Number(this.khulaBhukhandModal.value.totalarea1) * Number(this.khulaBhukhandModal.value.annualvalue)).toFixed(2));
    this.khulaBhukhandModal.get('capital')?.setValue(Number(capital) || 0);
    let taxation = Number(capital) * Number(this.khulaBhukhandModal.value.levyrate) / 1000;
    console.log('Taxation:', taxation);
    let finalTaxation = taxation.toFixed(2)
    this.khulaBhukhandModal.get('taxation')?.setValue(Number(finalTaxation) || 0);
  }
  foot_to_meter_conversion_ekun_foot(){
    // Number(this.khulaBhukhandModal.value.totalarea1)
    let totalarea1_cal = parseFloat((Number(this.khulaBhukhandModal.value.totalarea) / 10.764).toFixed(2));
    this.khulaBhukhandModal.get('totalarea1')?.setValue(Number(totalarea1_cal) || 0);
    let capital = parseFloat((Number(this.khulaBhukhandModal.value.totalarea1) * Number(this.khulaBhukhandModal.value.annualvalue)).toFixed(2));
    this.khulaBhukhandModal.get('capital')?.setValue(Number(capital) || 0);
    let taxation = Number(capital) * Number(this.khulaBhukhandModal.value.levyrate) / 1000;
    let finalTaxation = taxation.toFixed(2)
    console.log('Taxation:', taxation);
    this.khulaBhukhandModal.get('taxation')?.setValue(Number(finalTaxation) || 0);
  }
  update_khula_bhukhand_form(){
    if (!this.khulaBhukhandModal.invalid) {
      let params = {
        milkat_vapar_id: this.khulaBhukhandModal.value.milkat_vapar_id,
        milkat_vapar_id1: this.khulaBhukhandModal.value.milkat_vapar_id1,
        vaparache_prakar: this.khulaBhukhandModal.value.vaparache_prakar,
        gatgrampanchayat_id: this.khulaBhukhandModal.value.gatgrampanchayat_id,
        openplot_id: this.khulaBhukhandModal.value.openplot_id,
        areap: this.khulaBhukhandModal.value.areap,
        areai: this.khulaBhukhandModal.value.areai,
        totalarea: this.khulaBhukhandModal.value.totalarea,
        areap1: this.khulaBhukhandModal.value.areap1,
        areai1: this.khulaBhukhandModal.value.areai1,
        totalarea1: this.khulaBhukhandModal.value.totalarea1,
        annualvalue: this.khulaBhukhandModal.value.annualvalue,
        levyrate: this.khulaBhukhandModal.value.levyrate,
        capital: this.khulaBhukhandModal.value.capital,
        taxation: this.khulaBhukhandModal.value.taxation
      };
       if(this.orginal_edit == true) {
        this.NodaniService.updateKhulaBhukhandForm_original_table_update(params, this.data.taxation_id).subscribe({
            next: (res: any) => {
              if (res.status == 200) {
                this.toastr.success(res?.message, 'Success');
              } else {
                this.toastr.error(res?.message, 'Warning');
              }
            },
            error: (err: any) => {
              this.toastr.error('Failed to updateopen plot rate', 'Error');
              console.log("error: updateOpen plot  ::", err);
              // this.isSubmitted = false;
            }

        });
       }else{
          this.NodaniService.updateKhulaBhukhandForm(params, this.data.taxation_id).subscribe({
            next: (res: any) => {
              if (res.status == 200) {
                this.toastr.success(res?.message, 'Success');
              } else {
                this.toastr.error(res?.message, 'Warning');
              }
            },
            error: (err: any) => {
              this.toastr.error('Failed to updateopen plot rate', 'Error');
              console.log("error: updateOpen plot  ::", err);
              // this.isSubmitted = false;
            }

          });
       }
      
    }else{
      this.toastr.warning('Please fill all required fields.', 'warning');
      return;
    }
    
  }
  
}
