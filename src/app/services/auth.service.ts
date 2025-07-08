import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { API_URL } from '../../constant/admin.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  login({ username, password, district_id, taluka_id, panchayat_id }: any): Observable<any> {
    if (username !== '' && password !== '') {
      console.log('login===', +`${API_URL}sign-in`);
      this.http.post<any>(`${API_URL}sign-in`, { username: username, password: password, user_type: 'new_user', district_id: district_id, taluka_id: taluka_id, panchayat_id: panchayat_id }).subscribe((res) => {

        if (!res?.data?.token) {
          this.router.navigate(['login']);
        }
        // console.log('Login Response------:', res?.data?.RandomNumber, res?.data?.RNO);
        localStorage.setItem('randomNumber', res?.data?.RandomNumber);
        localStorage.setItem('rno', res?.data?.RNO);
        this.setToken(res?.data?.token);
        this.router.navigate(['home']);
      });
    } else {
      this.router.navigate(['login']);
      return throwError(new Error('Failed to login'));
    }
    return new Observable<any>();
  }
}
