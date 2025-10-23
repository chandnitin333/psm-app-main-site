import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LayoutModule } from '../../../components/layout/layout.module';
import { AdharListService } from '../../../services/adhar-list.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-namuna9form-new',
  standalone: true,
 imports: [LayoutModule,ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './namuna9form-new.component.html',
  styleUrl: './namuna9form-new.component.css'
})
export class Namuna9formNewComponent {
  wardOptions: { label: number; value: number }[] = [];
  yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];
  namuna9Form = new FormGroup({
    namuna: new FormControl<string | null>(null),
    ward_no: new FormControl<string | null>(null),
    year: new FormControl<string | null>(null),
    to: new FormControl<string | null>(null),
    to1: new FormControl<string | null>(null),
    start: new FormControl<number | null>(null),
    end: new FormControl<number | null>(null),
  });
  
   constructor(private adharListService: AdharListService,  private toastr: ToastrService, private router: Router,private customerService: CustomerService,) {
    // console.log('Received data in SillakjodaComponent:', this.data);
  }

  ngOnInit(): void {
      this.loadWardNumber();
      this.loadYearOptions();
      this.namuna9Form.get('year')?.valueChanges.subscribe((selectedYearId) => {
        if (selectedYearId !== null && selectedYearId !== undefined) {
          this.setNextYear(Number(selectedYearId));
        }
      });

      sessionStorage.removeItem('Namuna9anukramanika');
      sessionStorage.removeItem('namuna9');
      sessionStorage.removeItem('namuna9New');
      sessionStorage.removeItem('namuna9Ghoswara');
      sessionStorage.removeItem('namuna9GhoswaraNew');
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
        this.namuna9Form.get('to')?.setValue(nextYear.YEAR_ID); // No error now
        this.namuna9Form.get('to1')?.setValue(nextYear.YEAR_NAME); // No error now

      } else {
        this.namuna9Form.get('to')?.setValue(null); // Handle no next year gracefully
        this.namuna9Form.get('to1')?.setValue(null); // Handle no next year gracefully
      }
    }
  get_Namuna9(){
    if(this.namuna9Form.value.namuna == "Namuna9anukramanika"){
      sessionStorage.setItem('Namuna9anukramanika', btoa(JSON.stringify(this.namuna9Form.value)));
      this.router.navigate(['/namuna-9-anukramika-list']);
    } else if(this.namuna9Form.value.namuna == "namuna9") {
      sessionStorage.setItem('namuna9', btoa(JSON.stringify(this.namuna9Form.value)));
      this.router.navigate(['/namuna-9-ward-new-list']);
    } else if(this.namuna9Form.value.namuna == "namuna9New") {
      sessionStorage.setItem('namuna9New', btoa(JSON.stringify(this.namuna9Form.value)));
      this.router.navigate(['/get-namuna-9-new']);
    }
     else if(this.namuna9Form.value.namuna == "namuna9GhoswaraNew") {
      sessionStorage.setItem('namuna9Ghoswara', btoa(JSON.stringify(this.namuna9Form.value)));
      this.router.navigate(['/get-namuna-9-ghosvara']);
    }
    //  else if(this.namuna9Form.value.namuna == "namuna9GhoswaraNew") {
    //   sessionStorage.setItem('namuna9GhoswaraNew', btoa(JSON.stringify(this.namuna9Form.value)));
    //   this.router.navigate(['/get-namuna-9-ghosvara-new']);
    // }  
  }
}
