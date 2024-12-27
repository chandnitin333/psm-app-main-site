import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-imla-kar-form',
  standalone: true,
  imports: [LayoutModule, FormsModule,ReactiveFormsModule],
  templateUrl: './imla-kar-form.component.html',
  styleUrl: './imla-kar-form.component.css'
})
export class ImlaKarFormComponent {

}
