import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Namuna9Service } from '../../../../services/namuna9.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-namuna9-new',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './namuna9-new.component.html',
  styleUrl: './namuna9-new.component.css'
})
export class Namuna9NewComponent {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    isMobileDevice: boolean = false;
    constructor(private router: Router, private apiService: Namuna9Service, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService) {
      const encoded = sessionStorage.getItem('namuna9New');
      this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
      this.apiService.getNamuna9New(param).subscribe({
        next: (res: any) => {
          this.reportData = res.data;
          this.year = this.reportData.yearRs10[0].year
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
        <meta charset="UTF-8">
        <title>Print Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * {
            font-family: 'Noto Sans Devanagari', Arial, sans-serif !important;
          }
            ${styles}
            @page {
              size: A4 landscape;
              margin: 10mm 12mm;
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
            .heading {
              font-size: 14px !important;
              margin-bottom: 2px !important;
              line-height: 1.3 !important;
              padding-top: 0 !important;
              font-weight: bold !important;
            }
            .san {
              font-size: 11px !important;
              margin-bottom: 2px !important;
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
            }
            .col-md-4:nth-child(3) span,
            .col-md-4:nth-child(3) .font15 {
              text-align: right !important;
            }
            .col-md-4 .font15.right,
            .col-md-4 > span.right {
              text-align: right !important;
              display: block !important;
              width: 100% !important;
            }
            .row {
              margin-bottom: 2px !important;
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
              margin-top: 2px !important;
            }
            thead {
              display: table-header-group !important;
            }
            tbody {
              display: table-row-group !important;
            }
            th, td {
              border: 1px solid #000 !important;
              padding: 2px 2px !important;
              word-wrap: break-word;
              font-size: 9px !important;
              text-align: center !important;
              line-height: 1.2 !important;
            }
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
              padding: 3px 2px !important;
              font-size: 9px !important;
            }
            tr {
              border: 1px solid #000 !important;
              page-break-inside: avoid !important;
            }
            .heading,
            .row {
              page-break-inside: avoid !important;
            }
            .nobreak {
              page-break-inside: avoid !important;
            }
            table {
              page-break-inside: auto !important;
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
    const fileName = `namuna9_new_${currentDate}.pdf`;

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
        <meta charset="UTF-8">
        <title>Print Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * {
            font-family: 'Noto Sans Devanagari', Arial, sans-serif !important;
          }
            ${styles}
            @page {
              size: A4 landscape;
              margin: 10mm 12mm;
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
            .heading {
              font-size: 14px !important;
              margin-bottom: 2px !important;
              line-height: 1.3 !important;
              padding-top: 0 !important;
              font-weight: bold !important;
            }
            .san {
              font-size: 11px !important;
              margin-bottom: 2px !important;
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
            }
            .col-md-4:nth-child(3) span,
            .col-md-4:nth-child(3) .font15 {
              text-align: right !important;
            }
            .col-md-4 .font15.right,
            .col-md-4 > span.right {
              text-align: right !important;
              display: block !important;
              width: 100% !important;
            }
            .row {
              margin-bottom: 2px !important;
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
              margin-top: 2px !important;
            }
            thead {
              display: table-header-group !important;
            }
            tbody {
              display: table-row-group !important;
            }
            th, td {
              border: 1px solid #000 !important;
              padding: 2px 2px !important;
              word-wrap: break-word;
              font-size: 9px !important;
              text-align: center !important;
              line-height: 1.2 !important;
            }
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
              padding: 3px 2px !important;
              font-size: 9px !important;
            }
            tr {
              border: 1px solid #000 !important;
              page-break-inside: avoid !important;
            }
            .heading,
            .row {
              page-break-inside: avoid !important;
            }
            .nobreak {
              page-break-inside: avoid !important;
            }
            table {
              page-break-inside: auto !important;
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
