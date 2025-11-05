import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="loader-overlay" *ngIf="loading$ | async">
      <div class="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  `,
    styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .bouncing-loader {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .bouncing-loader > div {
      width: 20px;
      height: 20px;
      background-color: #ffffff;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }

    .bouncing-loader > div:nth-child(1) {
      animation-delay: -0.32s;
    }

    .bouncing-loader > div:nth-child(2) {
      animation-delay: -0.16s;
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `]
})
export class LoaderComponent {
    loading$ = this.loaderService.loading$;

    constructor(private loaderService: LoaderService) { }
}