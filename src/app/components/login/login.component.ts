import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

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
        ReactiveFormsModule,
        FormsModule,
        MatOptionModule,
        MatSelectModule,
        NgxMatSelectSearchModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    hidePassword = true;
    districtList: any = [];
    talukaList: any = [];
    panchayatList: any = [];

    // Filtered lists for search
    filteredDistrictList: any = [];
    filteredTalukaList: any = [];
    filteredPanchayatList: any = [];

    // Search text
    private _districtSearchText: string = '';
    private _talukaSearchText: string = '';
    private _panchayatSearchText: string = '';

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

    // Getters and Setters for search with filtering
    get districtSearchText(): string {
        return this._districtSearchText;
    }

    set districtSearchText(value: string) {
        this._districtSearchText = value;
        this.filterDistricts();
    }

    get talukaSearchText(): string {
        return this._talukaSearchText;
    }

    set talukaSearchText(value: string) {
        this._talukaSearchText = value;
        this.filterTalukas();
    }

    get panchayatSearchText(): string {
        return this._panchayatSearchText;
    }

    set panchayatSearchText(value: string) {
        this._panchayatSearchText = value;
        this.filterPanchayats();
    }

    // Filter methods
    filterDistricts() {
        if (!this._districtSearchText) {
            this.filteredDistrictList = this.districtList;
        } else {
            const search = this._districtSearchText.toLowerCase();
            this.filteredDistrictList = this.districtList.filter((district: any) =>
                district.DISTRICT_NAME.toLowerCase().includes(search)
            );
        }
    }

    filterTalukas() {
        if (!this._talukaSearchText) {
            this.filteredTalukaList = this.talukaList;
        } else {
            const search = this._talukaSearchText.toLowerCase();
            this.filteredTalukaList = this.talukaList.filter((taluka: any) =>
                taluka.TALUKA_NAME.toLowerCase().includes(search)
            );
        }
    }

    filterPanchayats() {
        if (!this._panchayatSearchText) {
            this.filteredPanchayatList = this.panchayatList;
        } else {
            const search = this._panchayatSearchText.toLowerCase();
            this.filteredPanchayatList = this.panchayatList.filter((panchayat: any) =>
                panchayat.PANCHAYAT_NAME.toLowerCase().includes(search)
            );
        }
    }

    // Get selected names for display
    getSelectedDistrictName(): string {
        const districtId = this.loginForm.get('district_id')?.value;
        if (!districtId) return '';
        const district = this.districtList.find((d: any) => d.DISTRICT_ID == districtId);
        return district ? district.DISTRICT_NAME : '';
    }

    getSelectedTalukaName(): string {
        const talukaId = this.loginForm.get('taluka_id')?.value;
        if (!talukaId) return '';
        const taluka = this.talukaList.find((t: any) => t.TALUKA_ID == talukaId);
        return taluka ? taluka.TALUKA_NAME : '';
    }

    getSelectedPanchayatName(): string {
        const panchayatId = this.loginForm.get('panchayat_id')?.value;
        if (!panchayatId) return '';
        const panchayat = this.panchayatList.find((p: any) => p.PANCHAYAT_ID == panchayatId);
        return panchayat ? panchayat.PANCHAYAT_NAME : '';
    }


    ngOnInit() {
        this.fetchDistricts();
    }

    fetchDistricts() {
        this.api.post('district-list-ddl', []).subscribe((res: any) => {
            this.districtList = res.data;
            this.filteredDistrictList = res.data;
        });
    }

    fetchTalukas(event: Event) {
        console.log('Selected District:', event);
        this.api.post('taluka-list-by-district-id', { id: event }).subscribe((res: any) => {
            this.talukaList = res.data;
            this.filteredTalukaList = res.data;
            this._talukaSearchText = '';
            // Reset taluka and panchayat selections
            this.loginForm.patchValue({
                taluka_id: '',
                panchayat_id: ''
            });
            this.panchayatList = [];
            this.filteredPanchayatList = [];
        });
    }

    fetchPanchaytList(event: Event) {
        this.api.post('panchayat-list-by-taluka-id', { id: event }).subscribe((res: any) => {
            console.log('Panchayat List:', res.data);
            this.panchayatList = res.data;
            this.filteredPanchayatList = res.data;
            this._panchayatSearchText = '';
            // Reset panchayat selection
            this.loginForm.patchValue({
                panchayat_id: ''
            });
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
                    console.log('Login Response------:', res?.data?.RandomNumber, res?.data?.RNO);
                    localStorage.setItem('randomNumber', res?.data?.RandomNumber);
                    localStorage.setItem('rno', res?.data?.RNO);
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
