import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../../../components/layout/layout.module';

@Component({
  selector: 'app-marriage-certificate',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './marriage-certificate.component.html',
  styleUrl: './marriage-certificate.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarriageCertificateComponent {
readonly panelOpenState = signal(false);
}
