import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DateFormatDirective } from '../../../directive/date-format.directive';

@Component({
  selector: 'app-certificate-of-niradhar',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './certificate-of-niradhar.component.html',
  styleUrl: './certificate-of-niradhar.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateOfNiradharComponent {
readonly panelOpenState = signal(false);
}
