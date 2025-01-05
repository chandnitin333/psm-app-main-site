import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DateFormatDirective } from '../../../directive/date-format.directive';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-no-dues-certificate',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,DateFormatDirective],
  templateUrl: './no-dues-certificate.component.html',
  styleUrl: './no-dues-certificate.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoDuesCertificateComponent {
readonly panelOpenState = signal(false);
}
