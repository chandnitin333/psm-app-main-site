import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Namuna8Service } from '../../../../services/namuna8.service';
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-namuna81-single-ward',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
  templateUrl: './namuna81-single-ward.component.html',
  styleUrl: './namuna81-single-ward.component.css'
})
export class Namuna81SingleWardComponent {
  receivedData : any;
  reportData: any;
  ward_number: any;
  public year: number = 0;
  public end_year: number = 0;
  constructor(private router: Router, private apiService: Namuna8Service, private route: ActivatedRoute, private toastr: ToastrService) {
    const encoded = sessionStorage.getItem('namuna81SingleWardForm');
    if (encoded) {
      this.receivedData = JSON.parse(atob(encoded));
    }else{
      this.router.navigate(['/namuna-8-form-new']);
    }
    console.log('Namuna81Component: Received Data via Router', this.receivedData);
  }

   ngOnInit() {
      this.getReportDataAPI();
      

  }
  getReportDataAPI(){
    const param = {
                "ward": this.receivedData.ward_no,
                "year": this.receivedData.year,
                "start": this.receivedData.start,
                "end": this.receivedData.end,
                "from_year": this.receivedData.year1,
                "to_year": this.receivedData.toYear1
            }
    this.apiService.getNamuna81SingleWardNew(param).subscribe({
      next: (res: any) => {
        this.reportData = res.data;
        this.year = this.reportData.yearRs42[0].year
        this.end_year = Number(this.year) + 1;
        console.log('Reponse Data:', this.reportData);
      },
      error: (err: Error) => {
        console.error('Error getting for anukramika list :', err);
      },
    });
  }
  @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault(); // Prevent default browser print
        this.printDirect(); // Use direct browser print with our styles
      }
    }

  // Direct browser print - uses @media print CSS
  printDirect() {
    // Add print-specific styles before printing
    const style = document.createElement('style');
    style.id = 'print-style';
    style.innerHTML = `
      @media print {
        @page {
          size: A4 landscape;
          margin: 5mm;
        }
        body * {
          visibility: hidden;
        }
        #contentToExport, #contentToExport * {
          visibility: visible;
        }
        #contentToExport {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);

    // Print
    window.print();

    // Clean up
    setTimeout(() => {
      const styleElement = document.getElementById('print-style');
      if (styleElement) {
        styleElement.remove();
      }
    }, 1000);
  }

}
