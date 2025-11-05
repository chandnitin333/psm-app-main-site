import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Namuna8Service } from '../../../../services/namuna8.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-namuna-8-sarkari-ward',
  standalone: true,
  imports: [CommonModule,ToastrModule ],
  templateUrl: './namuna-8-sarkari-ward.component.html',
  styleUrl: './namuna-8-sarkari-ward.component.css'
})
export class Namuna8SarkariWardComponent {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    constructor(private router: Router, private apiService: Namuna8Service, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService) {
      const encoded = sessionStorage.getItem('namuna8sarkari');
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

      const param =
              {
                "ward": this.receivedData.ward_no,
                "year":this.receivedData.year,
                "start": this.receivedData.start,
                "end":this.receivedData.end
            }
      this.apiService.getNamuna8sarkariWard(param).subscribe({
        next: (res: any) => {
          this.reportData = res.data;
          // this.year = this.reportData.yearRs42[0].year
          // this.end_year = Number(this.year) + 1;
          if(this.reportData?.rs14 === undefined || this.reportData?.rs14 === null){
            // alert('No data found for the selected criteria.');
              this.toastr.error('No data found for the selected criteria.', 'Error');
              this.router.navigate(['/namuna-8-form-new']);
          }
          console.log('Reponse Data---:', this.reportData);
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
        const fileName = `नमुना_८_सरकारी_${currentDate}.pdf`;

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
        const fileName = `नमुना_८_सरकारी_${currentDate}.pdf`;

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
                font-size: 16px !important;
                margin-bottom: 2px !important;
                line-height: 1.2 !important;
                text-align: center !important;
                font-weight: bold !important;
              }
              .font15 {
                font-size: 12px !important;
                line-height: 1.2 !important;
                font-weight: bold !important;
                margin-bottom: 2px !important;
              }
              .container-fluid {
                width: 98% !important;
                display: block !important;
                margin: 0 auto !important;
                padding: 0 !important;
              }
              .row {
                margin-bottom: 2px !important;
                display: block !important;
                width: 100% !important;
                clear: both !important;
              }
              .col-md-12 {
                width: 100% !important;
                display: block !important;
              }
              .table-responsive {
                margin-top: 2px !important;
                margin-bottom: 5mm !important;
                overflow-x: visible !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 2px !important;
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
                padding: 3px 2px !important;
                word-wrap: break-word;
                font-size: 10px !important;
                text-align: center !important;
                line-height: 1.3 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid;
              }
              .namna {
                text-align: center !important;
              }
              br {
                display: block !important;
                content: "" !important;
                margin: 2px 0 !important;
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
