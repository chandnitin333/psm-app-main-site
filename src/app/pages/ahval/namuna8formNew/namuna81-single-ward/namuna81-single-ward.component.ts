import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Namuna8Service } from '../../../../services/namuna8.service';
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader.service';

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
  constructor(private router: Router, private apiService: Namuna8Service, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService) {
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
    this.spinner.show();

    const param = {
                "ward": this.receivedData.ward_no || 0,
                "year": this.receivedData.year || 0,
                "start": this.receivedData.start || 0,
                "end": this.receivedData.end || 0,
                "from_year": this.receivedData.year1 || 0,
                "to_year": this.receivedData.toYear1 || 0,
                 "new_user_id":this.receivedData.new_user_id || null,
            }
    this.apiService.getNamuna81SingleWardNew(param).subscribe({
      next: (res: any) => {
        this.reportData = res.data;
        this.year = this.reportData.yearRs42[0].year
        this.end_year = Number(this.year) + 1;
        console.log('Reponse Data-------------:', this.reportData);
        this.spinner.hide();
      },
      error: (err: Error) => {
        console.error('Error getting for anukramika list :', err);
        this.spinner.hide();
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
    const printContent = document.getElementById('contentToExport');
    if (!printContent) return;
    console.log('printContent', printContent);

    // Clone content for a clean print
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Copy styles
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    // Write content to print window
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Preview</title>
          <style>
            ${styles}
            @page {
              size: A4 landscape;
              margin: 8mm;
            }
            * {
              margin: 0 !important;
              padding: 0 !important;
              box-sizing: border-box !important;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .heading {
              font-size: 12px !important;
              margin-bottom: 2px !important;
              line-height: 1 !important;
            }
            .padding20 {
              margin-bottom: 2px !important;
              font-size: 10px !important;
              line-height: 1 !important;
            }
            .row {
              margin-bottom: 2px !important;
              display: table !important;
              width: 100% !important;
            }
            .font15 {
              font-size: 9px !important;
              line-height: 1 !important;
            }
            .table-responsive {
              margin-top: 3px !important;
              overflow-x: visible !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin-top: 3px !important;
            }
            thead {
              display: table-header-group !important;
            }
            tbody {
              display: table-row-group !important;
            }
            th, td {
              border: 1px solid #000 !important;
              padding: 2px !important;
              word-wrap: break-word;
              font-size: 9px !important;
              text-align: center !important;
            }
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
              padding: 3px 2px !important;
            }
            tr {
              border: 1px solid #000 !important;
              page-break-inside: avoid;
              page-break-after: auto;
            }
            .page-break {
              page-break-before: always;
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait until content fully loads before printing
    printWindow.onload = () => {
      printWindow.focus();

      // Close window after print dialog is closed (whether printed or canceled)
      printWindow.onafterprint = () => {
        printWindow.close();
      };

      printWindow.print();
    };
  }

}
