import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-certificate-of-deserted',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './certificate-of-deserted.component.html',
  styleUrl: './certificate-of-deserted.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateOfDesertedComponent {
readonly panelOpenState = signal(false);
}
