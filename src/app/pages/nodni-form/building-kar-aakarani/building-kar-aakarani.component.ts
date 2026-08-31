import { Component, Inject, AfterViewInit, EventEmitter, HostListener } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Util from '../../../utils/utils';
import { ApiService } from '../../../services/api.service';
import { NodaniService } from '../../../services/nodani.service';

@Component({
  selector: 'app-building-kar-aakarani',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './building-kar-aakarani.component.html',
  styleUrl: './building-kar-aakarani.component.css'
})
export class BuildingKarAakaraniComponent implements AfterViewInit {

  @HostListener('focusin', ['$event'])
  onFocusIn(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (target.tagName === 'INPUT' && target.type !== 'radio' && target.type !== 'checkbox') {
      setTimeout(() => target.select());
    }
  }

  recordSaved = new EventEmitter<void>();
  building_malmattechePrakar: { MILKAT_VAPAR_ID: number; MILKAT_VAPAR_NAME: String }[] = [];
  building_malmattecheVarnan: { MALMATTA_ID: number; DESCRIPTION_NAME: String }[] = [];
  building_bandkamachaMajla: { FLOOR_ID: number; FLOOR_NAME: String }[] = [];
  userDetails: any = [];
  yearId: number = 0;
  YearName: string = '';
  is_edit: boolean = false;
  orginal_edit: boolean = false; // Flag to check if orginal_edit is passed
  original_new_user_id : string = '';

  // Flag to prevent infinite loops
  private isFixingTabNavigation: boolean = false;

  BuildingkarModal = new FormGroup({
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
    lifespan: new FormControl<number | null>(null),
    constructing: new FormControl<number | null>(null),
    depreciation: new FormControl<number | null>(null),
    weighted: new FormControl<number | null>(null),
    annual_cost: new FormControl<number | null>(null),
    levyrate: new FormControl<number | null>(null),
    one: new FormControl<number | null>(null),
    two: new FormControl<number | null>(null),
  });

