import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LayoutModule } from '../../../components/layout/layout.module';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { AdharListService } from '../../../services/adhar-list.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';
import { MagnicheBillService } from '../../../services/magniche-bill.service';

@Component({
  selector: 'app-magniche-bill',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './magniche-bill.component.html',
  styleUrl: './magniche-bill.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class MagnicheBillComponent {
  yearToYear: boolean = false;
  wardOptions: { label: number; value: number }[] = [];
  yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];
  listingData:{ ANNU_KRAMANK: string; VARD_NUMBER: string, N_HOMEUSER_NAME: string }[] = [];
  clonedData: any[] = [];
  magnicheBillForm = new FormGroup({
      year: new FormControl<string | null>(null),
      ward_no: new FormControl<string | null>(null),
      to: new FormControl<string | null>(null),
      to1: new FormControl<string | null>(null),
      start_anukramnak: new FormControl<number | null>(null),
      end_anukramnak: new FormControl<number | null>(null),
      start_date: new FormControl<string | null>(new Date().toISOString().split('T')[0]),
      end_date: new FormControl<string | null>(new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]),
      bharna: new FormControl<number | null>(null),
  });

  constructor(private adharListService: AdharListService,  private toastr: ToastrService, private router: Router,private customerService: CustomerService,private apiService: MagnicheBillService) {
      // console.log('Received data in SillakjodaComponent:', this.data);
  }
   ngOnInit(): void {
        this.loadWardNumber();
        this.fetchData();
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

  

    fetchData(): void {
        const param = {
            "page_number": 1,
            "from_year": this.magnicheBillForm.value.year || null,
            "to_year": this.magnicheBillForm.value.to || null,
            "from_anu_kramank": this.magnicheBillForm.value.start_anukramnak || null,
            "to_anu_kramank": this.magnicheBillForm.value.end_anukramnak || null,
            "vard_number": this.magnicheBillForm.value.ward_no || null,
            "start_date": this.getDate(this.magnicheBillForm.value.start_date) || null,
            "end_date": this.getDate(this.magnicheBillForm.value.end_date) || null,
            "bharna": this.magnicheBillForm.value.bharna || null,
        }
        this.apiService.searchmagnicheUser(param).subscribe({
          next: (res: any) => {
            this.listingData = res?.data.map((ward: { ANNU_KRAMANK: string; VARD_NUMBER: string, N_HOMEUSER_NAME: string }) => ({
              ...ward,
              ward_129_1: "१२९(१)",
              ward_129_2: "१२९(२)"
            }));

            console.log('this.listingData', this.listingData);
            this.clonedData = this.listingData
          },
          error: (err: Error) => {
            console.error('Error getting drop down:', err);
            this.toastr.error(
              'There was an error getting the list dropdown.',
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

    // applyFilter(event: Event): void {
    //   const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    //   this.listingData = this.clonedData;
    //   console.log('this.clonedData', this.clonedData);
    //   console.log('Filter value:', value);
    //   this.listingData = this.listingData.filter((item) => {
    //     item.ANNU_KRAMANK.includes(value) ||
    //     item.VARD_NUMBER.includes(value) ||
    //     item.N_HOMEUSER_NAME.toLowerCase().includes(value)
    //   });
    // }
    applyFilter(event: Event): void {
      const value = (event.target as HTMLInputElement).value.trim().toLowerCase();

      // reset list to full data
      this.listingData = [...this.clonedData];

      // console.log('Filter value:', value);

      // if input is empty, don't filter
      if (!value) return;

      this.listingData = this.listingData.filter((item) => {
        const ANNU_KRAMANK = String(item.ANNU_KRAMANK || '').toLowerCase();
        const VARD_NUMBER = String(item.VARD_NUMBER || '').toLowerCase();
        const N_HOMEUSER_NAME = String(item.N_HOMEUSER_NAME || '').toLowerCase();

        return (
          ANNU_KRAMANK.includes(value) ||
          VARD_NUMBER.includes(value) ||
          N_HOMEUSER_NAME.includes(value)
        );
      });
    }


    generate_report_129_1(element:any): void {
      let formValues = this.magnicheBillForm.value;
      // if(formValues.start_anukramnak!== null && formValues.end_anukramnak !== null && formValues.year !== null && formValues.to !== null && formValues.bharna !== null){
          const reportData = {
            new_user_id: element
          };
          console.log('Generating report for ward:', reportData);
          
        const encoded = btoa(JSON.stringify(reportData));
        sessionStorage.setItem('magnicheBillWardReport', encoded);
        this.router.navigate(['magniche-bill-ward-report-129-1']);
      // } else{
      //   this.toastr.error('Please fill requierd filed like Start Number, End Number and Bharna.', 'Error');
      // }
    }

    generate_report_129_2(element:any): void {
      let formValues = this.magnicheBillForm.value;
      // if(formValues.start_anukramnak!== null && formValues.end_anukramnak !== null && formValues.year !== null && formValues.to !== null && formValues.bharna !== null){
          const reportData = {
            new_user_id: element
          };
          console.log('Generating report for ward:', reportData);
          
        const encoded = btoa(JSON.stringify(reportData));
        sessionStorage.setItem('magnicheBillWardReport_2', encoded);
        this.router.navigate(['magniche-bill-ward-report-129-2']);
      // } else{
      //   this.toastr.error('Please fill requierd filed like Start Number, End Number and Bharna.', 'Error');
      // }
    }

    getDate(dateStr:any){
      const date = new Date(dateStr);

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
      // console.log(formattedDate); // 👉 "25/10/2025"
      return formattedDate;

    }
}
