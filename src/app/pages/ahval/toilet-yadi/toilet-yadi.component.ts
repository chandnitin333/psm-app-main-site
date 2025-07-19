import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { AdharListService } from '../../../services/adhar-list.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toilet-yadi',
  standalone: true,
  imports: [LayoutModule,ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './toilet-yadi.component.html',
  styleUrl: './toilet-yadi.component.css'
})
export class ToiletYadiComponent {
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
    this.router.navigate(['/ward-wise-toilet-list'], { state: { value: event.value} });
  }
}
