import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LayoutModule } from '../../../components/layout/layout.module';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { AdharListService } from '../../../services/adhar-list.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-imla-kar-form-new',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './imla-kar-form-new.component.html',
  styleUrl: './imla-kar-form-new.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class ImlaKarFormNewComponent {
    yearToYear: boolean = false;
    wardOptions: { label: number; value: number }[] = [];
    yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];

    imlakarForm = new FormGroup({
      imlakar: new FormControl<string | null>('imlakar'), // Changed default value to 'default'
      ward_no: new FormControl<string | null>(null),
      year: new FormControl<string | null>(null),
      to: new FormControl<string | null>(null),
      to1: new FormControl<string | null>(null),
      from_year: new FormControl<string | null>(null),
      to_year: new FormControl<string | null>(null),
      start: new FormControl<number | null>(null),
      end: new FormControl<number | null>(null),
    });

    constructor(private adharListService: AdharListService,  private toastr: ToastrService, private router: Router,private customerService: CustomerService,) {
      // console.log('Received data in SillakjodaComponent:', this.data);
    }

    ngOnInit(): void {
        this.loadWardNumber();
        this.loadYearOptions();
        this.imlakarForm.get('year')?.valueChanges.subscribe((selectedYearId) => {
          if (selectedYearId !== null && selectedYearId !== undefined) {
            this.setNextYear(Number(selectedYearId));
          }
        });

        sessionStorage.removeItem('imlakarFormReport');
        sessionStorage.removeItem('imlakaranukramanikaFormReport');
        
    }

    loadWardNumber(): void {
      this.adharListService.getWardNumberList().subscribe({
        next: (res: any) => {
          // console.log('res', res);
          this.wardOptions = res?.data.ward_number_list;
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
          const currentYear = new Date().getFullYear();
          const currentYearObj = this.yearOptions.find((year) => Number(year.YEAR_NAME) === currentYear);
          const CYID = currentYearObj?.YEAR_ID ?? null;
          this.imlakarForm.get('year')?.setValue(CYID);
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
    showYwarToYear(event: MatSelectChange): void {
      const selectedValue = event.value;
      console.log('Selected Year ID:', selectedValue);
      if(selectedValue == "namuna8" || selectedValue == "namuna8i"){
        this.yearToYear = true;
      }else{
        this.yearToYear = false;
      }
    }
    
     setNextYear(selectedYearId: number): void {
      const selectedIndex = this.yearOptions.findIndex((year) => Number(year.YEAR_ID) === Number(selectedYearId));

      if (selectedIndex !== -1 && selectedIndex + 1 < this.yearOptions.length) {
        const nextYear = this.yearOptions[selectedIndex + 1];
        // const nextYear_2 = this.yearOptions[selectedIndex + 2];
        // const nextYear_3 = this.yearOptions[selectedIndex + 3];
        this.imlakarForm.get('to')?.setValue(nextYear.YEAR_ID); // No error now
        this.imlakarForm.get('to1')?.setValue(nextYear.YEAR_NAME); // No error now
        // this.imlakarForm.get('from_year')?.setValue(nextYear_2.YEAR_NAME);
        // this.imlakarForm.get('to_year')?.setValue(nextYear_3.YEAR_NAME);

      } else {
        this.imlakarForm.get('to')?.setValue(null); // Handle no next year gracefully
        this.imlakarForm.get('to1')?.setValue(null); // Handle no next year gracefully
        // this.imlakarForm.get('from_year')?.setValue(null);
        // this.imlakarForm.get('to_year')?.setValue(null);
      }
    }
    generate_report(){
      console.log('imlakarForm Value', this.imlakarForm.value);
      if(this.imlakarForm.value.imlakar == "imlakar"){
        sessionStorage.setItem('imlakarFormReport', btoa(JSON.stringify(this.imlakarForm.value)));
        this.router.navigate(['/imla-kar-list']);
      } 
      else if(this.imlakarForm.value.imlakar == "imlakarannukramanika") {
        sessionStorage.setItem('imlakaranukramanikaFormReport', btoa(JSON.stringify(this.imlakarForm.value)));
        this.router.navigate(['/imla-kar-anukramnika-list']);
      } 
      
      // else if(this.namuna8Form.value.namuna == "namuna8New") {
      //   sessionStorage.setItem('namuna81SingleWardForm', btoa(JSON.stringify(this.namuna8Form.value)));
      //   this.router.navigate(['/get-namuna-8-1-single-vard-list']);
      // }
    }
}
