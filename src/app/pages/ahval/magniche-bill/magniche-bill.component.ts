import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutModule } from '../../../components/layout/layout.module';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { DateFormatDirective } from '../../../directive/date-format.directive';

@Component({
  selector: 'app-magniche-bill',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './magniche-bill.component.html',
  styleUrl: './magniche-bill.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class MagnicheBillComponent {
toYearSelected: string = '2025';
fromYearSelected: string = '2024';
}
