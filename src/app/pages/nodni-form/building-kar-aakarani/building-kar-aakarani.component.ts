import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-building-kar-aakarani',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './building-kar-aakarani.component.html',
  styleUrl: './building-kar-aakarani.component.css'
})
export class BuildingKarAakaraniComponent {

}
