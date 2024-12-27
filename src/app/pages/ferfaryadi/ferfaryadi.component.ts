import { Component } from '@angular/core';
import { LayoutModule } from '../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ferfaryadi',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './ferfaryadi.component.html',
  styleUrl: './ferfaryadi.component.css'
})
export class FerfaryadiComponent {
toYearSelected: string = '2025';
fromYearSelected: string = '2024';

}
