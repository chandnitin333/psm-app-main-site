import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { CommonDialogModule } from './modules/common-dialog/common-dialog.module';
import { ApiService } from './services/api.service';
import { HttpHeaderInterceptor } from './utils/http.interceptor';

// 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes), provideAnimationsAsync(), {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true

    },
    ApiService,
    MatDialogModule,
    CommonDialogModule
  ],

};


