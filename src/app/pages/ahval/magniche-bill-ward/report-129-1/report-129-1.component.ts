import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MagnicheBillService } from '../../../../services/magniche-bill.service';

@Component({
  selector: 'app-report-129-1',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './report-129-1.component.html',
  styleUrl: './report-129-1.component.css'
})
export class Report1291Component {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    constructor(private router: Router, private apiService: MagnicheBillService, private route: ActivatedRoute, private toastr: ToastrService) {
      const encoded = sessionStorage.getItem('magnicheBillWardReport');
      if (encoded) {
        this.receivedData = JSON.parse(atob(encoded));
        console.log('Encoded Data from sessionStorage:', this.receivedData);
      }else{
        if(this.receivedData.new_user_id == null){
          this.router.navigate(['/magniche-bill-ward']);
        }else{
          this.router.navigate(['/magniche-bill']);
        }
      }
      console.log('Namuna81Component: Received Data via Router', this.receivedData);
    }

    ngOnInit() {
        this.getReportDataAPI();

    }
    getReportDataAPI(){
      const param = {
                  "ward_no": this.receivedData.ward_no || null,
                  "year": this.receivedData.year || null,
                  "start": this.receivedData.start || null,
                  "end": this.receivedData.end || null,
                  "from_year": this.receivedData.from_year || null,
                  "to_year": this.receivedData.to_year || null,
                  "new_user_id": this.receivedData.new_user_id || null,
              }
      this.apiService.getMagnicheBillReport129_1(param).subscribe({
        next: (res: any) => {
          this.reportData = res.data;
          if(this.reportData?.rs3.length === 0 || this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
            // alert('No data found for the selected criteria.');
              this.toastr.error('No data found for the selected criteria.', 'Error');
                // if(this.receivedData.new_user_id == null){
                //   this.router.navigate(['/magniche-bill-ward']);
                // }else{
                  this.router.navigate(['/magniche-bill']);
                // }
          }
          this.year = this.reportData?.yearRs42?.YEAR_ID
          this.end_year = Number(this.year) + 1;
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
        const fileName = `इमलाकर_${currentDate}.pdf`;

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
        const fileName = `इमलाकर_${currentDate}.pdf`;

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
                margin: 10mm 8mm 8mm 8mm;
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
              }
              .heading {
                font-size: 16px !important;
                margin-bottom: 3px !important;
                line-height: 1.2 !important;
              }
              .headingM {
                font-size: 14px !important;
                margin-bottom: 3px !important;
                line-height: 1.2 !important;
              }
              .san {
                font-size: 12px !important;
                line-height: 1.2 !important;
              }
              .padding20 {
                margin-bottom: 3px !important;
                font-size: 12px !important;
                line-height: 1.2 !important;
              }
              .row {
                margin-bottom: 3px !important;
                display: table !important;
                width: 100% !important;
              }
              .container-fluid > .row > .row {
                page-break-after: always !important;
                margin-bottom: 0 !important;
              }
              .font15 {
                font-size: 11px !important;
                line-height: 1.2 !important;
              }
              .table-responsive {
                margin-top: 4px !important;
                overflow-x: visible !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 4px !important;
              }
              thead {
                display: table-header-group !important;
              }
              tbody {
                display: table-row-group !important;
              }
              th, td {
                border: 1px solid #000 !important;
                padding: 4px 3px !important;
                word-wrap: break-word;
                font-size: 11px !important;
                text-align: center !important;
                line-height: 1.3 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
                padding: 5px 3px !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid;
                page-break-after: auto;
              }
              .page-break {
                page-break-before: always;
              }
              .container-fluid {
                width: 95% !important;
                display: block !important;
                clear: both !important;
                margin: 0 auto !important;
                padding: 0 !important;
              }
              .col-md-6 {
                width: 49.5% !important;
                float: left !important;
                padding: 0 4mm !important;
                box-sizing: border-box !important;
              }
              .dotted-border-right {
                border-right: 2px dashed #000 !important;
                margin-right: 0.5% !important;
                padding-right: 4mm !important;
              }
              .col-md-6:last-child {
                padding-left: 4mm !important;
              }
              .col-md-12 {
                width: 100% !important;
              }
              .col-md-4 {
                width: 33.33% !important;
                float: left !important;
              }
              .sign {
                text-align: right !important;
                font-size: 11px !important;
                margin-top: 8px !important;
                padding-top: 5px !important;
              }
              .tip {
                font-size: 10px !important;
                line-height: 1.4 !important;
                margin-top: 3px !important;
                padding: 2px 0 !important;
              }
              .namna {
                text-align: center !important;
                margin-bottom: 4px !important;
                padding-top: 3px !important;
              }
              p {
                font-size: 10px !important;
                line-height: 1.4 !important;
                margin: 3px 0 !important;
                padding: 2px !important;
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
