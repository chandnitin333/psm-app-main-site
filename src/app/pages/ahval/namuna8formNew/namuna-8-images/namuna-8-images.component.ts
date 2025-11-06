import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ImlakarService } from '../../../../services/imlakar.service';
import { Namuna8Service } from '../../../../services/namuna8.service';
import { ApiService } from '../../../../services/api.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-namuna-8-images',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './namuna-8-images.component.html',
  styleUrl: './namuna-8-images.component.css'
})
export class Namuna8ImagesComponent {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    file_baseUrl= "";
    isMobileDevice: boolean = false;
    constructor(private router: Router, private apiService: Namuna8Service, private route: ActivatedRoute, private toastr: ToastrService, private api: ApiService, private spinner: LoaderService) {
      const encoded = sessionStorage.getItem('namuna8imgaesform');
      this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (encoded) {
        this.receivedData = JSON.parse(atob(encoded));
      }else{
        this.router.navigate(['/namuna-8-form-new']);
      }
      console.log('Namuna81Component: Received Data via Router', this.receivedData);
    }

    ngOnInit() {
        this.getReportDataAPI();
        this.file_baseUrl= this.api.file_baseUrl;

    }
    getReportDataAPI(){
      // Show loader before API call
      this.spinner.show();

      const param =
              {
                "ward": this.receivedData.ward_no || 0,
                "year":this.receivedData.year || 0,
                "start": this.receivedData.start || 0,
                "end":this.receivedData.end || 0,
                "new_user_id":this.receivedData.new_user_id || null,
                "from_year":this.receivedData.year1 || 0,
                "to_year":this.receivedData.toYear1 || 0,
            }
      this.apiService.getNamuna8Images(param).subscribe({
        next: (res: any) => {
          this.reportData = res.data;
          // console.log('Reponse Data---:', this.reportData);
          this.year = this.reportData.yearRs42[0].year
          this.end_year = Number(this.year) + 1;
          if( this.reportData?.from_to_year?.from_year === 0 && this.reportData?.from_to_year?.to_year === 0){
            this.reportData.from_to_year.from_year = Number(this.year) + 3;
            this.reportData.from_to_year.to_year = Number(this.year) + 4;
          }
          // console.log('Reponse Data-------------:', this.reportData);
          if(this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
            // alert('No data found for the selected criteria.');
              this.toastr.error('No data found for the selected criteria.', 'Error');
              this.router.navigate(['/imla-kar-form-new']);
          }

          // Hide loader after data is loaded
          this.spinner.hide();
        },
        error: (err: Error) => {
          console.error('Error getting for anukramika list :', err);

          // Hide loader on error
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

    // Direct browser print - uses @media print CSS with landscape orientation
    printDirect() {
      const printContent = document.getElementById('contentToExport');
      if (!printContent) return;

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
                margin: 12mm 15mm;
              }
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
              body {
                margin: 0 !important;
                padding: 0 !important;
              }
              p {
                margin: 0 !important;
                padding: 0 !important;
              }
              div {
                margin: 0 !important;
                padding: 0 !important;
              }
              span {
                margin: 0 !important;
                padding: 0 !important;
              }
              .container-fluid {
                padding: 0 !important;
                margin: 0 !important;
              }
              #contentToExport {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .page-break {
                page-break-before: always !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .page-break:first-child {
                page-break-before: avoid !important;
              }
              .heading {
                font-size: 15px !important;
                margin-bottom: 3px !important;
                line-height: 1.3 !important;
                padding-top: 0 !important;
                font-weight: bold !important;
              }
              .san {
                font-size: 12px !important;
                margin-bottom: 3px !important;
                line-height: 1.3 !important;
              }
              .font15 {
                font-size: 10px !important;
                line-height: 1.3 !important;
                white-space: nowrap !important;
              }
              .col-md-12 {
                padding: 0 !important;
                margin: 0 !important;
              }
              .col-md-4 {
                display: table-cell !important;
                width: 33.33% !important;
                vertical-align: middle !important;
                padding: 0 !important;
              }
              .col-md-4:nth-child(1) {
                text-align: left !important;
              }
              .col-md-4:nth-child(2) {
                text-align: center !important;
              }
              .col-md-4:nth-child(3) {
                text-align: right !important;
              }
              .col-md-4 span {
                display: block !important;
                width: 100% !important;
              }
              .col-md-4:nth-child(1) span,
              .col-md-4:nth-child(1) .font15 {
                text-align: left !important;
              }
              .col-md-4:nth-child(2) span,
              .col-md-4:nth-child(2) .font15,
              .center.tahsil span,
              .center.tahsil .font15 {
                text-align: center !important;
                display: block !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                padding-left: 100px !important;
              }
              .col-md-4:nth-child(3) span,
              .col-md-4:nth-child(3) .font15 {
                text-align: right !important;
              }
              .col-md-8 {
                display: table-cell !important;
                width: 66.66% !important;
                padding: 0 !important;
              }
              .col-md-4 .font15.right,
              .col-md-4 > span.right {
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .row {
                margin-bottom: 3px !important;
                display: table !important;
                width: 100% !important;
                table-layout: fixed !important;
              }
              .left {
                float: none !important;
                text-align: left !important;
                display: block !important;
              }
              .center,
              .center.tahsil {
                text-align: center !important;
                margin-left: 0 !important;
                display: block !important;
              }
              .right {
                float: none !important;
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .font15.left {
                text-align: left !important;
              }
              .font15.right {
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .table-responsive {
                margin-top: 3px !important;
                overflow-x: visible !important;
                padding: 0 !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin: 0 !important;
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
                padding: 3px 3px !important;
                word-wrap: break-word;
                font-size: 9px !important;
                text-align: center !important;
                line-height: 1.3 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
                padding: 4px 3px !important;
                font-size: 10px !important;
              }
              tr[style*="font-weight:bold"] td,
              td b,
              td strong {
                font-weight: bold !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid !important;
              }
              .heading,
              .row {
                page-break-inside: avoid !important;
              }
              .page-break {
                page-break-inside: avoid !important;
              }
              table {
                page-break-inside: avoid !important;
              }
              .table-responsive {
                page-break-inside: avoid !important;
              }
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
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

    downloadPDF() {
      const element = document.getElementById('contentToExport');
      if (element) {
        // Apply compact table style
        element.classList.add('pdf-export-style');

        const currentDate = new Date().toLocaleString('en-US', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        const fileName = `नमुना_८_images_${currentDate}.pdf`;

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
        const fileName = `नमुना_८_images_${currentDate}.pdf`;

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
    downloadPDFMobile() {
    const printContent = document.getElementById('contentToExport');
    if (!printContent) {
      this.toastr.error('Content not found', 'Error');
      return;
    }

    this.toastr.info('PDF तयार करत आहे...', 'कृपया प्रतीक्षा करा', {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: true
    });

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentDate = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
    const fileName = `namuna_8_images_${currentDate}.pdf`;

    // Copy all styles
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

    // Create complete HTML with styles
    const htmlContent = `
      <html>
          <head>
            <title>Print Preview</title>
            <style>
              ${styles}
              @page {
                size: A4 landscape;
                margin: 12mm 15mm;
              }
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
              body {
                margin: 0 !important;
                padding: 0 !important;
              }
              p {
                margin: 0 !important;
                padding: 0 !important;
              }
              div {
                margin: 0 !important;
                padding: 0 !important;
              }
              span {
                margin: 0 !important;
                padding: 0 !important;
              }
              .container-fluid {
                padding: 0 !important;
                margin: 0 !important;
              }
              #contentToExport {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .page-break {
                page-break-before: always !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .page-break:first-child {
                page-break-before: avoid !important;
              }
              .heading {
                font-size: 15px !important;
                margin-bottom: 3px !important;
                line-height: 1.3 !important;
                padding-top: 0 !important;
                font-weight: bold !important;
              }
              .san {
                font-size: 12px !important;
                margin-bottom: 3px !important;
                line-height: 1.3 !important;
              }
              .font15 {
                font-size: 10px !important;
                line-height: 1.3 !important;
                white-space: nowrap !important;
              }
              .col-md-12 {
                padding: 0 !important;
                margin: 0 !important;
              }
              .col-md-4 {
                display: table-cell !important;
                width: 33.33% !important;
                vertical-align: middle !important;
                padding: 0 !important;
              }
              .col-md-4:nth-child(1) {
                text-align: left !important;
              }
              .col-md-4:nth-child(2) {
                text-align: center !important;
              }
              .col-md-4:nth-child(3) {
                text-align: right !important;
              }
              .col-md-4 span {
                display: block !important;
                width: 100% !important;
              }
              .col-md-4:nth-child(1) span,
              .col-md-4:nth-child(1) .font15 {
                text-align: left !important;
              }
              .col-md-4:nth-child(2) span,
              .col-md-4:nth-child(2) .font15,
              .center.tahsil span,
              .center.tahsil .font15 {
                text-align: center !important;
                display: block !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                padding-left: 100px !important;
              }
              .col-md-4:nth-child(3) span,
              .col-md-4:nth-child(3) .font15 {
                text-align: right !important;
              }
              .col-md-8 {
                display: table-cell !important;
                width: 66.66% !important;
                padding: 0 !important;
              }
              .col-md-4 .font15.right,
              .col-md-4 > span.right {
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .row {
                margin-bottom: 3px !important;
                display: table !important;
                width: 100% !important;
                table-layout: fixed !important;
              }
              .left {
                float: none !important;
                text-align: left !important;
                display: block !important;
              }
              .center,
              .center.tahsil {
                text-align: center !important;
                margin-left: 0 !important;
                display: block !important;
              }
              .right {
                float: none !important;
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .font15.left {
                text-align: left !important;
              }
              .font15.right {
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .table-responsive {
                margin-top: 3px !important;
                overflow-x: visible !important;
                padding: 0 !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin: 0 !important;
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
                padding: 3px 3px !important;
                word-wrap: break-word;
                font-size: 9px !important;
                text-align: center !important;
                line-height: 1.3 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
                padding: 4px 3px !important;
                font-size: 10px !important;
              }
              tr[style*="font-weight:bold"] td,
              td b,
              td strong {
                font-weight: bold !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid !important;
              }
              .heading,
              .row {
                page-break-inside: avoid !important;
              }
              .page-break {
                page-break-inside: avoid !important;
              }
              table {
                page-break-inside: avoid !important;
              }
              .table-responsive {
                page-break-inside: avoid !important;
              }
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            ${printContent.outerHTML}
          </body>
        </html>
    `;

    // Create a blob from the HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.pdf', '.html'); // Download as HTML first
    link.style.display = 'none';
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.toastr.clear();
    this.toastr.success('फाईल डाउनलोड झाली! ब्राउझरमध्ये उघडून Print > Save as PDF करा', 'यशस्वी', {
      timeOut: 8000,
      closeButton: true
    });
  
  }
}
