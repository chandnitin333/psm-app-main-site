import { Component } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-magniche-bill-ward',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './magniche-bill-ward.component.html',
  styleUrl: './magniche-bill-ward.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class MagnicheBillWardComponent {
toYearSelected: string = '2025';
fromYearSelected: string = '2024';
}
