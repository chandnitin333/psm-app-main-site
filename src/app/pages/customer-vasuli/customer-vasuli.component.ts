import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LayoutModule } from '../../components/layout/layout.module';

@Component({
  selector: 'app-customer-vasuli',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './customer-vasuli.component.html',
  styleUrl: './customer-vasuli.component.css'
})
export class CustomerVasuliComponent {
toYearSelected: string = '2025';
fromYearSelected: string = '2024';
}
