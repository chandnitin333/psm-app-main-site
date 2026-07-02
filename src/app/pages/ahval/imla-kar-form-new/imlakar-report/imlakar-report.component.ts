import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImlakarService } from '../../../../services/imlakar.service';
import html2pdf from 'html2pdf.js';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportQrComponent } from '../../../../components/report-qr/report-qr.component';
import { ReportLinkService } from '../../../../services/report-link.service';

@Component({
  selector: 'app-imlakar-report',
  standalone: true,
  imports: [CommonModule,ToastrModule,ReportQrComponent],
  templateUrl: './imlakar-report.component.html',
  styleUrl: './imlakar-report.component.css'
})
export class ImlakarReportComponent {
  receivedData : any;
  reportData: any;
  ward_number: any;
  public year: number = 0;
  public end_year: number = 0;
  isMobileDevice: boolean = false;
  isPublic: boolean = false;
  publicToken: string = '';
  reportParams: any = null;
  perRecordQrUrl: { [id: string]: string } = {};
  constructor(private router: Router, private apiService: ImlakarService, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService, private reportLink: ReportLinkService) {
    this.publicToken = this.route.snapshot.paramMap.get('token') || '';
    this.isPublic = !!this.publicToken;
    this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (this.isPublic) return;   // public view rebuilds from the token
    const encoded = sessionStorage.getItem('imlakarFormReport');
    if (encoded) {
      this.receivedData = JSON.parse(atob(encoded));
    }else{
      this.router.navigate(['/imla-kar-form-new']);
    }
    console.log('Namuna81Component: Received Data via Router', this.receivedData);
  }

   ngOnInit() {
      if (this.isPublic) {
        this.getPublicReportDataAPI();
      } else {
        this.getReportDataAPI();
      }
  }

  getPublicReportDataAPI(){
    this.spinner.show();
    this.reportLink.getPublicReport(this.publicToken).subscribe({
      next: (res: any) => {
        try {
          if (res?.status === 200 && res?.data) {
            this.reportData = res.data;
            this.year = this.reportData?.yearRs42?.[0]?.year;
            this.end_year = Number(this.year) + 1;
          } else {
            this.toastr.error('रिपोर्ट लिंक अवैध आहे किंवा कालबाह्य झाली आहे.', 'Error');
          }
        } finally {
          this.spinner.hide();
        }
      },
      error: (err: any) => {
        console.error('Error getting public report:', err);
        this.spinner.hide();
        this.toastr.error('रिपोर्ट लोड होऊ शकला नाही.', 'Error');
      },
    });
  }

  /** One bulk call → per-record report-view QR (each opens just that record). */
  private buildPerRecordQrLinks(param: any): void {
    if (this.isPublic) return;
    const rows: any[] = this.reportData?.rs3 || [];
    const ids = rows.map(r => r?.NEWUSER_ID).filter(id => id !== null && id !== undefined);
    if (ids.length === 0) return;
    this.reportLink.generateLinksBulk({
      report_key: 'imla-kar',
      report_params: param,
      new_user_ids: ids,
    }).subscribe({
      next: (res: any) => {
        const tokens = res?.tokens || {};
        const origin = window.location.origin;
        const map: { [id: string]: string } = {};
        for (const id of Object.keys(tokens)) {
          map[id] = `${origin}/public-report/imla-kar/${tokens[id]}`;
        }
        this.perRecordQrUrl = map;
      },
      error: (err: any) => console.error('bulk QR link error:', err),
    });
  }

