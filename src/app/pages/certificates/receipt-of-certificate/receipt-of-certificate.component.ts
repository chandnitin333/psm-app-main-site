import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { LayoutModule } from '../../../components/layout/layout.module';

@Component({
  selector: 'app-receipt-of-certificate',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './receipt-of-certificate.component.html',
  styleUrl: './receipt-of-certificate.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptOfCertificateComponent {
readonly panelOpenState = signal(false);
}
