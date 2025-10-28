import { Component, Input } from '@angular/core';
import { LayoutModule } from '../../components/layout/layout.module';
import { MatTableDataSource } from '@angular/material/table';
import { AdharListService } from '../../services/adhar-list.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { CustomPaginationComponent } from '../../custom-pagination/custom-pagination.component';
import { MatDataTableComponent } from '../../mat-data-table/mat-data-table.component';
import { ITEM_PER_PAGE, PAZE_SIZE } from '../../constants/common.constant';

// export interface PeriodicElement {
//   from_year: number;
//   to_year: number;
//   khatedharak_name:string;
//   gruhkar_bhumikar: number;
//   vij_divabatti_kar: number;
//   aarogya_rakshan_kar: number;
//   safae_kar:number;
//   samanya_pani_kar:number; 
//   vises_pani_kar:number;
//   total:number;

// }

@Component({
  selector: 'app-tax-generration',
  standalone: true,
  imports: [LayoutModule,ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,CustomPaginationComponent,MatDataTableComponent],
  templateUrl: './tax-generration.component.html',
  styleUrl: './tax-generration.component.css'
})
export class TaxGenerrationComponent {
wardOptions: { label: number; value: number }[] = [];
yearOptions: { YEAR_ID: string; YEAR_NAME: string }[] = [];
currentPage: number = 1;
@Input() totalItems!: number;
@Input() itemsPerPage = ITEM_PER_PAGE;
dataSource = new MatTableDataSource();
pagedDataSource = new MatTableDataSource<any>([]);
displayedColumns: any = [
    { key: '#', value: '#' },
    { key: 'YEAR_NAME', value: 'वर्ष(Year)' },
    { key: 'YEAR_NAME1', value: '(To)' },
    { key: 'VARD_NUMBER', value: 'वार्ड नं' },
    { key: 'HOMEUSER_NAME', value: 'खातेधारकाचे नाव' },
    { key: 'BHUMI_KAR', value: 'गृहकर व भूमीकर' },
    { key: 'DIVA_BATTI_KAR', value: 'विज /दिवाबत्ती कर' },
    { key: 'AAROGYA_RAKSHAN_KAR', value: 'आरोग्य रक्षण कर' },
    { key: 'SAFAI_KAR', value: 'सफाई कर' },
    { key: 'SAMANYA_PANI_KAR', value: 'सामान्य पानी क़र' },
    { key: 'VISHESH_PANI_KAR', value: 'विशेष पाणी कर' },
    { key: 'FGFHH', value: 'एकूण मागील बाकी' },
    { key: 'EMARTICHE_KARAAKARNI', value: 'एकूण इमारत कर' },
    { key: 'TOTAL', value: 'एकूण' },
  ];

taxGenerationForm = new FormGroup({
  ward_number: new FormControl<string | null>(null),
  year: new FormControl<string | null>(null),
  to: new FormControl<string | null>(null),
  to1: new FormControl<string | null>(null),
});
totalTaxCalculationForm = new FormGroup({
  totalCount: new FormControl<number | null>(null),
  FGFHH: new FormControl<number | null>(null),
  EMARTICHE_KARAAKARNI: new FormControl<number | null>(null),
  DIVA_BATTI_KAR: new FormControl<number | null>(null),
  KHULA_BHUKAND: new FormControl<number | null>(null),
  SAFAI_KAR: new FormControl<number | null>(null),
  AAROGYA_RAKSHAN_KAR: new FormControl<number | null>(null),
  VISHESH_PANI_KAR: new FormControl<number | null>(null),
  SAMANYA_PANI_KAR: new FormControl<number | null>(null),
  TOTAL: new FormControl<number | null>(null)
})
constructor(private adharListService: AdharListService,  private toastr: ToastrService, private router: Router,private customerService: CustomerService,) {
    // console.log('Received data in SillakjodaComponent:', this.data);
  }
  ngOnInit(): void {
      this.loadWardNumber();
      this.loadYearOptions();
      this.taxGenerationForm.get('year')?.valueChanges.subscribe((selectedYearId) => {
        if (selectedYearId !== null && selectedYearId !== undefined) {
          this.setNextYear(Number(selectedYearId));
        }
      });
      // console.log("totalItems", this.totalItems);
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
          this.taxGenerationForm.get('year')?.setValue(CYID);
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
      this.taxGenerationForm.get('to')?.setValue(nextYear.YEAR_ID); // No error now
      this.taxGenerationForm.get('to1')?.setValue(nextYear.YEAR_NAME); // No error now
    } else {
      this.taxGenerationForm.get('to')?.setValue(null); // Handle no next year gracefully
      this.taxGenerationForm.get('to1')?.setValue(null); // Handle no next year gracefully
    }
  }
  getTaxGenerationRecords(){
    if (this.taxGenerationForm.valid) {
      // const formData = this.taxGenerationForm.value;
      // console.log('Form Data:', formData);
      this.customerService
      .getTaxGenerationRecords({
        page_number: this.currentPage,
        ward_no: this.taxGenerationForm.value.ward_number,
        from_year: this.taxGenerationForm.value.year,
        to_year: this.taxGenerationForm.value.to,
      })
      .subscribe({
        next: (res: any) => {
          // console.log('Tax Generation Records:', res.sumCalculation);
          this.dataSource = new MatTableDataSource(res?.data ?? []);

          this.totalItems = res?.total_count ?? 0;
          this.totalTaxCalculationForm.patchValue({
            totalCount: res?.sumCalculation?.totalCount,
            FGFHH: res?.sumCalculation?.FGFHH.toFixed(2) ?? 0,
            EMARTICHE_KARAAKARNI: res?.sumCalculation?.EMARTICHE_KARAAKARNI.toFixed(2) ?? 0,
            DIVA_BATTI_KAR: res?.sumCalculation?.DIVA_BATTI_KAR.toFixed(2) ?? 0,
            KHULA_BHUKAND: res?.sumCalculation?.KHULA_BHUKAND.toFixed(2) ?? 0,
            SAFAI_KAR: res?.sumCalculation?.SAFAI_KAR.toFixed(2) ?? 0,
            AAROGYA_RAKSHAN_KAR: res?.sumCalculation?.AAROGYA_RAKSHAN_KAR.toFixed(2) ?? 0,
            VISHESH_PANI_KAR: res?.sumCalculation?.VISHESH_PANI_KAR.toFixed(2) ?? 0,
            SAMANYA_PANI_KAR: res?.sumCalculation?.SAMANYA_PANI_KAR.toFixed(2) ?? 0,
            TOTAL: res?.sumCalculation?.TOTAL.toFixed(2) ?? 0,
          });
          this.setPageData({
            pageIndex: 0,
            pageSize: PAZE_SIZE,
            length: this.dataSource.data.length,
          });
        },
        error: (err: any) => {
          console.error('Error fetch Tax Generation Records:', err);
        },
      });
      
    } else {
      this.toastr.error('Please fill in all required fields.', 'Error');
    }
  }
   onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.getTaxGenerationRecords();
  }
  setPageData(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedDataSource.data = this.dataSource.data.slice(
      startIndex,
      endIndex
    );
  }
}
