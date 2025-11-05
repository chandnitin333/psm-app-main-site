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
      this.focusFirstElement();
    }, 500);
  }

  private fixTabNavigation(): void {
    // Prevent recursive calls
    if (this.isFixingTabNavigation) {
      return;
    }

    this.isFixingTabNavigation = true;

    try {
      const dialogContent = document.querySelector('mat-dialog-content');
      if (!dialogContent) return;

      // Define custom tab order - only these fields in this specific order
      const tabOrderFields = [
        'milkat_vapar_id',        // 1. मालमत्तेचे प्रकार
        'milkat_vapar_id1',       // 2. मालमत्तेचे वर्णन
        'vaparache_prakar',       // 3. वापर प्रकार
        'gatgrampanchayat_id',    // 4. गावाचे नाव
        'openplot_id',            // 5. गावठाण/गावठाण बाहेरचे
        'areap',                  // 6. क्षेत्रफळ पु.प.(चौ.फुट)
        'areai',                  // 7. क्षेत्रफळ उ.द.(चौ.फुट)
        'totalarea'               // 8. एकूण क्षेत्रफळ (चौ.फुट)
      ];

      // AGGRESSIVELY remove tabindex from ALL wrapper elements
      const allMatFormFields = dialogContent.querySelectorAll('mat-form-field');
      allMatFormFields.forEach((formField: Element) => {
        // Set wrapper to unfocusable
        (formField as HTMLElement).removeAttribute('tabindex');
        (formField as HTMLElement).setAttribute('tabindex', '-1');

        // Get ALL children and make them unfocusable except actual inputs/selects
        const allChildren = (formField as HTMLElement).querySelectorAll('*');
        allChildren.forEach((child: Element) => {
          const tagName = child.tagName.toLowerCase();
          const htmlElement = child as HTMLElement;

          // Skip actual input and mat-select elements
          if (tagName === 'input' || tagName === 'mat-select') {
            return;
          }

          // Remove ALL tabindex attributes from wrapper elements
          htmlElement.removeAttribute('tabindex');
          htmlElement.setAttribute('tabindex', '-1');

          // Also remove from specific Material wrapper classes
          if (htmlElement.classList.contains('mat-mdc-text-field-wrapper') ||
              htmlElement.classList.contains('mat-mdc-form-field-flex') ||
              htmlElement.classList.contains('mat-mdc-form-field-infix') ||
              htmlElement.classList.contains('mdc-notched-outline') ||
              htmlElement.classList.contains('mat-mdc-select-trigger') ||
              htmlElement.classList.contains('mat-mdc-select-value')) {
            htmlElement.removeAttribute('tabindex');
            htmlElement.setAttribute('tabindex', '-1');
          }
        });
      });

      // Now set custom tabindex on fields in our specific order
      let tabIndex = 1;
      tabOrderFields.forEach((fieldName) => {
        const inputElement = dialogContent.querySelector(`[formcontrolname="${fieldName}"]`) as HTMLElement;
        if (inputElement) {
          inputElement.removeAttribute('tabindex');
          inputElement.setAttribute('tabindex', tabIndex.toString());
          tabIndex++;
        }
      });

      // Set tabindex=-1 on all other input fields that are NOT in our tab order
      const allInputs = dialogContent.querySelectorAll('input, mat-select');
      allInputs.forEach((input: Element) => {
        const formControlName = (input as HTMLElement).getAttribute('formcontrolname');
        if (formControlName && !tabOrderFields.includes(formControlName)) {
          (input as HTMLElement).removeAttribute('tabindex');
          (input as HTMLElement).setAttribute('tabindex', '-1');
        }
      });

      // Set tabindex on buttons - जतन करा first, then रद्द करा
      const buttons = document.querySelectorAll('mat-dialog-actions button');
      if (buttons.length >= 2) {
        // First button is "जतन करा"
        (buttons[0] as HTMLElement).removeAttribute('tabindex');
        (buttons[0] as HTMLElement).setAttribute('tabindex', tabIndex.toString());
        tabIndex++;
        // Second button is "रद्द करा"
        (buttons[1] as HTMLElement).removeAttribute('tabindex');
        (buttons[1] as HTMLElement).setAttribute('tabindex', tabIndex.toString());
      }

    } finally {
      setTimeout(() => {
        this.isFixingTabNavigation = false;
      }, 100);
    }
  }

  private focusFirstElement(): void {
    // Focus the first element in tab order when modal opens
    setTimeout(() => {
      const dialogContent = document.querySelector('mat-dialog-content');
      if (dialogContent) {
        const firstElement = dialogContent.querySelector('[formcontrolname="milkat_vapar_id"]') as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        }
      }
    }, 100);
  }

  private setupMutationObserver(): void {
    // Intercept Tab key to manually control focus order
    const dialogContent = document.querySelector('mat-dialog-content');
    const dialogActions = document.querySelector('mat-dialog-actions');

    if (dialogContent) {
      // Define the exact tab order
      const tabOrderFields = [
        'milkat_vapar_id',
        'milkat_vapar_id1',
        'vaparache_prakar',
        'gatgrampanchayat_id',
        'openplot_id',
        'areap',
        'areai',
        'totalarea'
      ];

      // Get all focusable elements in order
      const getFocusableElements = (): HTMLElement[] => {
        const elements: HTMLElement[] = [];

        // Add fields in custom order
        tabOrderFields.forEach(fieldName => {
          const element = dialogContent.querySelector(`[formcontrolname="${fieldName}"]`) as HTMLElement;
          if (element) {
            elements.push(element);
          }
        });

        // Add buttons
        const buttons = dialogActions?.querySelectorAll('button');
        if (buttons) {
          buttons.forEach(button => elements.push(button as HTMLElement));
        }

        return elements;
      };

      // Intercept Tab keydown
      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          event.preventDefault(); // Prevent default tab behavior

          const focusableElements = getFocusableElements();
          const currentElement = document.activeElement as HTMLElement;

          // Find current element index
          let currentIndex = -1;
          for (let i = 0; i < focusableElements.length; i++) {
            if (focusableElements[i] === currentElement ||
                focusableElements[i].contains(currentElement)) {
              currentIndex = i;
              break;
            }
          }

          // Calculate next index
          let nextIndex: number;
          if (event.shiftKey) {
            // Shift+Tab - go backwards
            nextIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
          } else {
            // Tab - go forwards
            nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
          }

          // Focus next element
          if (focusableElements[nextIndex]) {
            focusableElements[nextIndex].focus();
          }
        }
      };

      // Add event listener to dialog content
      dialogContent.addEventListener('keydown', (event: Event) => handleTabKey(event as KeyboardEvent), true);

      // Also add to dialog actions for buttons
      if (dialogActions) {
        dialogActions.addEventListener('keydown', (event: Event) => handleTabKey(event as KeyboardEvent), true);
      }
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
