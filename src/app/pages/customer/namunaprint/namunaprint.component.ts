import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { LayoutModule } from '../../../components/layout/layout.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-namunaprint',
  standalone: true,
  imports: [LayoutModule,
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './namunaprint.component.html',
  styleUrl: './namunaprint.component.css'
})
export class NamunaprintComponent {
  constructor(
    public dialogRef: MatDialogRef<NamunaprintComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, private router: Router,
  ) {
    console.log('Received data in NamunaprintComponent:', this.data.NEWUSER_ID);
  }

  onSelect(event:any){
    console.log('Selected option:', event.value);
    if(event.value === 'नमुना ८'){
         this.router.navigate(['/namuna-8-1'], { state: { name: 'Namuna 8.1', value: this.data.NEWUSER_ID } });
    } else if(event.value == 'नमुना ९'){
        this.router.navigate(['/namuna-9-1'], { state: { name: 'Namuna 9.1', value: this.data.NEWUSER_ID, ward_no: this.data.VARD_NUMBER } });
    } else if(event.value == 'नमुना 8 सरकारी'){
        this.router.navigate(['/namuna-8-sarkari'], { state: { name: 'Namuna 8.sarkari', value: this.data.NEWUSER_ID } });
    }
    this.dialogRef.close();
  }

}
