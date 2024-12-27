import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-widow-certificate',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './widow-certificate.component.html',
  styleUrl: './widow-certificate.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidowCertificateComponent {
readonly panelOpenState = signal(false);
}
