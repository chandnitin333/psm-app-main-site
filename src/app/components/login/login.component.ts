import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import Util from '../../utils/utils';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule,
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
    districtList: any = [];
    talukaList: any = [];
    panchayatList: any = [];
    readonly dialog = inject(MatDialog);
    constructor(private fb: FormBuilder, private spinner: LoaderService, private api: ApiService, private util: Util, private router: Router) {
        this.loginForm = this.fb.group({
            district_id: ['', Validators.required], // First district dropdown
            taluka_id: ['', Validators.required], // Second district dropdown
            panchayat_id: ['', Validators.required], // Third district dropdown
            username: ['', [Validators.required]], // Email field
            password: ['', Validators.required] // Password field
        });
    }


    ngOnInit() {
        this.fetchDistricts();
    }

    fetchDistricts() {
        this.api.post('district-list-ddl', []).subscribe((res: any) => {
            this.districtList = res.data;
        });
    }

    fetchTalukas(event: Event) {
        console.log('Selected District:', event);
        this.api.post('taluka-list-by-district-id', { id: event }).subscribe((res: any) => {
            this.talukaList = res.data;
        });
    }

    fetchPanchaytList(event: Event) {
        this.api.post('panchayat-list-by-taluka-id', { id: event }).subscribe((res: any) => {
            console.log('Panchayat List:', res.data);
            this.panchayatList = res.data;
        });
    }
    onSubmit() {

        if (this.loginForm.valid) {
            this.spinner.show();
            const { district_id, taluka_id, panchayat_id, username, password } = this.loginForm.value;
            this.api.post('sign-in', { username, password, user_type: 'new_user', district_id, taluka_id, panchayat_id }).subscribe((res: any) => {
                this.spinner.hide();
                console.log('Login Response:', res);
                if (!res?.data?.token) {

                    console.log('Invalid Credentials');
                    this.util.openDialog('Failed', res?.message, 'error');
                } else {
                    this.api.setToken(res?.data?.token);
                    this.util.openDialog('Success', 'Logged in successfully', 'success');
                    this.router.navigate(['dashboard']);
                }
            }
            );
        } else {

            this.util.openDialog('Failed', 'Form is invalid', 'error');
        }
    }
}
