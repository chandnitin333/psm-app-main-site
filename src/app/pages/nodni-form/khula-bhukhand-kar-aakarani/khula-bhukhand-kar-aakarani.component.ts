import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-khula-bhukhand-kar-aakarani',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './khula-bhukhand-kar-aakarani.component.html',
  styleUrl: './khula-bhukhand-kar-aakarani.component.css'
})
export class KhulaBhukhandKarAakaraniComponent {

}
