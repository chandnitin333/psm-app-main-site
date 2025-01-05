import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    template: `
    <div class="loader-overlay" *ngIf="loading$ | async">
      <mat-spinner ></mat-spinner>
    </div>
  `,
    styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
  `]
})
export class LoaderComponent {
    loading$ = this.loaderService.loading$;

    constructor(private loaderService: LoaderService) { }
}