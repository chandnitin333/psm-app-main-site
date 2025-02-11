import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContainer, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
    selector: 'app-login-dialog',
    imports: [MatDialogModule, MatButton, MatDialogActions, MatDialogContent, MatDialogTitle, MatDialogClose, MatDialogContainer, MatFormField, CommonModule, FormsModule, MatLabel, MatIcon, MatInput],
    template: `
   <h2 mat-dialog-title class="dialog-title mb-2">Login</h2>

<mat-dialog-content>
  <form (ngSubmit)="onSubmit()" class="login-form mt-2" >
    <mat-form-field appearance="outline" class="input-field">
      <mat-label>Username</mat-label>
      <input matInput [(ngModel)]="username" name="username" required />
    </mat-form-field>

    <mat-form-field appearance="outline" class="input-field">
      <mat-label>Password</mat-label>
      <input matInput [(ngModel)]="password" name="password" type="password" required />
    </mat-form-field>
  </form>
</mat-dialog-content>

<mat-dialog-actions align="end" class="dialog-actions">
  <button mat-button (click)="onCancel()" class="cancel-button">Cancel</button>
  <button mat-button color="primary" (click)="onSubmit()" class="submit-button">Submit</button>
</mat-dialog-actions>

  `,
    standalone: true,
    styles: `/* Styling the dialog title */
    .dialog-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #3f51b5; /* Classic Blue */
      padding-bottom: 16px;
    }
    
    /* Styling the form fields */
    .input-field {
      width: 100%;
      margin-bottom: 16px;
    }
    
    /* Dialog actions (buttons) */
    .dialog-actions {
      padding-top: 16px;
    }
    
    .cancel-button {
      color: #f44336; /* Red for cancel button */
    }
    
    .submit-button {
      background-color: #3f51b5; /* Primary blue for submit button */
      color: white;
    }
    
    .submit-button:hover {
      background-color: #303f9f; /* Darker shade on hover */
    }
    
    button {
      min-width: 100px;
    }
    `
})
export class LoginDialogComponent {
    username: string = '';
    password: string = '';

    constructor(
        public dialogRef: MatDialogRef<LoginDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.username && this.password) {
            this.dialogRef.close({ username: this.username, password: this.password });
        } else {
            console.error('Please provide both username and password.');
        }
    }
}
