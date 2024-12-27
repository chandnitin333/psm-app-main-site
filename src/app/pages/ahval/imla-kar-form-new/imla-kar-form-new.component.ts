import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-imla-kar-form-new',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './imla-kar-form-new.component.html',
  styleUrl: './imla-kar-form-new.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class ImlaKarFormNewComponent {
toYearSelected: string = '2025';
fromYearSelected: string = '2024';
}
