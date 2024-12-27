import { Component } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-namuna8form',
  standalone: true,
  imports: [LayoutModule, FormsModule,ReactiveFormsModule],
  templateUrl: './namuna8form.component.html',
  styleUrl: './namuna8form.component.css'
})
export class Namuna8formComponent {

}
