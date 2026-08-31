import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdharListService } from '../../../services/adhar-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-number',
  standalone: true,
  imports: [LayoutModule,ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './mobile-number.component.html',
  styleUrl: './mobile-number.component.css'
})
export class MobileNumberComponent {
  wardOptions: { label: number; value: number }[] = [];
  constructor(private adharListService: AdharListService,  private toastr: ToastrService, private router: Router,) {
    // console.log('Received data in SillakjodaComponent:', this.data);
  }
  ngOnInit(): void {
      this.loadWardNumber();
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
  onSelect(event:any){
    console.log('Selected option:', event.value);
    this.router.navigate(['/ward-wise-mobile-no-list'], { state: { value: event.value} });
  }
}
