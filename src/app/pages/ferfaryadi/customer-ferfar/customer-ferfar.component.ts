import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LayoutModule } from '../../../components/layout/layout.module';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { AdharListService } from '../../../services/adhar-list.service';
import { ApiService } from '../../../services/api.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customer-ferfar',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink, DateFormatDirective],
  templateUrl: './customer-ferfar.component.html',
  styleUrl: './customer-ferfar.component.css',
   providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class CustomerFerfarComponent {
from_edit: number | undefined;
ferfarNanunaYadiDDL: { FERFARNAMUNAYADI_ID: number; FERFARNAMUNAYADI_NAME: string }[] = [];
grampanchayatDDL: { PANCHAYAT_ID: number; PANCHAYAT_NAME: string }[] = [];
yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];
userDetails: any = [];

addCustomerFerfar = new FormGroup({
  ferfar_namuna_yadi: new FormControl<Number | null>(null),
  gram_panchayat: new FormControl<Number | null>(null),
  from_year: new FormControl<Number | null>(null),
  to_year: new FormControl<string | null>(null),
  to_year1: new FormControl<string | null>(null),
  newuser_id: new FormControl<string | null>(null),
  anu_kramak: new FormControl<number | null>(null),
  malmatta_number: new FormControl<number | null>(null),
  vard_number: new FormControl<number | null>(null),
  plot_number: new FormControl<string | null>(null),
  khasara_number: new FormControl<number | null>(null),
  survey_number: new FormControl<number | null>(null),
  masik_sabha_no: new FormControl<string | null>(null),
  tharav_no: new FormControl<string | null>(null),
  date: new FormControl<Date | null>(null), // or FormControl<Date | null>
  home_user_name_lihun_denar: new FormControl<string | null>(null),
  nav_lihun_ghenara: new FormControl<string | null>(null),
  sachiv: new FormControl<string | null>(null),
  sarpanch: new FormControl<string | null>(null),
  up_sarpanch: new FormControl<string | null>(null),
  shera_or_tip: new FormControl<string | null>(null),
});


constructor(private adharListService: AdharListService,  private toastr: ToastrService, private router: Router,private customerService: CustomerService,private route: ActivatedRoute,private apiService: ApiService,) {
    // console.log('Received data in SillakjodaComponent:', this.data);
  }
