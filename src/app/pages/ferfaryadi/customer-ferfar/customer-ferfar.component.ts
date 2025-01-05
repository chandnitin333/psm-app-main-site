import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-customer-ferfar',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink, DateFormatDirective],
  templateUrl: './customer-ferfar.component.html',
  styleUrl: './customer-ferfar.component.css',
   providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class CustomerFerfarComponent {
toYearSelected: string = '2025';
fromYearSelected: string = '2024';
}
