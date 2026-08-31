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
    console.log('Received data in NamunaprintComponent-----:', this.data);
    sessionStorage.removeItem('namuna8imgaesform');
  }
  ngOnInit() {
      // Initialization logic here
      sessionStorage.removeItem('namuna81SingleWardForm');
    }
  onSelect(event:any){
    console.log('Selected option:', event.value);
    if(event.value === 'नमुना ८'){
         this.router.navigate(['/namuna-8-1'], { state: { name: 'Namuna 8.1', value: this.data.NEWUSER_ID } });
    } else if(event.value == 'नमुना ९'){
        this.router.navigate(['/namuna-9-1'], { state: { name: 'Namuna 9.1', value: this.data.NEWUSER_ID, ward_no: this.data.VARD_NUMBER } });
    } else if(event.value == 'नमुना 8 सरकारी'){
        this.router.navigate(['/namuna-8-sarkari'], { state: { name: 'Namuna 8.sarkari', value: this.data.NEWUSER_ID } });
    } else if(event.value == 'नमुना 8 New Version'){
      let params=
        {
            "ward": 0,
            "year":0,
            "start": 0,
            "end":0,
            "new_user_id":this.data.NEWUSER_ID
        };
      sessionStorage.setItem('namuna81SingleWardForm', btoa(JSON.stringify(params)));
      this.router.navigate(['/get-namuna-8-1-single-vard-list']);
        // this.router.navigate(['/namuna-8-new-version-customer-page'], { state: { name: 'Namuna 8 New Version', value: this.data.NEWUSER_ID } });
    } else if(event.value == 'नमुना 8 Images'){
        let params=
        {
            "ward": 0,
            "year":0,
            "start": 0,
            "end":0,
            "new_user_id":this.data.NEWUSER_ID,
            "from_year":0,
            "to_year":0
        };
        // params['ward'] = 0;
        // params['year'] = 0;
        // params['start'] = 0;
        // params['end'] = 0;
        // params['new_user_id'] = this.data.NEWUSER_ID;
        // params['from_year'] = 0;
        // params['to_year'] = 0;

        // console.log('namuna 8 images params----', JSON.stringify(params));
        sessionStorage.setItem('namuna8imgaesform', btoa(JSON.stringify(params)));
        this.router.navigate(['/get-namuna-8-images']);
    } 

    // images vala nhi jhala नमुना 8 Images
    // sessionStorage.setItem('namuna8imgaesform', btoa(JSON.stringify(this.namuna8Form.value)));
    //   this.router.navigate(['/get-namuna-8-images']);

    
    this.dialogRef.close();
  }

}
