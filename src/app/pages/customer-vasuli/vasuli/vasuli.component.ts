import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LayoutModule } from '../../../components/layout/layout.module';

import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api.service';
import { CustomerService } from '../../../services/customer.service';
import Util from '../../../utils/utils';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-vasuli',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './vasuli.component.html',
  styleUrl: './vasuli.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VasuliComponent {
  user_id: number | undefined;
  userDetails: any = [];
  yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];
  from_edit: number | undefined;
  currentYear = new Date().getFullYear();

    customerVasuliForm = new FormGroup({
      user_id: new FormControl<number | null>(null),
      newuser_id: new FormControl<number | null>(null),
      year_id: new FormControl<number | null>(null),
      year_id1: new FormControl<string | null>(null),
      year_id2: new FormControl<string | null>(null),
      anu_kramank: new FormControl<number | null>(null),
      malmatta_number: new FormControl<string | null>(null),
      vard_number: new FormControl<number | null>(null),
      plot_no: new FormControl<string | null>(null),
      khasara_kramank: new FormControl<string | null>(null),
      survey_kramank: new FormControl<string | null>(null),
      homeuser_name: new FormControl<string | null>(null),
      bhogatwar_name: new FormControl<string | null>(null),
      address: new FormControl<string | null>(null),
      ghruh_magil_kar: new FormControl<number | null>(null),
      ghruh_chalu_kar: new FormControl<number | null>(null),
      ghruh_jamma_rakkam: new FormControl<number | null>(null),
      ghruh_shillak_rakkam: new FormControl<number | null>(null),
      viz_magil_kar: new FormControl<number | null>(null),
      viz_chalu_kar: new FormControl<number | null>(null),
      viz_jamma_rakkam: new FormControl<number | null>(null),
      viz_shillak_rakkam: new FormControl<number | null>(null),
      aarogya_magil_kar: new FormControl<number | null>(null),
      aarogya_chalu_kar: new FormControl<number | null>(null),
      aarogya_jamma_rakkam: new FormControl<number | null>(null),
      aarogya_shillak_rakkam: new FormControl<number | null>(null),
      safai_magil_kar: new FormControl<number | null>(null),
      safai_chalu_kar: new FormControl<number | null>(null),
      safai_jamma_rakkam: new FormControl<number | null>(null),
      safai_shillak_rakkam: new FormControl<number | null>(null),
      ghruh_date: new FormControl<Date | null>(null),
      samanya_pani_magil_kar: new FormControl<number | null>(null),
      samanya_pani_chalu_kar: new FormControl<number | null>(null),
      samanya_pani_jamma_rakkam: new FormControl<number | null>(null),
      samanya_pani_shillak_rakkam: new FormControl<number | null>(null),
      vishesh_pani_magil_kar: new FormControl<number | null>(null),
      vishesh_pani_chalu_kar: new FormControl<number | null>(null),
      vishesh_pani_jamma_rakkam: new FormControl<number | null>(null),
      vishesh_pani_shillak_rakkam: new FormControl<number | null>(null),
      pavti_date: new FormControl<Date | null>(null),
      notice_magil_kar: new FormControl<number | null>(null),
      notice_chalu_kar: new FormControl<number | null>(null),
      notice_jamma_rakkam: new FormControl<number | null>(null),
      notice_shillak_rakkam: new FormControl<number | null>(null),
      etar_magil_kar: new FormControl<number | null>(null),
      etar_chalu_kar: new FormControl<number | null>(null),
      etar_jamma_rakkam: new FormControl<number | null>(null),
      etar_shillak_rakkam: new FormControl<number | null>(null),
      ekun_magil_kar: new FormControl<number | null>(null),
      ekun_chalu_kar: new FormControl<number | null>(null),
      ekun_jamma_rakkam: new FormControl<number | null>(null),
      ekun_shillak_rakkam: new FormControl<number | null>(null),
      RNO: new FormControl<number | null>(null),
    });
    dailyKarVasuliYadi = [
            { label: 'खातेधारकाचे नाव', name: 'homeuser_name' },
            { label: 'भोगवटदाराचे नाव', name: 'bhogatwar_name' },
            { label: 'पत्ता', name: 'address' },
            ]
  karDetails = [
                { label: 'गृहकर व भूमीकर', col1:'ghruh_magil_kar', col2:'ghruh_chalu_kar', col3:'ghruh_jamma_rakkam', col4:'ghruh_shillak_rakkam'},
                { label: 'वीज दिवाबत्ती कर', col1:'viz_magil_kar', col2:'viz_chalu_kar', col3:'viz_jamma_rakkam', col4:'viz_shillak_rakkam'},
                { label: 'आरोग्य रक्षण कर', col1:'aarogya_magil_kar', col2:'aarogya_chalu_kar', col3:'aarogya_jamma_rakkam', col4:'aarogya_shillak_rakkam'},
                { label: 'सफाई कर', col1:'safai_magil_kar', col2:'safai_chalu_kar', col3:'safai_jamma_rakkam', col4:'safai_shillak_rakkam'},
                { label: 'गृहकर व भूमीकर पावती क्रमांक व दिनांक', col1:'date', col2:'ghruh_date'},
                { label: 'सामान्य पाणी कर', col1:'samanya_pani_magil_kar', col2:'samanya_pani_chalu_kar', col3:'samanya_pani_jamma_rakkam', col4:'samanya_pani_shillak_rakkam'},
                { label: 'विशेष पाणी कर', col1:'vishesh_pani_magil_kar', col2:'vishesh_pani_chalu_kar', col3:'vishesh_pani_jamma_rakkam', col4:'vishesh_pani_shillak_rakkam'},
                { label: 'पाणी कर पावती क्रमांक व दिनांक', col1:'date', col2:'pavti_date'},
                { label: 'नोटीस फी', col1:'notice_magil_kar', col2:'notice_chalu_kar', col3:'notice_jamma_rakkam', col4:'notice_shillak_rakkam'},
                { label: 'इतर फी', col1:'etar_magil_kar', col2:'etar_chalu_kar', col3:'etar_jamma_rakkam', col4:'etar_shillak_rakkam'},
                { label: 'एकूण', col1:'ekun_magil_kar', col2:'ekun_chalu_kar', col3:'ekun_jamma_rakkam', col4:'ekun_shillak_rakkam'},
                ];
   constructor(
    private util: Util,
    private apiService: ApiService,
    private toastr: ToastrService,
    private customerService: CustomerService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

   ngOnInit() {
    this.userDetails = this.apiService.getDecodedToken();
    console.log('userDetails', this.userDetails);
    this.customerVasuliForm.patchValue({
      user_id: this.userDetails.userId,
    });
    this.user_id = this.userDetails.userId;
    // this.fetchData();
    this.loadYearOptions();
    this.customerVasuliForm.get('year_id')?.valueChanges.subscribe((selectedYearId) => {
      if (selectedYearId !== null && selectedYearId !== undefined) {
        this.setNextYear(Number(selectedYearId));
      }
    });

    this.route.queryParams.subscribe(params => {
      this.from_edit = Number(params['id']);
      console.log('Query ID:', this.from_edit);
      this.editVasuliUser(this.from_edit);
      
    });
  }

  loadYearOptions(): void {
    this.customerService.getDropdownYearsList().subscribe({
      next: (res: any) => {
        console.log('res', res);
         this.yearOptions = res?.data;
        //  console.log('yearOptions', this.yearOptions);
        const currentYear = new Date().getFullYear();
          const currentYearObj = this.yearOptions.find((year) => Number(year.YEAR_NAME) === currentYear);
          const CYID = currentYearObj?.YEAR_ID ?? null;
          this.customerVasuliForm.get('year_id')?.setValue(Number(CYID));
        
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
      this.customerVasuliForm.get('year_id1')?.setValue(nextYear.YEAR_ID); // No error now
      this.customerVasuliForm.get('year_id2')?.setValue(nextYear.YEAR_NAME); // No error now
    } else {
      this.customerVasuliForm.get('year_id1')?.setValue(null); // Handle no next year gracefully
      this.customerVasuliForm.get('year_id2')?.setValue(null); // Handle no next year gracefully
    }
  }
  formatDate(date: any): string {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
          throw new Error('Invalid date');
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }

    SaveCustomerVasuli() {
      const formValue = this.customerVasuliForm.value;
      
      let params = {
        user_id: this.userDetails.userId,
        newuser_id: formValue.newuser_id,
        year_id: formValue.year_id,
        year_id1: formValue.year_id1,
        anu_kramank: formValue.anu_kramank,
        malmatta_number: formValue.malmatta_number,
        vard_number: formValue.vard_number,
        plot_no: formValue.plot_no,
        khasara_kramank: formValue.khasara_kramank,
        survey_kramank: formValue.survey_kramank,
        homeuser_name: formValue.homeuser_name,
        bhogatwar_name: formValue.bhogatwar_name,
        address: formValue.address,
        ghruh_magil_kar: formValue.ghruh_magil_kar,
        ghruh_chalu_kar: formValue.ghruh_chalu_kar,
        ghruh_jamma_rakkam: formValue.ghruh_jamma_rakkam,
        ghruh_shillak_rakkam: formValue.ghruh_shillak_rakkam,
        viz_magil_kar: formValue.viz_magil_kar,
        viz_chalu_kar: formValue.viz_chalu_kar,
        viz_jamma_rakkam: formValue.viz_jamma_rakkam,
        viz_shillak_rakkam: formValue.viz_shillak_rakkam,
        aarogya_magil_kar: formValue.aarogya_magil_kar,
        aarogya_chalu_kar: formValue.aarogya_chalu_kar,
        aarogya_jamma_rakkam: formValue.aarogya_jamma_rakkam,
        aarogya_shillak_rakkam: formValue.aarogya_shillak_rakkam,
        safai_magil_kar: formValue.safai_magil_kar,
        safai_chalu_kar: formValue.safai_chalu_kar,
        safai_jamma_rakkam: formValue.safai_jamma_rakkam,
        safai_shillak_rakkam: formValue.safai_shillak_rakkam,
        ghruh_date: formValue.ghruh_date,
        samanya_pani_magil_kar: formValue.samanya_pani_magil_kar,
        samanya_pani_chalu_kar: formValue.samanya_pani_chalu_kar,
        samanya_pani_jamma_rakkam: formValue.samanya_pani_jamma_rakkam,
        samanya_pani_shillak_rakkam: formValue.samanya_pani_shillak_rakkam,
        vishesh_pani_magil_kar: formValue.vishesh_pani_magil_kar,
        vishesh_pani_chalu_kar: formValue.vishesh_pani_chalu_kar,
        vishesh_pani_jamma_rakkam: formValue.vishesh_pani_jamma_rakkam,
        vishesh_pani_shillak_rakkam: formValue.vishesh_pani_shillak_rakkam,
        pavti_date: formValue.pavti_date,
        notice_magil_kar: formValue.notice_magil_kar,
        notice_chalu_kar: formValue.notice_chalu_kar,
        notice_jamma_rakkam: formValue.notice_jamma_rakkam,
        notice_shillak_rakkam: formValue.notice_shillak_rakkam,
        etar_magil_kar: formValue.etar_magil_kar,
        etar_chalu_kar: formValue.etar_chalu_kar,
        etar_jamma_rakkam: formValue.etar_jamma_rakkam,
        etar_shillak_rakkam: formValue.etar_shillak_rakkam,
        ekun_magil_kar: formValue.ekun_magil_kar,
        ekun_chalu_kar: formValue.ekun_chalu_kar,
        ekun_jamma_rakkam: formValue.ekun_jamma_rakkam,
        ekun_shillak_rakkam: formValue.ekun_shillak_rakkam,
      };
      console.log(formValue);
      this.customerService.addCustomerVasuli(params).subscribe({
        next: (res: any) => {
          console.log('res', res);
          if (res?.status === 201) { 
            this.toastr.success(res.message, 'Success');
            this.router.navigate(['/customer-vasuli']);
          } else {
            this.toastr.error(res?.message || 'Failed to add Customer Vasuli', 'Error');
          }
        },
        error: (err: Error) => {
          console.error('Error adding Customer Vasuli:', err);
          this.toastr.error('There was an error adding the Customer Vasuli.', 'Error');
        },
      });
    }
  
    editVasuliUser(id: number) {
      this.customerService.getVasuliByid(id).subscribe({
        next: (res: any) => {
          console.log('res', res);
          if (res?.status === 200) {
            const data = res?.data;
            const formattedDate = new Date(
                `${data[0].PAVTI_DATE_PANI_KRAMANK.split('-')[2]}-${data[0].PAVTI_DATE_PANI_KRAMANK.split('-')[1]}-${data[0].PAVTI_DATE_PANI_KRAMANK.split('-')[0]}`
              );
            const formattedGruhDate = new Date(
                `${data[0].GHRUH_BHUMIKAR_DATE.split('-')[2]}-${data[0].GHRUH_BHUMIKAR_DATE.split('-')[1]}-${data[0].GHRUH_BHUMIKAR_DATE.split('-')[0]}`
              );
            this.customerVasuliForm.patchValue({
              newuser_id: data[0].NEWUSER_ID,
              year_id: Number(data[0].YEAR_ID),
              year_id1: data[0].YEAR_ID1,
              anu_kramank: data[0].ANNU_KRAMANK,
              malmatta_number: data[0].MALMATTA_NUMBER,
              vard_number: data[0].VARD_NUMBER,
              plot_no: data[0].PLOT_NO,
              khasara_kramank: data[0].KHASARA_KRAMANK,
              survey_kramank: data[0].SURVEY_KRAMANK,
              homeuser_name: data[0].HOMEUSER_NAME,
              bhogatwar_name: data[0].BHOGATWARGARACHE_NAME,
              address: data[0].ADDRESS,
              ghruh_magil_kar: data[0].GHRUH_BHUMIKAR_MAGIL_KAR,
              ghruh_chalu_kar: data[0].GHRUH_BHUMIKAR_CHALU_KAR,
              ghruh_jamma_rakkam: data[0].GHRUH_BHUMIKAR_JAMMA_KELELI_RAKKAM,
              ghruh_shillak_rakkam: data[0].GHRUH_BHUMIKAR_SHILLAK_RAKKAM,
              viz_magil_kar: data[0].VIZ_DIVABATTI_MAGIL_KAR,
              viz_chalu_kar: data[0].VIZ_DIVABATTI_CHALU_KAR,
              viz_jamma_rakkam: data[0].VIZ_DIVABATTI_JAMMA_KELELI_RAKKAM,
              viz_shillak_rakkam: data[0].VIZ_DIVABATTI_SHILLAK_RAKKAM,
              aarogya_magil_kar: data[0].AAROGYA_RAKSHAN_MAGIL_KAR,
              aarogya_chalu_kar: data[0].AAROGYA_RAKSHAN_CHALU_KAR,
              aarogya_jamma_rakkam: data[0].AAROGYA_RAKSHAN_JAMMA_KELELI_RAKKAM,
              aarogya_shillak_rakkam: data[0].AAROGYA_RAKSHAN_SHILLAK_RAKKAM,
              safai_magil_kar: data[0].SAFAI_MAGIL_KAR,
              safai_chalu_kar: data[0].SAFAI_CHALU_KAR,
              safai_jamma_rakkam: data[0].SAFAI_JAMMA_KELELI_RAKKAM,
              safai_shillak_rakkam: data[0].SAFAI_SHILLAK_RAKKAM,
              ghruh_date:formattedGruhDate,
              samanya_pani_magil_kar: data[0].SAMNAYA_PANI_MAGIL_KAR,
              samanya_pani_chalu_kar: data[0].SAMNAYA_PANI_CHALU_KAR,
              samanya_pani_jamma_rakkam: data[0].SAMNAYA_PANI_JAMMA_KELELI_RAKKAM,
              samanya_pani_shillak_rakkam: data[0].SAMNAYA_PANI_SHILLAK_RAKKAM,
              vishesh_pani_magil_kar: data[0].VISHESH_PANI_MAGIL_KAR,
              vishesh_pani_chalu_kar: data[0].VISHESH_PANI_CHALU_KAR,
              vishesh_pani_jamma_rakkam: data[0].VISHESH_PANI_JAMMA_KELELI_RAKKAM,
              vishesh_pani_shillak_rakkam: data[0].VISHESH_PANI_SHILLAK_RAKKAM,
              pavti_date: formattedDate,
              notice_magil_kar: data[0].NOTICE_FEE_MAGIL_KAR,
              notice_chalu_kar: data[0].NOTICE_FEE_CHALU_KAR,
              notice_jamma_rakkam: data[0].NOTICE_FEE_JAMMA_KELELI_RAKKAM,
              notice_shillak_rakkam: data[0].NOTICE_FEE_SHILLAK_RAKKAM,
              etar_magil_kar: data[0].ETAR_FEE_MAGIL_KAR,
              etar_chalu_kar: data[0].ETAR_FEE_CHALU_KAR,
              etar_jamma_rakkam: data[0].ETAR_FEE_JAMMA_KELELI_RAKKAM,
              etar_shillak_rakkam: data[0].ETAR_FEE_SHILLAK_RAKKAM,
              ekun_magil_kar: data[0].EKUN_MAGIL_KAR,
              ekun_chalu_kar: data[0].EKUN_CHALU_KAR,
              ekun_jamma_rakkam: data[0].EKUN_JAMMA_KELELI_RAKKAM,
              ekun_shillak_rakkam: Number(data[0].EKUN_SHILLAK_RAKKAM)
            });

            this.customerVasuliForm.get('year_id')?.valueChanges.subscribe((selectedYearId) => {
              if (selectedYearId !== null && selectedYearId !== undefined) {
                this.setNextYear(Number(selectedYearId));
              }
            });
          }
        },
      })
    }
   updateCol4(element:any){
      const col1Value = this.customerVasuliForm.get(element.col1)?.value || 0;
      const col2Value = this.customerVasuliForm.get(element.col2)?.value || 0;
      const col3Value = this.customerVasuliForm.get(element.col3)?.value || 0;
      const total = (Number(col1Value) + Number(col2Value)) - Number(col3Value);
      this.customerVasuliForm.get(element.col4)?.setValue(total);
    this.calculateSums();
   }

   updateCustomerVasuli(){
    const formValue = this.customerVasuliForm.value;
      let params = {
        user_id: this.userDetails.userId,
        newuser_id: formValue.newuser_id,
        year_id: formValue.year_id,
        year_id1: formValue.year_id1,
        anu_kramank: formValue.anu_kramank,
        malmatta_number: formValue.malmatta_number,
        vard_number: formValue.vard_number,
        plot_no: formValue.plot_no,
        khasara_kramank: formValue.khasara_kramank,
        survey_kramank: formValue.survey_kramank,
        homeuser_name: formValue.homeuser_name,
        bhogatwar_name: formValue.bhogatwar_name,
        address: formValue.address,
        ghruh_magil_kar: formValue.ghruh_magil_kar,
        ghruh_chalu_kar: formValue.ghruh_chalu_kar,
        ghruh_jamma_rakkam: formValue.ghruh_jamma_rakkam,
        ghruh_shillak_rakkam: formValue.ghruh_shillak_rakkam,
        viz_magil_kar: formValue.viz_magil_kar,
        viz_chalu_kar: formValue.viz_chalu_kar,
        viz_jamma_rakkam: formValue.viz_jamma_rakkam,
        viz_shillak_rakkam: formValue.viz_shillak_rakkam,
        aarogya_magil_kar: formValue.aarogya_magil_kar,
        aarogya_chalu_kar: formValue.aarogya_chalu_kar,
        aarogya_jamma_rakkam: formValue.aarogya_jamma_rakkam,
        aarogya_shillak_rakkam: formValue.aarogya_shillak_rakkam,
        safai_magil_kar: formValue.safai_magil_kar,
        safai_chalu_kar: formValue.safai_chalu_kar,
        safai_jamma_rakkam: formValue.safai_jamma_rakkam,
        safai_shillak_rakkam: formValue.safai_shillak_rakkam,
        ghruh_date: formValue.ghruh_date,
        samanya_pani_magil_kar: formValue.samanya_pani_magil_kar,
        samanya_pani_chalu_kar: formValue.samanya_pani_chalu_kar,
        samanya_pani_jamma_rakkam: formValue.samanya_pani_jamma_rakkam,
        samanya_pani_shillak_rakkam: formValue.samanya_pani_shillak_rakkam,
        vishesh_pani_magil_kar: formValue.vishesh_pani_magil_kar,
        vishesh_pani_chalu_kar: formValue.vishesh_pani_chalu_kar,
        vishesh_pani_jamma_rakkam: formValue.vishesh_pani_jamma_rakkam,
        vishesh_pani_shillak_rakkam: formValue.vishesh_pani_shillak_rakkam,
        pavti_date: formValue.pavti_date ,
        notice_magil_kar: formValue.notice_magil_kar,
        notice_chalu_kar: formValue.notice_chalu_kar,
        notice_jamma_rakkam: formValue.notice_jamma_rakkam,
        notice_shillak_rakkam: formValue.notice_shillak_rakkam,
        etar_magil_kar: formValue.etar_magil_kar,
        etar_chalu_kar: formValue.etar_chalu_kar,
        etar_jamma_rakkam: formValue.etar_jamma_rakkam,
        etar_shillak_rakkam: formValue.etar_shillak_rakkam,
        ekun_magil_kar: formValue.ekun_magil_kar,
        ekun_chalu_kar: formValue.ekun_chalu_kar,
        ekun_jamma_rakkam: formValue.ekun_jamma_rakkam,
        ekun_shillak_rakkam: formValue.ekun_shillak_rakkam,
      };

      this.customerService.updateCustomerVasuli(params, this.from_edit).subscribe({
        next: (res: any) => {
          console.log('res', res);
          if (res?.status === 200) { 
            this.toastr.success(res.message, 'Success');
            this.router.navigate(['/customer-vasuli']);
          } else {
            this.toastr.error(res?.message || 'Failed to update Customer Vasuli', 'Error');
          }
        },
        error: (err: Error) => {
          console.error('Error updating Customer Vasuli:', err);
          this.toastr.error('There was an error updating the Customer Vasuli.', 'Error');
        },
      });
   }

  calculateSums() {
    const sums = {
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0
    };

    for (const detail of this.karDetails) {
      if (detail.col1 !== 'date' && detail.label !== 'एकूण') {
        sums.col1 += Number(this.customerVasuliForm.get(detail.col1 || '')?.value || 0);
        sums.col2 += Number(this.customerVasuliForm.get(detail.col2 || '')?.value || 0);
        sums.col3 += Number(this.customerVasuliForm.get(detail.col3 || '')?.value || 0);
        sums.col4 += Number(this.customerVasuliForm.get(detail.col4 || '')?.value || 0);
      }
    }

    // Update the last record for 'एकूण'
    const totalDetail = this.karDetails.find(detail => detail.label === 'एकूण');
    if (totalDetail) {
      this.customerVasuliForm.get(totalDetail.col1 || '')?.setValue(sums.col1);
      this.customerVasuliForm.get(totalDetail.col2 || '')?.setValue(sums.col2);
      this.customerVasuliForm.get(totalDetail.col3 || '')?.setValue(sums.col3);
      this.customerVasuliForm.get(totalDetail.col4 || '')?.setValue(sums.col4);
    }
  }
  fetCustomerData(){
      
          const params = {
            ward_no: this.customerVasuliForm.value.vard_number,
            annu_no: this.customerVasuliForm.value.anu_kramank,
            user_id: this.userDetails.userId,
          }
          this.customerService.fetchDataAnuNo_wardNo(params).subscribe({
            next: (res: any) => {
              if (res?.status === 200) {
                const data = res?.data;
                // console.log('res------------>>>>>', data);
                    this.customerVasuliForm.patchValue({
                      newuser_id: data[0].NEWUSER_ID,
                      anu_kramank: data[0].ANNU_KRAMANK,
                      malmatta_number: data[0].MALMATTA_NUMBER,
                      vard_number: data[0].VARD_NUMBER,
                      plot_no: data[0].PLOT_NO,
                      khasara_kramank: data[0].KHASARA_KRAMANK,
                      survey_kramank: data[0].SURVEY_KRAMANK,
                      homeuser_name: data[0].HOMEUSER_NAME,
                      bhogatwar_name: data[0].BHOGATWARGARACHE_NAME,
                      address: data[0].ADDRESS_NAGAR_SOCIETY,
                      year_id: Number(data[0].YEARS_ID)-1,
                      RNO: data[0].RNO
                    });
                    this.customerVasuliForm.get('year_id')?.valueChanges.pipe(
                      debounceTime(1000) // Add debounce time here
                    ).subscribe((selectedYearId) => {
                      if (selectedYearId !== null && selectedYearId !== undefined) {
                        this.setNextYear(Number(selectedYearId));
                      }
                    });
                    this.callMaginKarAPI();
                    this.callChaluKarAPI();
               
               
              }
            },
          })
      }

    callMaginKarAPI(){
      const params = {
          rno: this.customerVasuliForm.value.RNO,
          vard_no: this.customerVasuliForm.value.vard_number,
          new_user_id: this.customerVasuliForm.value.newuser_id,
          year_id: this.customerVasuliForm.value.year_id,
          user_id: this.userDetails.userId,
        }
        this.customerService.fetchMagilKarData(params).subscribe({
          next: (res: any) => {
            if (res?.status === 200) {
              const data = res?.data;
              for (const detail of this.karDetails) {
                
                if (detail.label === 'गृहकर व भूमीकर') {
                  this.customerVasuliForm.get(detail.col1)?.setValue(data[0].BHUMI_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'वीज दिवाबत्ती कर') {
                  this.customerVasuliForm.get(detail.col1)?.setValue(data[0].DIVA_BATTI_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'आरोग्य रक्षण कर') {
                  this.customerVasuliForm.get(detail.col1)?.setValue(data[0].AAROGYA_RAKSHAN_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'सफाई कर') {
                  this.customerVasuliForm.get(detail.col1)?.setValue(data[0].SAFAI_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'सामान्य पाणी कर') {
                  this.customerVasuliForm.get(detail.col1)?.setValue(data[0].SAMANYA_PANI_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'विशेष पाणी कर') {
                  this.customerVasuliForm.get(detail.col1)?.setValue(data[0].VISHESH_PANI_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'नोटीस फी') {
                  this.customerVasuliForm.get(detail.col1)?.setValue(data[0].NOTICE_FEES);
                  this.updateCol4(detail);
                }
                if (detail.label === 'इतर फी') {
                  this.customerVasuliForm.get(detail.col1)?.setValue(data[0].ETAR_FEES);
                  this.updateCol4(detail);
                }
                if (detail.label === 'एकूण') {
                  this.customerVasuliForm.get(detail.col1)?.setValue(data[0].TOTAL);
                  this.updateCol4(detail);
                }
              }
            }
          },
        })
    }
    callChaluKarAPI(){
      const params = {
          rno: this.customerVasuliForm.value.RNO,
          vard_no: this.customerVasuliForm.value.vard_number,
          new_user_id: this.customerVasuliForm.value.newuser_id,
          year_id: this.customerVasuliForm.value.year_id,
          user_id: this.userDetails.userId,
        }
        this.customerService.fetchChaluKarData(params).subscribe({
          next: (res: any) => {
            if (res?.status === 200) {
              const data = res?.data;
              for (const detail of this.karDetails) {
                
                if (detail.label === 'गृहकर व भूमीकर') {
                  this.customerVasuliForm.get(detail.col2)?.setValue(data[0].BHUMI_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'वीज दिवाबत्ती कर') {
                  this.customerVasuliForm.get(detail.col2)?.setValue(data[0].DIVA_BATTI_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'आरोग्य रक्षण कर') {
                  this.customerVasuliForm.get(detail.col2)?.setValue(data[0].AAROGYA_RAKSHAN_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'सफाई कर') {
                  this.customerVasuliForm.get(detail.col2)?.setValue(data[0].SAFAI_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'सामान्य पाणी कर') {
                  this.customerVasuliForm.get(detail.col2)?.setValue(data[0].SAMANYA_PANI_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'विशेष पाणी कर') {
                  this.customerVasuliForm.get(detail.col2)?.setValue(data[0].VISHESH_PANI_KAR);
                  this.updateCol4(detail);
                }
                if (detail.label === 'नोटीस फी') {
                  this.customerVasuliForm.get(detail.col2)?.setValue(data[0].NOTICE_FEES);
                  this.updateCol4(detail);
                }
                if (detail.label === 'इतर फी') {
                  this.customerVasuliForm.get(detail.col2)?.setValue(data[0].ETAR_FEES);
                  this.updateCol4(detail);
                }
                if (detail.label === 'एकूण') {
                  this.customerVasuliForm.get(detail.col2)?.setValue(data[0].TOTAL);
                  this.updateCol4(detail);
                }
              }
            }
          },
        })
    }
}
