import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LayoutModule } from '../../components/layout/layout.module';
import { CustomPaginationComponent } from '../../custom-pagination/custom-pagination.component';
import { MatDataTableComponent } from '../../mat-data-table/mat-data-table.component';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LayoutModule, CommonModule, MatDataTableComponent, CustomPaginationComponent,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  token: any = "";
  userData: any = {
    chalu_khatedar: 0,
    adhikrut: 0,
    indira_awas: 0,
    imlakar: 0,
    ghar_kar: 0,
    audyogik: 0,
    manora: 0
  };
  mapUrl: SafeResourceUrl = '';
  users: any = {
    NAME: '',
    SURNAME: '',
    USERNAME: '',
    DISTRICT_NAME: '',
    TALUKA_NAME: '',
    PANCHAYAT_NAME: ''
  };

  displayedColumns: { key: string; value: string }[] = [

    { key: 'NAME_NAME', value: 'पूर्ण नाव' },

    { key: 'MOBILE_NO', value: 'मोबाईल क्र.' },

    { key: 'DESIGNATION_ID', value: 'पदनाम' }

  ];
  dataSource = new MatTableDataSource<any>([]);
  @Input() totalItems!: number;
  @Input() itemsPerPage = 10;
  pagedDataSource = new MatTableDataSource<any>([]);
  currentPage: number = 0;
  isLoad: boolean = false;

  constructor(private api: ApiService, private spinner: LoaderService, private auth: AuthService, private sanitizer: DomSanitizer) { }
  ngOnInit() {
    this.spinner.show();
    this.token = this.api.getToken();
    this.getUserActivity();
    this.checkIsloggedIn();
    // this.url = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119376.56285906771!2d78.99097527407644!3d21.145799991378873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31ffc39%3A0x9ab2c2b62f4a1e03!2s",this.users.TALUKA,"%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1703001234567!5m2!1sen!2sin&z=12"

  }
  checkIsloggedIn() {
    if (this.auth.isTokenExpired()) {
      this.auth.logout();
    }
  }

  getUserActivity() {
    this.users = this.api.getDecodedToken();
    this.generateMapUrl();

    try {
      this.api.post('get-user-activity', { user_id: this.users?.userId }).subscribe({
        next: (res: any) => {
          // console.log('User Activity:', res.data);
          this.userData = res.data ?? [];
          console.log("this.userData----", this.userData)
          this.getMemberList();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error:-', error.message);
          this.spinner.hide();
        }
      });
    } catch (error) {
      console.log('Error:===', error);
      this.spinner.hide();
    }

  }

  generateMapUrl() {
    // Use Taluka name if available, otherwise use District name, otherwise default to Nagpur
    let location = ''; 
    if(this.users.PANCHAYAT_NAME.trim() === 'डेमो' || this.users.PANCHAYAT_NAME.trim() === 'न्यू डेमो'){
      location = 'Nagpur';
    }else {
      location = this.users.PANCHAYAT_NAME.trim() || this.users.TALUKA_NAME.trim() || this.users.DISTRICT_NAME.trim() || 'Nagpur';
    }
    const searchQuery = `${location}, Maharashtra, India`;

    // Google Maps Embed API URL with dynamic location
    const baseUrl = 'https://www.google.com/maps/embed/v1/place';
    const apiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'; // You may need to replace this with your actual API key

    // Alternative: Using the search-based embed URL (doesn't require API key)
    const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed&z=14`;

    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getMemberList() {
    this.spinner.show();
    this.api.post('get-member-list', { user_id: this.users?.userId }).subscribe({
      next: (res: any) => {
        console.log('Member List:', res.data);
        this.dataSource.data = res.data;
        this.setPageData({ pageIndex: 0, pageSize: 10, length: this.dataSource.data.length });
        this.spinner.hide();
        this.isLoad = true
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error:-', error.message);
        this.spinner.hide();
      }
    });
  }

  onPageChange(event: PageEvent): void {

    this.currentPage = event.pageIndex + 1
    this.setPageData(event);
  }


  setPageData(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedDataSource.data = this.dataSource.data.slice(startIndex, endIndex);
  }
}
