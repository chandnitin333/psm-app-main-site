import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  API_KEY: string = 'AIzaSyCsQc4fLXZfZcSU00oHFdGWOZG4qiq7af8';
  API_URL: string = `https://translation.googleapis.com/language/translate/v2?key=${this.API_KEY}`;
  constructor(private http: HttpClient) { }

  translate(text: string): Observable<any> {
 
    return this.http.post(this.API_URL, {
      q: text,
      source: 'en',
      target: 'mr',
      format: 'text'
    });
  }


}