   constructor(
    public dialogRef: MatDialogRef<BuildingKarAakaraniComponent>,
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
    this.loadBandkamachaMajlaDDL();
    this.loadYearIdYearName();
    this.orginal_edit = this.data.orginal_edit || false; // Check if orginal_edit is passed
    if(this.data.construction_id!= ""){
      this.is_edit = true;
      this.editbandkamKarAkarnModal(Number(this.data.construction_id), this.orginal_edit);
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

      // Define custom tab order - same as in setupMutationObserver
      const tabOrderFields = [
        'milkat_vapar_id',
        'malmatta_id',
        'vaparache_prakar',
        'manoramaster_id',
        'areap',
        'areai',
        'totalarea',
        'lifespan'
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

      // Set tabindex on buttons
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
        'milkat_vapar_id',       // 1. मालमत्तेचे प्रकार
        'malmatta_id',           // 2. मालमत्तेचे वर्णन
        'vaparache_prakar',      // 3. वापर प्रकार
        'manoramaster_id',       // 4. बांधकामाचा मजला
        'areap',                 // 5. क्षेत्रफळ पु.प.(चौ.फुट)
        'areai',                 // 6. क्षेत्रफळ उ.द.(चौ.फुट)
        'totalarea',             // 7. एकूण क्षेत्रफळ (चौ.फुट)
        'lifespan'               // 8. वयोमान
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

          // Focus next element and select text if it's an input
          if (focusableElements[nextIndex]) {
            focusableElements[nextIndex].focus();
            const el = focusableElements[nextIndex] as HTMLInputElement;
            if (el.tagName === 'INPUT' && el.type !== 'radio' && el.type !== 'checkbox') {
              setTimeout(() => el.select());
            }
          }
        }
      };

      // Auto-select text on any focus (click or tab)
      const handleFocusIn = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.tagName === 'INPUT' && target.type !== 'radio' && target.type !== 'checkbox') {
          setTimeout(() => target.select());
        }
      };

      // Add event listener to dialog content
      dialogContent.addEventListener('keydown', (event: Event) => handleTabKey(event as KeyboardEvent), true);
      dialogContent.addEventListener('focusin', handleFocusIn, true);

      // Also add to dialog actions for buttons
      if (dialogActions) {
        dialogActions.addEventListener('keydown', (event: Event) => handleTabKey(event as KeyboardEvent), true);
      }
    }
  }

  loadMalmattechePrakarDDL(): void {
    this.NodaniService.getMalmattechePrakar_BuildingKarModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.building_malmattechePrakar = res?.data;
      }
    });
  }

  loadMalmattecheVarnanDDL(): void {
    this.NodaniService.getMalmattecheVarnan_BuildingKarModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.building_malmattecheVarnan = res?.data;
      }
    });
  }

  loadBandkamachaMajlaDDL(): void {
    this.NodaniService.getBandkamachaMajla_BuildingKarModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.building_bandkamachaMajla = res?.data;
      }
    });
  }

  async getBharankValue(id: any) {
    console.log('Selected Milkat Vapar ID:', id);
    try {
      const res: any = await this.NodaniService.getgBharankValue_BuildingModal(Number(id)).toPromise();
      let bharankValue = res?.data[0].BUILDINGWEIGHTS_NAME;
      console.log('Bharank Value:', bharankValue);
      this.BuildingkarModal.get('weighted')?.setValue(bharankValue || 0);
    } catch (error) {
      console.error('Error fetching Bharank Value:', error);
    }
  }

  async getghasaraDar(id: any, vayoman : any) {
    console.log('Selected Milkat Vapar ID:', id);
    try {
      const res: any = await this.NodaniService.getgGhasaraDar_BuildingModal(Number(id), vayoman).toPromise();
      console.log('Bharank Value:', res?.data[0]);
      let ghsaraDar = res?.data[0].DEPRECIATION_NAME;
      this.BuildingkarModal.get('depreciation')?.setValue(ghsaraDar || 0);
    } catch (error) {
      console.error('Error fetching Bharank Value:', error);
    }
  }

  getBuildinAndAakaraniDar(malmattaId: any){
    let milkatVaperId = this.BuildingkarModal.value.milkat_vapar_id;
      this.NodaniService.getBuildingValueAndAakaraniDar(Number(malmattaId),Number(milkatVaperId)).subscribe({
        next: (res: any) => {
          let anualCost = res?.data[0].ANNUALPRICE_NAME;
          let levyrate = res?.data[0].LEVYRATE_NAME;
          // console.log('Bharank Value:', bharankValue);
          this.BuildingkarModal.get('annual_cost')?.setValue(anualCost || 0);
          this.BuildingkarModal.get('levyrate')?.setValue(levyrate || 0);

          let one_cost = Number(this.BuildingkarModal.value.depreciation) * Number(this.BuildingkarModal.value.totalarea1) * Number(this.BuildingkarModal.value.weighted) * Number(this.BuildingkarModal.value.annual_cost);
          console.log('one_cost:', one_cost);
          const convrt_one = parseFloat((one_cost).toFixed(2));
          this.BuildingkarModal.get('one')?.setValue(convrt_one || 0);

          let two_cal = one_cost * Number(this.BuildingkarModal.value.levyrate);
          let final_two_calcualtion = parseFloat((two_cal / 1000).toFixed(2));
          console.log('final_two_calcualtion:', final_two_calcualtion);
          this.BuildingkarModal.get('two')?.setValue(final_two_calcualtion || 0);
        }
      });
  }
  async vayoman(event: any) {
    console.log('Selected Vayoman:', this.BuildingkarModal.value.malmatta_id);
    let lifespan = Number(event.target.value);
    await this.getghasaraDar(this.BuildingkarModal.value.malmatta_id, lifespan);
    let currentYear = new Date().getFullYear();
    let constructing = currentYear - lifespan;
    this.BuildingkarModal.get('constructing')?.setValue(Number(constructing) || 0);

    // console.log("this.BuildingkarModal.value.depreciation", this.BuildingkarModal.value.depreciation);
    // console.log("this.BuildingkarModal.value.totalarea1", this.BuildingkarModal.value.totalarea1);
    // console.log("this.BuildingkarModal.value.weighted", this.BuildingkarModal.value.weighted);
    // console.log("this.BuildingkarModal.value.annual_cost", this.BuildingkarModal.value.annual_cost);
    let one_cost = Number(this.BuildingkarModal.value.depreciation) * Number(this.BuildingkarModal.value.totalarea1) * Number(this.BuildingkarModal.value.weighted) * Number(this.BuildingkarModal.value.annual_cost);
    console.log('one_cost:', one_cost);
    const convrt_one = parseFloat((one_cost).toFixed(2));
    this.BuildingkarModal.get('one')?.setValue(convrt_one || 0);

    let two_cal = one_cost * Number(this.BuildingkarModal.value.levyrate);
    let final_two_calcualtion = parseFloat((two_cal / 1000).toFixed(2));
    console.log('final_two_calcualtion:', final_two_calcualtion);
    this.BuildingkarModal.get('two')?.setValue(final_two_calcualtion || 0);
    // one  = depreciation * totalarea1 * weighted *  

    // a = one * levyrate
    // d = a / parseFloat(1000)

  }


  foot_to_meter_conversion()
  {
    let areap = Number(this.BuildingkarModal.value.areap);
    let areai = Number(this.BuildingkarModal.value.areai);
    let totalarea = areap * areai;
    this.BuildingkarModal.get('totalarea')?.setValue(Number(totalarea) || 0);
    let areap1 = parseFloat((areap / 10.764).toFixed(2));
    this.BuildingkarModal.get('areap1')?.setValue(areap1 || 0);
    let areai1 = parseFloat((areai / 10.764).toFixed(2));
    this.BuildingkarModal.get('areai1')?.setValue(areai1 || 0);
    let totalarea1_cal = parseFloat((totalarea / 10.764).toFixed(2));

    this.BuildingkarModal.get('totalarea1')?.setValue(Number(totalarea1_cal) || 0);
    // let capital = parseFloat((Number(this.BuildingkarModal.value.totalarea1) * Number(this.BuildingkarModal.value.annualvalue)).toFixed(2));
    // this.BuildingkarModal.get('capital')?.setValue(Number(capital) || 0);
    // let taxation = Number(capital) * Number(this.BuildingkarModal.value.levyrate) / 1000;
    // console.log('Taxation:', taxation);
    // this.BuildingkarModal.get('taxation')?.setValue(Number(taxation) || 0);
  }

  foot_to_meter_conversion_ekun_foot(){
    // Number(this.khulaBhukhandModal.value.totalarea1)
    let totalarea1_cal = parseFloat((Number(this.BuildingkarModal.value.totalarea) / 10.764).toFixed(2));
    let a1 = parseFloat((Number(this.BuildingkarModal.value.totalarea) / 10.764).toFixed(2));
    this.BuildingkarModal.get('totalarea1')?.setValue(Number(a1) || 0);

    // let capital = parseFloat((Number(this.BuildingkarModal.value.totalarea1) * Number(this.BuildingkarModal.value.annualvalue)).toFixed(2));
    // this.khulaBhukhandModal.get('capital')?.setValue(Number(capital) || 0);
    // let taxation = Number(capital) * Number(this.khulaBhukhandModal.value.levyrate) / 1000;
    // console.log('Taxation:', taxation);
    // this.khulaBhukhandModal.get('taxation')?.setValue(Number(taxation) || 0);
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

  save_bandkam_form(){
    if (!this.BuildingkarModal.invalid) {
      let params = {
        newuser_id:"",
        user_id: this.userDetails.userId,
        milkat_vapar_id: this.BuildingkarModal.value.milkat_vapar_id,
        malmatta_id: this.BuildingkarModal.value.malmatta_id,
        vaparache_prakar: this.BuildingkarModal.value.vaparache_prakar,
        manoramaster_id: this.BuildingkarModal.value.manoramaster_id,
        areap: this.BuildingkarModal.value.areap,
        areai: this.BuildingkarModal.value.areai,
        totalarea: this.BuildingkarModal.value.totalarea,
        areap1: this.BuildingkarModal.value.areap1,
        areai1: this.BuildingkarModal.value.areai1,
        totalarea1: this.BuildingkarModal.value.totalarea1,
        lifespan: this.BuildingkarModal.value.lifespan,
        constructing: this.BuildingkarModal.value.constructing,
        depreciation: this.BuildingkarModal.value.depreciation,
        weighted: this.BuildingkarModal.value.weighted,
        annual_cost: this.BuildingkarModal.value.annual_cost,
        levyrate: this.BuildingkarModal.value.levyrate,
        one: this.BuildingkarModal.value.one,
        two: this.BuildingkarModal.value.two,
        rno: localStorage.getItem('rno'),
        annu_kramank:this.data.anu_kramank,
        vard_number: this.data.ward_kramank,
        year_id: this.yearId,
        year_name: this.YearName,
        random_number:localStorage.getItem('randomNumber'),
        token: localStorage.getItem('token'),
      };
      if(this.orginal_edit == true) {
        params.newuser_id = String(this.original_new_user_id); // Set new user ID from query params 
        console.log('Params for original edit:', params);
        this.NodaniService.addBuildingkarFormI_original_table(params).subscribe({
          next: (res: any) => {
            console.log('save Bandkam kar aakarni', res);
            if (res.status == 201) {
              console.log('inside', res);
              this.toastr.success(res.message, 'Success');
              this.BuildingkarModal.reset();
              this.recordSaved.emit();
              // this.loginSuccess = false;
            } else {
              this.toastr.warning(res.message, 'Warning');
            }
            // this.isLoading = false;
          },
          error: (err: Error) => {
            console.error('Error adding Bandkam kar aakarni form:', err);
            this.toastr.error('There was an error adding the Bandkam kar aakarni form.', 'Error');
          },
        });
      }else{
        params.newuser_id = '';
        this.NodaniService.addBuildingkarForm(params).subscribe({
          next: (res: any) => {
            console.log('save Bandkam kar aakarni', res);
            if (res.status == 201) {
              console.log('inside', res);
              this.toastr.success(res.message, 'Success');
              this.BuildingkarModal.reset();
              this.recordSaved.emit();
              // this.loginSuccess = false;
            } else {
              this.toastr.warning(res.message, 'Warning');
            }
            // this.isLoading = false;
          },
          error: (err: Error) => {
            console.error('Error adding Bandkam kar aakarni form:', err);
            this.toastr.error('There was an error adding the Bandkam kar aakarni form.', 'Error');
          },
        });
      }
      
    } else {
      this.toastr.warning('Please fill all required fields.', 'warning');
    }
  }
  editbandkamKarAkarnModal(id: number, orginal_edit:boolean = false) {
    if( orginal_edit ){
      this.NodaniService.editbandkamKarAakaraniModal_originalEdit(id).subscribe({
        next: (res: any) => {
          console.log('editbandkamKarAakaraniModal_originalEdit', res);
          if(res.data.length > 0){
            this.BuildingkarModal.patchValue({
                milkat_vapar_id: Number(res?.data[0]?.MILKAT_VAPAR_ID),
                malmatta_id: Number(res?.data[0]?.MALMATTA_ID),
                vaparache_prakar: res?.data[0]?.VAPARACHE_PRAKAR,
                manoramaster_id: Number(res?.data[0]?.FLOOR_ID),
                areap: res?.data[0]?.AREAP,
                areai: res?.data[0]?.AREAI,
                totalarea: res?.data[0]?.TOTALAREA,
                areap1: res?.data[0]?.AREAP1,
                areai1: res?.data[0]?.AREAI1,
                totalarea1: res?.data[0]?.TOTALAREA1,
                lifespan: Number(res?.data[0]?.LIFESPAN),
                constructing: Number(res?.data[0]?.CONSTRUCTING),
                depreciation: res?.data[0]?.DEPRECIATION,
                weighted: res?.data[0]?.WEIGHTTAGE,
                annual_cost: res?.data[0]?.ANNUALCOST,
                levyrate: res?.data[0]?.LEVYRATE,
                one: res?.data[0]?.ONE,
                two: res?.data[0]?.TWO
            });
          }
        },
        error: (err) => {
          console.error('Error fetching bankam kar aakarni data:', err);
          this.toastr.error('There was an error fetching the bankam kar aakarni data.', 'Error');
        }
      });
    }else{
      this.NodaniService.editbandkamKarAakaraniModal(id).subscribe({
        next: (res: any) => {
          console.log('editbandkamKarAakaraniModal', res);
          if(res.data.length > 0){
            this.BuildingkarModal.patchValue({
                milkat_vapar_id: Number(res?.data[0]?.MILKAT_VAPAR_ID),
                malmatta_id: Number(res?.data[0]?.MALMATTA_ID),
                vaparache_prakar: res?.data[0]?.VAPARACHE_PRAKAR,
                manoramaster_id: Number(res?.data[0]?.FLOOR_ID),
                areap: res?.data[0]?.AREAP,
                areai: res?.data[0]?.AREAI,
                totalarea: res?.data[0]?.TOTALAREA,
                areap1: res?.data[0]?.AREAP1,
                areai1: res?.data[0]?.AREAI1,
                totalarea1: res?.data[0]?.TOTALAREA1,
                lifespan: Number(res?.data[0]?.LIFESPAN),
                constructing: Number(res?.data[0]?.CONSTRUCTING),
                depreciation: res?.data[0]?.DEPRECIATION,
                weighted: res?.data[0]?.WEIGHTTAGE,
                annual_cost: res?.data[0]?.ANNUALCOST,
                levyrate: res?.data[0]?.LEVYRATE,
                one: res?.data[0]?.ONE,
                two: res?.data[0]?.TWO
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

  update_bandkam_form(){
    if (!this.BuildingkarModal.invalid) {
      let params = {
        milkat_vapar_id: this.BuildingkarModal.value.milkat_vapar_id,
        malmatta_id: this.BuildingkarModal.value.malmatta_id,
        vaparache_prakar: this.BuildingkarModal.value.vaparache_prakar,
        manoramaster_id: this.BuildingkarModal.value.manoramaster_id,
        areap: this.BuildingkarModal.value.areap,
        areai: this.BuildingkarModal.value.areai,
        totalarea: this.BuildingkarModal.value.totalarea,
        areap1: this.BuildingkarModal.value.areap1,
        areai1: this.BuildingkarModal.value.areai1,
        totalarea1: this.BuildingkarModal.value.totalarea1,
        lifespan: this.BuildingkarModal.value.lifespan,
        constructing: this.BuildingkarModal.value.constructing,
        depreciation: this.BuildingkarModal.value.depreciation,
        weighted: this.BuildingkarModal.value.weighted,
        annual_cost: this.BuildingkarModal.value.annual_cost,
        levyrate: this.BuildingkarModal.value.levyrate,
        one: this.BuildingkarModal.value.one,
        two: this.BuildingkarModal.value.two
      };
      if(this.orginal_edit == true) {
        this.NodaniService.updateBandkamKarModal_From_original_table(params, Number(this.data.construction_id)).subscribe({
            next: (res: any) => {
              console.log('Update Bandkam kar aakarni', res);
              if (res.status == 200) {
                console.log('inside', res);
                this.toastr.success(res.message, 'Success');
                this.recordSaved.emit();
              } else {
                this.toastr.warning(res.message, 'Warning');
              }
            },
            error: (err: Error) => {
              console.error('Error updating Bandkam kar aakarni form:', err);
              this.toastr.error('There was an error updating the Bandkam kar aakarni form.', 'Error');
            },
          });
      }else{
          this.NodaniService.updateBandkamKarModal(params, Number(this.data.construction_id)).subscribe({
            next: (res: any) => {
              console.log('Update Bandkam kar aakarni', res);
              if (res.status == 200) {
                console.log('inside', res);
                this.toastr.success(res.message, 'Success');
                this.recordSaved.emit();
              } else {
                this.toastr.warning(res.message, 'Warning');
              }
            },
            error: (err: Error) => {
              console.error('Error updating Bandkam kar aakarni form:', err);
              this.toastr.error('There was an error updating the Bandkam kar aakarni form.', 'Error');
            },
          });
      }
      
    } else {
      this.toastr.warning('Please fill all required fields.', 'warning');
    }
  }

}



       