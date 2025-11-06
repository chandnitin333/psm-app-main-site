import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { ImlakarService } from '../../../../services/imlakar.service';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-imlakar-anukramanika',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './imlakar-anukramanika.component.html',
  styleUrl: './imlakar-anukramanika.component.css'
})
export class ImlakarAnukramanikaComponent {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    constructor(private router: Router, private apiService: ImlakarService, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService) {
      const encoded = sessionStorage.getItem('imlakaranukramanikaFormReport');
      if (encoded) {
        this.receivedData = JSON.parse(atob(encoded));
      }else{
        this.router.navigate(['/imla-kar-form-new']);
      }
      console.log('Namuna81Component: Received Data via Router', this.receivedData);
    }

    ngOnInit() {
        this.getReportDataAPI();

    }
    getReportDataAPI(){
      this.spinner.show();
      const param = {
                  "ward": this.receivedData.ward_no
              }
      this.apiService.imlakarAnukranika(param).subscribe({
        next: (res: any) => {
          this.reportData = res.data;
          if(this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
            // alert('No data found for the selected criteria.');
              this.toastr.error('No data found for the selected criteria.', 'Error');
              this.router.navigate(['/imla-kar-form-new']);
          }
          // console.log('Reponse Data---:', this.reportData);
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
        const fileName = `इमलाकर_अनुक्रमणिका_${currentDate}.pdf`;

        const options = {
          filename: fileName,
          margin: [15, 15, 15, 15],
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
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
        const fileName = `इमलाकर_अनुक्रमणिका_${currentDate}.pdf`;

        const options = {
          filename: fileName,
          margin: [15, 15, 15, 15],
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
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

    printDirect() {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('Unable to open print window');
        return;
      }

      const element = document.getElementById('contentToExport');
      if (!element) {
        console.error('Element contentToExport not found');
        return;
      }

      const clonedContent = element.cloneNode(true) as HTMLElement;

      // Copy all stylesheets
      const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join('\n');
          } catch (e) {
            console.warn('Could not access stylesheet:', e);
            return '';
          }
        })
        .join('\n');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>इमलाकर अनुक्रमणिका</title>
            <style>
              ${styles}

              /* Print-specific styles */
              @page {
                size: A4 portrait;
                margin: 8mm;
              }

              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }

              body {
                font-family: 'Noto Sans Devanagari', Arial, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color: #000;
                background: white;
              }

              #contentToExport {
                width: 100%;
                padding: 3px !important;
              }

              table {
                width: 100% !important;
                border-collapse: collapse !important;
                page-break-inside: avoid;
                font-size: 9px !important;
              }

              th, td {
                border: 1px solid #000 !important;
                padding: 2px !important;
                font-size: 9px !important;
                text-align: center !important;
                vertical-align: middle !important;
                word-wrap: break-word;
              }

              th {
                font-weight: bold !important;
                background: #f2f2f2 !important;
              }

              .heading {
                text-align: center !important;
                font-size: 12px !important;
                font-weight: bold !important;
                padding: 0 !important;
                margin: 0 0 2px 0 !important;
                line-height: 1 !important;
              }

              .san {
                text-align: center !important;
                font-size: 10px !important;
                padding: 0 !important;
                margin: 0 0 2px 0 !important;
                line-height: 1 !important;
              }

              .font15 {
                font-size: 9px !important;
                font-weight: bold !important;
                line-height: 1 !important;
              }

              .left {
                text-align: left !important;
                float: left;
              }

              .center {
                text-align: center !important;
              }

              .center.tahsil {
                text-align: center !important;
                margin-left: 0 !important;
              }

              .right {
                text-align: right !important;
                float: right;
              }

              .hidden-print, button {
                display: none !important;
              }

              thead {
                display: table-header-group !important;
              }

              tbody {
                display: table-row-group !important;
              }

              tr {
                page-break-inside: avoid !important;
              }

              .table-responsive {
                overflow: visible !important;
              }

              .col-md-4 {
                width: 33.33% !important;
                float: left;
                padding: 0 5px !important;
              }

              .col-md-4:nth-child(1) {
                text-align: left !important;
              }

              .col-md-4:nth-child(2) {
                text-align: center !important;
              }

              .col-md-4:nth-child(2) span {
                float: none !important;
                display: inline-block !important;
              }

              .col-md-4:nth-child(3) {
                text-align: right !important;
              }

              .row {
                width: 100% !important;
                clear: both;
                padding: 2px 0 !important;
              }

              .header-row {
                margin-bottom: 5px !important;
              }

              .header-row .col-md-4:nth-child(1) {
                text-align: left !important;
              }

              .header-row .col-md-4:nth-child(2) {
                text-align: center !important;
              }

              .header-row .col-md-4:nth-child(2) span {
                float: none !important;
                display: inline-block !important;
              }

              .header-row .col-md-4:nth-child(3) {
                text-align: right !important;
              }

              .row::after {
                content: "";
                display: table;
                clear: both;
              }
            </style>
          </head>
          <body>
            ${clonedContent.outerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load before printing
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
