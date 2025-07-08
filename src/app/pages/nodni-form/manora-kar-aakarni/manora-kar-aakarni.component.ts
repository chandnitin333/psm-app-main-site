import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manora-kar-aakarni',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './manora-kar-aakarni.component.html',
  styleUrl: './manora-kar-aakarni.component.css'
})
export class ManoraKarAakarniComponent {

}
