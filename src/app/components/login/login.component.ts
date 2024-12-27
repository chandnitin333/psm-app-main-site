import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule, MatOptionModule, MatSelectModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      district1: ['', Validators.required], // First district dropdown
      district2: ['', Validators.required], // Second district dropdown
      district3: ['', Validators.required], // Third district dropdown
      email: ['', [Validators.required, Validators.email]], // Email field
      password: ['', Validators.required] // Password field
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { district1, district2, district3, email, password } = this.loginForm.value;
      console.log('Selected District 1:', district1);
      console.log('Selected District 2:', district2);
      console.log('Selected District 3:', district3);
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      console.log('Form is invalid');
    }
  }
}