  getReportDataAPI(){
    this.spinner.show();
    const param = {
                "ward_no": this.receivedData.ward_no,
                "year": this.receivedData.year,
                "start": this.receivedData.start,
                "end": this.receivedData.end,
                "from_year": this.receivedData.from_year,
                "to_year": this.receivedData.to_year
            };
    this.reportParams = param;
    this.apiService.getImlakarData(param).subscribe({
      next: (res: any) => {
        try {
          this.reportData = res.data;
          if(this.reportData?.rs3.length === 0 || this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
            this.toastr.error('No data found for the selected criteria.', 'Error');
            this.router.navigate(['/imla-kar-form-new']);
            return;
          }
          this.year = this.reportData.yearRs42[0].year
          this.end_year = Number(this.year) + 1;
          this.buildPerRecordQrLinks(param);
        } catch (error) {
          console.error('Error processing data:', error);
        } finally {
          this.spinner.hide();
        }
      },
      error: (err: any) => {
        console.error('Error getting for anukramika list :', err);
        this.spinner.hide();
      },
    });
  }

  async downloadPDFDirect() {
    const element = document.getElementById('contentToExport');
    if (!element) {
      this.toastr.error('Content not found', 'Error');
      return;
    }

    // Show loading message
    const toastId = this.toastr.info('PDF तयार करत आहे...', 'कृपया प्रतीक्षा करा', {
      disableTimeOut: true,
      closeButton: false
    }).toastId;

    // Hide buttons during capture
    const buttons = document.querySelectorAll('.hidden-print');
    buttons.forEach(btn => (btn as HTMLElement).style.display = 'none');

    try {
      // Find all page-break divs
      const pageBreaks = element.querySelectorAll('.page-break');

      if (pageBreaks.length === 0) {
        this.toastr.error('No pages found to export', 'Error');
        return;
      }

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 297;
      const pageHeight = 210;
      const leftMargin = 10;
      const rightMargin = 10;
      const topMargin = 10;
      const bottomMargin = 10;
      const availableWidth = pageWidth - leftMargin - rightMargin;
      const availableHeight = pageHeight - topMargin - bottomMargin;

      for (let i = 0; i < pageBreaks.length; i++) {
        const pageElement = pageBreaks[i] as HTMLElement;

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        if (i > 0) {
          pdf.addPage();
        }

        const xOffset = leftMargin + (availableWidth - finalWidth) / 2;
        const yOffset = topMargin + (availableHeight - finalHeight) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      }

      // Restore buttons
      buttons.forEach(btn => (btn as HTMLElement).style.display = '');

      // Clear loading toast
      if (toastId) {
        this.toastr.clear(toastId);
      }

      // Save PDF
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const currentDate = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
      const fileName = `imlakar_mojmap_yadi_${currentDate}.pdf`;

      pdf.save(fileName);
      this.toastr.success('PDF यशस्वीरित्या डाउनलोड झाली!', 'यशस्वी');
    } catch (error) {
      console.error('Error generating PDF:', error);

      // Restore buttons
      buttons.forEach(btn => (btn as HTMLElement).style.display = '');

      // Clear loading toast
      if (toastId) {
        this.toastr.clear(toastId);
      }

      this.toastr.error('PDF तयार करताना त्रुटी आली', 'त्रुटी');
    }
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
              margin: 25mm 15mm 8mm 15mm;
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
              font-size: 18px !important;
              margin-bottom: 3px !important;
              line-height: 1.3 !important;
              padding-top: 0 !important;
              font-weight: bold !important;
            }
            .san {
              font-size: 15px !important;
              margin-bottom: 3px !important;
              line-height: 1.3 !important;
            }
            .font15 {
              font-size: 12px !important;
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
              font-size: 11px !important;
              text-align: center !important;
              line-height: 1.3 !important;
            }
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
              padding: 4px 3px !important;
              font-size: 12px !important;
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
      const fileName = `imlakar_report_${currentDate}.pdf`;

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
              margin: 25mm 15mm 8mm 15mm;
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
              font-size: 18px !important;
              margin-bottom: 3px !important;
              line-height: 1.3 !important;
              padding-top: 0 !important;
              font-weight: bold !important;
            }
            .san {
              font-size: 15px !important;
              margin-bottom: 3px !important;
              line-height: 1.3 !important;
            }
            .font15 {
              font-size: 12px !important;
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
              font-size: 11px !important;
              text-align: center !important;
              line-height: 1.3 !important;
            }
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
              padding: 4px 3px !important;
              font-size: 12px !important;
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
