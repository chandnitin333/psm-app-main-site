import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DateFormatDirective } from '../../../directive/date-format.directive';

@Component({
  selector: 'app-below-poverty-certificate',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './below-poverty-certificate.component.html',
  styleUrl: './below-poverty-certificate.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BelowPovertyCertificateComponent {
readonly panelOpenState = signal(false);
}
