import { Component, ViewChild } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { CommonModule } from '@angular/common';
import { AdharListService } from '../../../services/adhar-list.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-magniche-bill-ward',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './magniche-bill-ward.component.html',
  styleUrl: './magniche-bill-ward.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class MagnicheBillWardComponent {
  yearToYear: boolean = false;
  wardOptions: { label: number; value: number }[] = [];
  yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];
  clonedWardData: any[] = [];
  magnicheBillForm = new FormGroup({
      year: new FormControl<string | null>(null),
      to: new FormControl<string | null>(null),
      to1: new FormControl<string | null>(null),
      start: new FormControl<number | null>(null),
      end: new FormControl<number | null>(null),
      // Empty by default — user picks the dates themselves; report still
      // generates with blank dates (see getDate() empty handling).
      start_date: new FormControl<string | null>(null),
      end_date: new FormControl<string | null>(null),
      bharna: new FormControl<number | null>(null),
  });

  constructor(private adharListService: AdharListService,  private toastr: ToastrService, private router: Router,private customerService: CustomerService,) {
      // console.log('Received data in SillakjodaComponent:', this.data);
  }
   ngOnInit(): void {
        this.loadWardNumber();
        this.loadYearOptions();
        this.magnicheBillForm.get('year')?.valueChanges.subscribe((selectedYearId) => {
          if (selectedYearId !== null && selectedYearId !== undefined) {
            this.setNextYear(Number(selectedYearId));
          }
        });

        sessionStorage.removeItem('magnicheBillWardReport');
        sessionStorage.removeItem('magnicheBillWardReport_2');
        
    }
  ngAfterViewInit() {
    // this.wardOptions.paginator = this.paginator; // Removed incorrect assignment
  }
    loadWardNumber(): void {
        this.adharListService.getWardNumberList().subscribe({
          next: (res: any) => {
            this.wardOptions = res?.data.ward_number_list.map((ward: { label: number; value: number }) => ({
              ...ward,
              ward_129_1: "१२९(१)",
              ward_129_2: "१२९(२)"
            }));
            
            this.clonedWardData = this.wardOptions
            // console.log('this.wardOptions', this.clonedWardData);
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
          const currentYear = new Date().getFullYear();
          const currentYearObj = this.yearOptions.find((year) => Number(year.YEAR_NAME) === currentYear);
          const CYID = currentYearObj?.YEAR_ID ?? null;
          this.magnicheBillForm.get('year')?.setValue(CYID);
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
        this.magnicheBillForm.get('to')?.setValue(nextYear.YEAR_ID); // No error now
        this.magnicheBillForm.get('to1')?.setValue(nextYear.YEAR_NAME); // No error now

      } else {
        this.magnicheBillForm.get('to')?.setValue(null); // Handle no next year gracefully
        this.magnicheBillForm.get('to1')?.setValue(null); // Handle no next year gracefully
      }
    }

    applyFilter(event: Event): void {
      const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.wardOptions = this.clonedWardData;
      this.wardOptions = this.wardOptions.filter((item) => {
        return String(item.label).includes(value);
      });
    }

    generate_report_129_1(element:any): void {
      let formValues = this.magnicheBillForm.value;
      if(formValues.start!== null && formValues.end !== null && formValues.year !== null && formValues.to !== null && formValues.bharna !== null){
          const reportData = {
            ...formValues,
            new_user_id: null,
            ward_no: element,
            start_date: this.getDate(formValues.start_date),
            end_date: this.getDate(formValues.end_date),
          };
          // console.log('Generating report for ward:', reportData);
          
        const encoded = btoa(JSON.stringify(reportData));
        sessionStorage.setItem('magnicheBillWardReport', encoded);
        this.router.navigate(['magniche-bill-ward-report-129-1']);
      } else{
        this.toastr.error('Please fill requierd filed like Start Number, End Number and Bharna.', 'Error');
      }
    }

    generate_report_129_2(element:any): void {
      let formValues = this.magnicheBillForm.value;
      if(formValues.start!== null && formValues.end !== null && formValues.year !== null && formValues.to !== null && formValues.bharna !== null){
          const reportData = {
            ...formValues,
            new_user_id: null,
            ward_no: element,
            start_date: this.getDate(formValues.start_date),
            end_date: this.getDate(formValues.end_date),
          };
          console.log('Generating report for ward:', reportData);
          
        const encoded = btoa(JSON.stringify(reportData));
        sessionStorage.setItem('magnicheBillWardReport_2', encoded);
        this.router.navigate(['magniche-bill-ward-report-129-2']);
      } else{
        this.toastr.error('Please fill requierd filed like Start Number, End Number and Bharna.', 'Error');
      }
    }

    getDate(dateStr:any){
      // No date chosen → send blank so the report still generates.
      if (!dateStr) return '';
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
      // console.log(formattedDate); // 👉 "25/10/2025"
      return formattedDate;

    }
}
