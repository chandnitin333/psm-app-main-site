import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Set common headers
    let token = localStorage.getItem('token');
    const modifiedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Handle errors
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
       
        let customResponse: HttpResponse<any>;
        switch (error.status) {
        
          case 400:
            // Handle 400 - Bad Request
            customResponse = new HttpResponse({
              body: { message: 'Bad Request: Invalid input', status: 400 },
              status: 200,
            });
            break;
          case 419:
            // Handle 419 - Session Expired
            customResponse = new HttpResponse({
              body: { message: 'Session expired, please log in again', status: 419 },
              status: 200,
            });
            break;
          case 500:
            // Handle 500 - Internal Server Error
            customResponse = new HttpResponse({
              body: { message: 'Internal server error, please try again later', status: 500 },
              status: 200,
            });
            break;
          default:
            // Handle other errors if needed
            customResponse = new HttpResponse({
              body: { message: error?.error?.message || 'Unknown Error', errorCode: error.status },
              status: 200,
            });
        }

        // Return the custom response as a successful response
        return of(customResponse);
      })
    );
  }
}