ngOnInit(): void {
      this.userDetails = this.apiService.getDecodedToken();
      this.loadFerfarNamunaYadiDDL();
      this.loadGrampanchayatDDL();
      this.loadYearOptions();
      this.addCustomerFerfar.get('from_year')?.valueChanges.subscribe((selectedYearId) => {
        if (selectedYearId !== null && selectedYearId !== undefined) {
          this.setNextYear(Number(selectedYearId));
        }
      });
      // console.log("totalItems", this.totalItems);

    this.route.queryParams.subscribe(params => {
      this.from_edit = Number(params['id']);
      // console.log('Query ID:', this.from_edit);
      this.editFerfarUser(this.from_edit);
      
    });
  }

  loadFerfarNamunaYadiDDL(): void {
    this.customerService.getFerfarNamunaYadiDDL().subscribe({
      next: (res: any) => {
        // console.log('res', res?.data);
         this.ferfarNanunaYadiDDL = res?.data || [];
      },
      error: (err: Error) => {
        console.error('Error getting drop down:', err);
        this.toastr.error(
          'There was an error getting the ward list dropdown.',
          'Error'
        );
      },
    });
  }
  loadGrampanchayatDDL(): void {
    this.customerService.getGrampanchaytDDL().subscribe({
      next: (res: any) => {
        // console.log('res', res?.data);
         this.grampanchayatDDL = res?.data || [];
      },
      error: (err: Error) => {
        console.error('Error getting drop down:', err);
        this.toastr.error(
          'There was an error getting the ward list dropdown.',
          'Error'
        );
      },
    });
  }
  loadYearOptions(): void {
    this.customerService.getDropdownYearsList().subscribe({
      next: (res: any) => {
        // console.log('res', res);
         this.yearOptions = res?.data;
        //  console.log('yearOptions', this.yearOptions);
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
      this.addCustomerFerfar.get('to_year')?.setValue(nextYear.YEAR_ID); // No error now
      this.addCustomerFerfar.get('to_year1')?.setValue(nextYear.YEAR_NAME); // No error now
    } else {
      this.addCustomerFerfar.get('to_year')?.setValue(null); // Handle no next year gracefully
      this.addCustomerFerfar.get('to_year1')?.setValue(null); // Handle no next year gracefully
    }
  }
  SaveFerfarYadi(){

    const params = {
      ferfar_namuna_yadi: this.addCustomerFerfar.value.ferfar_namuna_yadi,
      gram_panchayat: this.addCustomerFerfar.value.gram_panchayat,
      from_year: this.addCustomerFerfar.value.from_year,
      to_year: this.addCustomerFerfar.value.to_year,
      newuser_id: this.addCustomerFerfar.value.newuser_id,
      anu_kramak: this.addCustomerFerfar.value.anu_kramak,
      malmatta_number: this.addCustomerFerfar.value.malmatta_number,
      vard_number: this.addCustomerFerfar.value.vard_number,
      plot_number: this.addCustomerFerfar.value.plot_number,
      khasara_number: this.addCustomerFerfar.value.khasara_number,
      survey_number: this.addCustomerFerfar.value.survey_number,
      masik_sabha_no: this.addCustomerFerfar.value.masik_sabha_no,
      tharav_no: this.addCustomerFerfar.value.tharav_no,
      date: this.addCustomerFerfar.value.date, // or FormControl<Date | null>
      home_user_name_lihun_denar: this.addCustomerFerfar.value.home_user_name_lihun_denar,
      nav_lihun_ghenara: this.addCustomerFerfar.value.nav_lihun_ghenara,
      sachiv: this.addCustomerFerfar.value.sachiv,
      sarpanch: this.addCustomerFerfar.value.sarpanch,
      up_sarpanch: this.addCustomerFerfar.value.up_sarpanch,
      shera_or_tip: this.addCustomerFerfar.value.shera_or_tip
    }
    console.log(this.addCustomerFerfar.value);
      this.customerService.addFerfarYadi(params).subscribe({
        next: (res: any) => {
          // console.log('res', res);
          if (res?.status === 201) { 
            this.toastr.success(res.message, 'Success');
            this.router.navigate(['/ferfar-yadi']);
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
  updateFerfarYadi(){
    const params = {
      ferfar_namuna_yadi: this.addCustomerFerfar.value.ferfar_namuna_yadi,
      gram_panchayat: this.addCustomerFerfar.value.gram_panchayat,
      from_year: this.addCustomerFerfar.value.from_year,
      to_year: this.addCustomerFerfar.value.to_year,
      newuser_id: this.addCustomerFerfar.value.newuser_id,
      anu_kramak: this.addCustomerFerfar.value.anu_kramak,
      malmatta_number: this.addCustomerFerfar.value.malmatta_number,
      vard_number: this.addCustomerFerfar.value.vard_number,
      plot_number: this.addCustomerFerfar.value.plot_number,
      khasara_number: this.addCustomerFerfar.value.khasara_number,
      survey_number: this.addCustomerFerfar.value.survey_number,
      masik_sabha_no: this.addCustomerFerfar.value.masik_sabha_no,
      tharav_no: this.addCustomerFerfar.value.tharav_no,
      date: this.addCustomerFerfar.value.date, // or FormControl<Date | null>
      home_user_name_lihun_denar: this.addCustomerFerfar.value.home_user_name_lihun_denar,
      nav_lihun_ghenara: this.addCustomerFerfar.value.nav_lihun_ghenara,
      sachiv: this.addCustomerFerfar.value.sachiv,
      sarpanch: this.addCustomerFerfar.value.sarpanch,
      up_sarpanch: this.addCustomerFerfar.value.up_sarpanch,
      shera_or_tip: this.addCustomerFerfar.value.shera_or_tip
    }
    this.customerService.updateFerfar(params, this.from_edit).subscribe({
        next: (res: any) => {
          console.log('res', res);
          if (res?.status === 200) { 
            this.toastr.success(res.message, 'Success');
            this.router.navigate(['/ferfar-yadi']);
          } else {
            this.toastr.error(res?.message || 'Failed to update Customer Ferfar', 'Error');
          }
        },
        error: (err: Error) => {
          console.error('Error updating Customer Ferafr:', err);
          this.toastr.error('There was an error updating the Customer Ferafr.', 'Error');
        },
      });
  }
  editFerfarUser(id: number) {
      this.customerService.getFerfarByid(id).subscribe({
        next: (res: any) => {
          // console.log('res------------', res);
          if (res?.status === 200) {
            const data = res?.data;
            // console.log('data----------', data);
            const formattedDate = new Date(
                `${data[0].DATE.split('/')[2]}-${data[0].DATE.split('/')[1]}-${data[0].DATE.split('/')[0]}`
              );
            this.addCustomerFerfar.patchValue({
              ferfar_namuna_yadi: Number(data[0].FERFARNAMUNAYADI_ID),
              gram_panchayat: Number(data[0].PANCHAYAT_ID),
              from_year: Number(data[0].YEAR_ID),
              to_year: data[0].YEAR_ID1,
              newuser_id: data[0].NEWUSER_ID,
              anu_kramak: data[0].ANNU_KRAMANK,
              malmatta_number: data[0].MALMATTA_NUMBER,
              vard_number: data[0].VARD_NUMBER,
              plot_number: data[0].PLOT_NO,
              khasara_number: data[0].KHASARA_KRAMANK,
              survey_number: data[0].SURVEY_KRAMANK,
              masik_sabha_no: data[0].MASIKSABHA,
              tharav_no: data[0].THARAV,
              date: formattedDate, // or FormControl<Date | null>
              home_user_name_lihun_denar: data[0].JUNEKHATEDAR_NAME,
              nav_lihun_ghenara: data[0].NAVINKHATEDAR_NAME,
              sachiv: data[0].SACHIV,
              sarpanch: data[0].SARPANCH,
              up_sarpanch: data[0].UPSARPANCH,
              shera_or_tip: data[0].TIP
            });

            this.addCustomerFerfar.get('from_year')?.valueChanges.subscribe((selectedYearId) => {
              if (selectedYearId !== null && selectedYearId !== undefined) {
                this.setNextYear(Number(selectedYearId));
              }
            });
          }
        },
      })
    }

    fetCustomerData(){
      if(this.addCustomerFerfar.value.anu_kramak !== null && this.addCustomerFerfar.value.anu_kramak !== undefined) {
        const params = {
          ward_no: this.addCustomerFerfar.value.vard_number,
          annu_no: this.addCustomerFerfar.value.anu_kramak,
          user_id: this.userDetails.userId,
        }
        this.customerService.fetchDataAnuNo_wardNo(params).subscribe({
          next: (res: any) => {
            if (res?.status === 200) {
              const data = res?.data;
              
              this.addCustomerFerfar.patchValue({
                newuser_id: data[0].NEWUSER_ID,
                anu_kramak: data[0].ANNU_KRAMANK,
                malmatta_number: data[0].MALMATTA_NUMBER,
                vard_number: data[0].VARD_NUMBER,
                plot_number: data[0].PLOT_NO,
                khasara_number: data[0].KHASARA_KRAMANK,
                survey_number: data[0].SURVEY_KRAMANK,
                home_user_name_lihun_denar: data[0].HOMEUSER_NAME
              });
            }
          },
        })
      }else {
        this.toastr.error('Please select Anu kramank first', 'Error');
        this.addCustomerFerfar.patchValue({
          vard_number: null,
        });
      }
    }
}
