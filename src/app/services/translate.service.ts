import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  API_KEY: string = 'AIzaSyBrLrbsAKHbNDyULhWqF8MYTi7jMNKSL1g';
  API_URL: string = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyBrLrbsAKHbNDyULhWqF8MYTi7jMNKSL1g`;
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
