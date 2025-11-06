import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { Namuna9Service } from '../../../../services/namuna9.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-namuna9',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './namuna9.component.html',
  styleUrl: './namuna9.component.css'
})
export class Namuna9Component {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    constructor(private router: Router, private apiService: Namuna9Service, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService) {
      const encoded = sessionStorage.getItem('namuna9');
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
      this.spinner.show();
      const param =   
              {
                "ward": this.receivedData.ward_no,
                "year":this.receivedData.year,
                "start": this.receivedData.start,
                "end":this.receivedData.end
            }
      this.apiService.getNamuna9WardNew(param).subscribe({
        next: (res: any) => {
          this.reportData = res.data;
          this.year = this.reportData.yearRs42[0].year
          this.end_year = Number(this.year) + 1;
          if(this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
            // alert('No data found for the selected criteria.');
              this.toastr.error('No data found for the selected criteria.', 'Error');
              this.router.navigate(['/namuna-9-form-new']);
          }
          // console.log('Reponse Data---:', this.reportData);
          this.spinner.hide();
        },
        error: (err: Error) => {
          this.spinner.hide();
          console.error('Error getting for anukramika list :', err);
        },
      });
    }
    @HostListener('window:keydown', ['$event'])
      handleKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 'p') {
          event.preventDefault(); // Prevent browser print dialog
          this.printDirect();
        }
      }

    downloadPDF() {
      const element = document.getElementById('contentToExport');
      if (element) {
        // Apply compact table style
        element.classList.add('pdf-export-style');

        const currentDate = new Date().toLocaleString('en-US', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        const fileName = `नमुना_नमुना_९_${currentDate}.pdf`;

        const options = {
          filename: fileName,
          margin: [15, 15, 15, 15],
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf()
          .set(options)
          .from(element)
          .toPdf()
          .save()
          .then(() => {
            // Clean up: remove the class after saving
            element.classList.remove('pdf-export-style');
          });
      }
    }

  
      downloadAndPreviewPDF() {
      const element = document.getElementById('contentToExport');
      if (element) {
        // Temporarily apply print-specific styles
        element.classList.add('pdf-export-style');

        const currentDate = new Date().toLocaleString('en-US', { 
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });
        const fileName = `नमुना_९_${currentDate}.pdf`;

        const options = {
          filename: fileName,
          margin: [15, 15, 15, 15],
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf()
          .set(options)
          .from(element)
          .toPdf()
          .get('pdf')
          .then((pdf: any) => {
            // remove style class after export
            element.classList.remove('pdf-export-style');

            const blob = pdf.output('blob');
            const blobURL = URL.createObjectURL(blob);
            const previewWindow = window.open(blobURL, '_blank');

            setTimeout(() => {
              previewWindow?.print();
            }, 500);
          });
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
                margin: 8mm 10mm 8mm 10mm;
              }
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                padding-top: 3mm !important;
              }
              .heading {
                font-size: 18px !important;
                margin-bottom: 4px !important;
                line-height: 1.4 !important;
                text-align: center !important;
                font-weight: bold !important;
              }
              .san {
                font-size: 14px !important;
                line-height: 1.4 !important;
                text-align: center !important;
                margin-bottom: 4px !important;
              }
              .font15 {
                font-size: 13px !important;
                line-height: 1.4 !important;
                font-weight: bold !important;
                margin-bottom: 3px !important;
              }
              .container-fluid {
                width: 98% !important;
                display: block !important;
                margin: 0 auto !important;
                padding: 0 !important;
              }
              .row {
                margin-bottom: 4px !important;
                display: block !important;
                width: 100% !important;
                clear: both !important;
              }
              .col-md-12 {
                width: 100% !important;
                display: block !important;
                margin-bottom: 3px !important;
              }
              .col-md-4 {
                width: 33.33% !important;
                float: left !important;
              }
              .left {
                text-align: left !important;
              }
              .center {
                text-align: center !important;
              }
              .right {
                text-align: right !important;
              }
              .table-responsive {
                margin-top: 3px !important;
                margin-bottom: 0px !important;
                overflow-x: visible !important;
              }
              .pagebr {
                page-break-after: always !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 3px !important;
                margin-bottom: 0px !important;
              }
              thead {
                display: table-header-group !important;
              }
              tbody {
                display: table-row-group !important;
              }
              th, td {
                border: 1px solid #000 !important;
                padding: 5px 4px !important;
                word-wrap: break-word;
                font-size: 12px !important;
                text-align: center !important;
                line-height: 1.5 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
                padding: 7px 4px !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid;
              }
              p {
                font-size: 13px !important;
                line-height: 1.5 !important;
                margin: 3px 0 !important;
                padding: 2px !important;
              }
              br {
                display: none !important;
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
