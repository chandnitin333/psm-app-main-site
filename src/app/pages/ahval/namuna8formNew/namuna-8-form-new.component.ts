import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdharListService } from '../../../services/adhar-list.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-namuna-8-form-new',
  standalone: true,
  imports: [LayoutModule,ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './namuna-8-form-new.component.html',
  styleUrl: './namuna-8-form-new.component.css'
})
export class Namuna8FormNewComponent {
  yearToYear: boolean = false;
  wardOptions: { label: number; value: number }[] = [];
  yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];

  namuna8Form = new FormGroup({
    namuna: new FormControl<string | null>(null),
    ward_no: new FormControl<string | null>(null),
    year: new FormControl<string | null>(null),
    to: new FormControl<string | null>(null),
    // to1: new FormControl<string | null>(null),
    year1: new FormControl<number | null>(null),
    toYear1: new FormControl<number | null>(null),
    start: new FormControl<number | null>(null),
    end: new FormControl<number | null>(null),
  });

   constructor(private adharListService: AdharListService,  private toastr: ToastrService, private router: Router,private customerService: CustomerService,) {
    // console.log('Received data in SillakjodaComponent:', this.data);
  }

  ngOnInit(): void {
      this.loadWardNumber();
      this.loadYearOptions();
      // this.malmattaGrahakYadiForm.get('year')?.valueChanges.subscribe((selectedYearId) => {
      //   if (selectedYearId !== null && selectedYearId !== undefined) {
      //     this.setNextYear(Number(selectedYearId));
      //   }
      // });

      sessionStorage.removeItem('Namuna8anukramanikaForm');
      sessionStorage.removeItem('namuna8wardNewForm');
      sessionStorage.removeItem('namuna81SingleWardForm');
      
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
  showYwarToYear(event: MatSelectChange): void {
    const selectedValue = event.value;
    console.log('Selected Year ID:', selectedValue);
    if(selectedValue == "namuna8" || selectedValue == "namuna8i"){
      this.yearToYear = true;
    }else{
      this.yearToYear = false;
    }
  }

  get_Namuna8(){
    if(this.namuna8Form.value.namuna == "Namuna8anukramanika"){
      sessionStorage.setItem('Namuna8anukramanikaForm', btoa(JSON.stringify(this.namuna8Form.value)));
      this.router.navigate(['/namuna-8-anukramika-list']);
    } else if(this.namuna8Form.value.namuna == "namuna8") {
      sessionStorage.setItem('namuna8wardNewForm', btoa(JSON.stringify(this.namuna8Form.value)));
      this.router.navigate(['/namuna-8-ward-new-list']);
    } else if(this.namuna8Form.value.namuna == "namuna8New") {
      sessionStorage.setItem('namuna81SingleWardForm', btoa(JSON.stringify(this.namuna8Form.value)));
      this.router.navigate(['/get-namuna-8-1-single-vard-list']);
    }
  }
}
