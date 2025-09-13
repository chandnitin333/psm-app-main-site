import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LayoutModule } from '../../../components/layout/layout.module';
import { AdharListService } from '../../../services/adhar-list.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-malmatta-grahak-yadi',
  standalone: true,
  imports: [LayoutModule,ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './malmatta-grahak-yadi.component.html',
  styleUrl: './malmatta-grahak-yadi.component.css'
})
export class MalmattaGrahakYadiComponent {

  wardOptions: { label: number; value: number }[] = [];
  yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];
  malmattaGrahakYadiForm = new FormGroup({
    yadi: new FormControl<string | null>(null),
    ward_nos: new FormControl<string | null>(null),
    year: new FormControl<string | null>(null),
    to: new FormControl<string | null>(null),
    // to1: new FormControl<string | null>(null),
    start: new FormControl<string | null>(null),
    end: new FormControl<string | null>(null),
  });
   constructor(private adharListService: AdharListService,  private toastr: ToastrService, private router: Router,private customerService: CustomerService,) {
    // console.log('Received data in SillakjodaComponent:', this.data);
  }
  ngOnInit(): void {
      // console.log("kundan-----------------> this.malmattaGrahakYadiForm.value", this.malmattaGrahakYadiForm.value);
      this.loadWardNumber();
      this.loadYearOptions();
      // this.malmattaGrahakYadiForm.get('year')?.valueChanges.subscribe((selectedYearId) => {
      //   if (selectedYearId !== null && selectedYearId !== undefined) {
      //     this.setNextYear(Number(selectedYearId));
      //   }
      // });
      sessionStorage.removeItem('malmattaForm');
      sessionStorage.removeItem('KhulaBhukhandForm');
      sessionStorage.removeItem('GharKarLavaychAheForm');
      
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
  // setNextYear(selectedYearId: number): void {
  //   const selectedIndex = this.yearOptions.findIndex((year) => Number(year.YEAR_ID) === Number(selectedYearId));

  //   if (selectedIndex !== -1 && selectedIndex + 1 < this.yearOptions.length) {
  //     const nextYear = this.yearOptions[selectedIndex + 1];
  //     this.malmattaGrahakYadiForm.get('to')?.setValue(nextYear.YEAR_ID); // No error now
  //     this.malmattaGrahakYadiForm.get('to1')?.setValue(nextYear.YEAR_NAME); // No error now
  //   } else {
  //     this.malmattaGrahakYadiForm.get('to')?.setValue(null); // Handle no next year gracefully
  //     this.malmattaGrahakYadiForm.get('to1')?.setValue(null); // Handle no next year gracefully
  //   }
  // }

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
  get_malmatta_grahak_yadi(){
    
    if(this.malmattaGrahakYadiForm.value.yadi == "yadi"){
      sessionStorage.setItem('malmattaForm', btoa(JSON.stringify(this.malmattaGrahakYadiForm.value)));
      this.router.navigate(['/malmatta-darkahchi-yadi-list']);
    } else if(this.malmattaGrahakYadiForm.value.yadi == "khula") {
      
      sessionStorage.setItem('KhulaBhukhandForm', btoa(JSON.stringify(this.malmattaGrahakYadiForm.value)));
      this.router.navigate(['/malmatta-khula-bhukhand-yadi-list']);
    } else if(this.malmattaGrahakYadiForm.value.yadi == "ghar") {
      sessionStorage.setItem('GharKarLavaychAheForm', btoa(JSON.stringify(this.malmattaGrahakYadiForm.value)));
      this.router.navigate(['/ghar-kar-lavaych-ahe-list']);
    }
    // this.router.navigate(['/ward-wise-pinyache-pani-list'], { state: { value: event.value} });
  }
}
