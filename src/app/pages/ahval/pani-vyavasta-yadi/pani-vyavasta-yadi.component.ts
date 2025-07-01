import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdharListService } from '../../../services/adhar-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pani-vyavasta-yadi',
  standalone: true,
  imports: [LayoutModule,ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './pani-vyavasta-yadi.component.html',
  styleUrl: './pani-vyavasta-yadi.component.css'
})
export class PaniVyavastaYadiComponent {
wardOptions: { label: number; value: number }[] = [];

  constructor(private adharListService: AdharListService,  private toastr: ToastrService, private router: Router,) {
  }
  ngOnInit(): void {
      this.loadWardNumber();
  }

  loadWardNumber(): void {
    this.adharListService.getWardNumberList().subscribe({
      next: (res: any) => {
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
  onSelect(event:any){
    console.log('Selected option:', event.value);
    this.router.navigate(['/ward-wise-pinyache-pani-list'], { state: { value: event.value} });
  }
}
