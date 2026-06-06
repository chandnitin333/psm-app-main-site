import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = 'http://gramvikas.co.in/api';
  public file_baseUrl: string = 'http://gramvikas.co.in/uploads/';
  // public file_baseUrl: string = 'http://localhost:4444/uploads/';
  // public  baseUrl: string = 'http://localhost:4444/api';
  constructor(private http: HttpClient, private router: Router) {
    console.log('ApiService');
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  // POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError(error => {
        console.error('Error:====', error);
        return throwError(error);

      })
    );
  }
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
        const token = localStorage.getItem('token');

        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // ⚠️ Do NOT set 'Content-Type'; browser handles multipart boundary
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }

        const data: T = await response.json();
        return data;
    }




  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 409) {
        errorMessage = 'Conflict: The request could not be completed due to a conflict with the current state of the target resource.';
      }
    }
    return throwError(errorMessage);
  }

  // DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }


  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): any {

    let token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);

      } catch (Error) {
        console.error('Invalid token');
        return null;
      }
    }
    return null;
  }
  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    return !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }

    // Get current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token has expired
    return decodedToken.exp < currentTime;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('randomNumber');
    localStorage.removeItem('rno');
    this.router.navigate(['login']);
  }

}
