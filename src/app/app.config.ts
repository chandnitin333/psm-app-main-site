import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { HttpHeaderInterceptor } from './http-header.interceptor';
import { CommonDialogModule } from './modules/common-dialog/common-dialog.module';
import { ApiService } from './services/api.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(), // Ensure this is included
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true, // Required for multiple interceptors
    },
    importProvidersFrom(HttpClientModule, MatDialogModule),
    importProvidersFrom(CommonDialogModule),
    ApiService,
  ],
};

