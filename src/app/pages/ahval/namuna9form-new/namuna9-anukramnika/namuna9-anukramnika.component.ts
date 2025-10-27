import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Namuna8Service } from '../../../../services/namuna8.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import html2pdf from 'html2pdf.js';
import { Namuna9Service } from '../../../../services/namuna9.service';

@Component({
  selector: 'app-namuna9-anukramnika',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './namuna9-anukramnika.component.html',
  styleUrl: './namuna9-anukramnika.component.css'
})
export class Namuna9AnukramnikaComponent {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    constructor(private router: Router, private apiService: Namuna9Service, private route: ActivatedRoute, private toastr: ToastrService) {
      const encoded = sessionStorage.getItem('Namuna9anukramanika');
      if (encoded) {
        this.receivedData = JSON.parse(atob(encoded));
      }else{
        this.router.navigate(['/namuna-9-form-new']);
      }
      console.log('Namuna81Component: Received Data via Router', this.receivedData);
    }

    ngOnInit() {
        this.getReportDataAPI();

    }
    getReportDataAPI(){
      const param =   
              {
                "ward": this.receivedData.ward_no,
                "year":this.receivedData.year,
                "start": this.receivedData.start,
                "end":this.receivedData.end
            }
      this.apiService.getAnukramikaData(param).subscribe({
        next: (res: any) => {
          this.reportData = res.data;
          // this.year = this.reportData.yearRs42[0].year
          // this.end_year = Number(this.year) + 1;
          if(this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
            // alert('No data found for the selected criteria.');
              this.toastr.error('No data found for the selected criteria.', 'Error');
              this.router.navigate(['/namuna-9-form-new']);
          }
          console.log('Reponse Data---:', this.reportData);
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
      const printContent = document.getElementById('contentToExport');
      if (!printContent) return;

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
                size: A4 portrait;
                margin: 15mm 10mm 12mm 15mm;
              }
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                padding-top: 5mm !important;
                padding-left: 3mm !important;
              }
              .container-fluid {
                padding-bottom: 8mm !important;
                padding-top: 3mm !important;
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
                font-size: 11px !important;
                line-height: 1.2 !important;
              }
              .table-responsive {
                margin-top: 3px !important;
                margin-bottom: 0mm !important;
                overflow-x: visible !important;
                padding-bottom: 0mm !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 3px !important;
                margin-bottom: 0mm !important;
              }
              thead {
                display: table-header-group !important;
              }
              tbody {
                display: table-row-group !important;
              }
              th, td {
                border: 1px solid #000 !important;
                padding: 4px !important;
                word-wrap: break-word;
                font-size: 11px !important;
                text-align: center !important;
                line-height: 1.3 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #fff !important;
                padding: 5px 4px !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid;
                page-break-after: auto;
              }
              .col-md-4 {
                display: table-cell !important;
                width: 33.33% !important;
                padding: 2px !important;
              }
              .center {
                text-align: center !important;
              }
              .left {
                text-align: left !important;
              }
              .right {
                text-align: right !important;
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
