import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Namuna8Service } from '../../../../services/namuna8.service';
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportQrComponent } from '../../../../components/report-qr/report-qr.component';
import { ReportLinkService } from '../../../../services/report-link.service';

@Component({
  selector: 'app-namuna81-single-ward',
  standalone: true,
  imports: [CommonModule, NgxPrintModule, ReportQrComponent],
  templateUrl: './namuna81-single-ward.component.html',
  styleUrl: './namuna81-single-ward.component.css'
})
export class Namuna81SingleWardComponent {
  receivedData : any;
  reportData: any;
  ward_number: any;
  public year: number = 0;
  public end_year: number = 0;
  isMobileDevice: boolean = false;
  isPublic: boolean = false;     // opened via QR scan — no login
  publicToken: string = '';
  reportParams: any = null;      // params for QR link generation
  perRecordQrUrl: { [id: string]: string } = {};   // one scanner per record
  constructor(private router: Router, private apiService: Namuna8Service, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService,
    private reportLink: ReportLinkService) {
    this.publicToken = this.route.snapshot.paramMap.get('token') || '';
    this.isPublic = !!this.publicToken;
    const encoded = sessionStorage.getItem('namuna81SingleWardForm');
    this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (encoded) {
      this.receivedData = JSON.parse(atob(encoded));
    } else if (!this.isPublic) {
      this.router.navigate(['/namuna-8-form-new']);
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
            if (this.reportData?.yearRs42 && this.reportData.yearRs42.length > 0) {
              this.year = this.reportData.yearRs42[0].year;
              this.end_year = Number(this.year) + 1;
            }
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
            };
    this.reportParams = param;   // QR link uses the exact same params
    this.apiService.getNamuna81SingleWardNew(param).subscribe({
      next: (res: any) => {
        try {
          this.reportData = res.data;

          // Check if data is empty
          if (!this.reportData?.rs3 || this.reportData.rs3.length === 0) {
            this.toastr.warning('डेटा उपलब्ध नाही', 'चेतावणी');
            setTimeout(() => {
              this.router.navigate(['/namuna-8-form-new']);
            }, 1500);
            this.spinner.hide();
            return;
          }

          if (this.reportData?.yearRs42 && this.reportData.yearRs42.length > 0) {
            this.year = this.reportData.yearRs42[0].year;
            this.end_year = Number(this.year) + 1;
          }
          this.buildPerRecordQrLinks(param);
          console.log('Reponse Data-------------:', this.reportData);
        } catch (error) {
          console.error('Error processing data:', error);
        } finally {
          this.spinner.hide();
        }
      },
      error: (err: any) => {
        console.error('Error getting for anukramika list :', err);
        this.toastr.error('डेटा मिळविण्यात त्रुटी', 'त्रुटी');
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/namuna-8-form-new']);
        }, 1500);
      },
    });
  }

  /** One bulk call → per-record QR (each record opens just that record,
   *  same single-vard layout, filtered by its new_user_id). */
  private buildPerRecordQrLinks(param: any): void {
    if (this.isPublic) return;
    const rows: any[] = this.reportData?.rs3 || [];
    const ids = rows.map(r => r?.NEWUSER_ID).filter(id => id !== null && id !== undefined);
    if (ids.length === 0) return;
    this.reportLink.generateLinksBulk({
      report_key: 'namuna-8-1-single-vard',
      report_params: param,
      new_user_ids: ids,
    }).subscribe({
      next: (res: any) => {
        const tokens = res?.tokens || {};
        const origin = window.location.origin;
        const map: { [id: string]: string } = {};
        for (const id of Object.keys(tokens)) {
          map[id] = `${origin}/public-report/namuna-8-1-single-vard/${tokens[id]}`;
        }
        this.perRecordQrUrl = map;
      },
      error: (err: any) => console.error('bulk QR link error:', err),
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
        <meta charset="UTF-8">
        <title>Print Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * {
            font-family: 'Noto Sans Devanagari', Arial, sans-serif !important;
          }
            ${styles}
            .qr-anchor-row { min-height: 56px !important; position: relative !important; }
            .qr-anchor { position: absolute !important; top: 0 !important; right: 0 !important; }
            .report-qr-img { width: 48px !important; height: 48px !important; border: 1px solid #000 !important; background: #fff !important; }
            .report-qr-caption { font-size: 7px !important; line-height: 1.1 !important; display: block !important; text-align: center !important; }
            .report-qr-block { display: inline-flex !important; flex-direction: column !important; align-items: center !important; }
            @page {
              size: A4 landscape;
              margin: 7mm;
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
            #contentToExport {
              width: 1350px !important;
              margin: 0 auto !important;
              padding: 0 !important;
              zoom: 0.70;
              overflow: hidden !important;
            }
            .heading {
              font-size: 20px !important;
              margin-bottom: 2px !important;
              line-height: 1.1 !important;
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
              font-size: 14px !important;
              line-height: 1.1 !important;
            }
            .table-responsive {
              margin-top: 3px !important;
              overflow-x: visible !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              border: 1px solid #000 !important;
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
              padding: 3px 2px !important;
              word-wrap: break-word;
              font-size: 15px !important;
              text-align: center !important;
            }
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
              padding: 3px 2px !important;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            .landscape-text {
              writing-mode: vertical-rl !important;
              text-orientation: mixed !important;
              white-space: nowrap !important;
              min-width: 28px !important;
              font-size: 15px !important;
              transform: none !important;
            }
            .page-break:not(:first-child) {
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
    const fileName = `namuna81_single_ward_${currentDate}.pdf`;

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
            .qr-anchor-row { min-height: 56px !important; position: relative !important; }
            .qr-anchor { position: absolute !important; top: 0 !important; right: 0 !important; }
            .report-qr-img { width: 48px !important; height: 48px !important; border: 1px solid #000 !important; background: #fff !important; }
            .report-qr-caption { font-size: 7px !important; line-height: 1.1 !important; display: block !important; text-align: center !important; }
            .report-qr-block { display: inline-flex !important; flex-direction: column !important; align-items: center !important; }
            @page {
              size: A4 landscape;
              margin: 7mm;
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
            #contentToExport {
              width: 1350px !important;
              margin: 0 auto !important;
              padding: 0 !important;
              zoom: 0.70;
              overflow: hidden !important;
            }
            .heading {
              font-size: 20px !important;
              margin-bottom: 2px !important;
              line-height: 1.1 !important;
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
              font-size: 14px !important;
              line-height: 1.1 !important;
            }
            .table-responsive {
              margin-top: 3px !important;
              overflow-x: visible !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              border: 1px solid #000 !important;
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
              padding: 3px 2px !important;
              word-wrap: break-word;
              font-size: 15px !important;
              text-align: center !important;
            }
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
              padding: 3px 2px !important;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            .landscape-text {
              writing-mode: vertical-rl !important;
              text-orientation: mixed !important;
              white-space: nowrap !important;
              min-width: 28px !important;
              font-size: 15px !important;
              transform: none !important;
            }
            .page-break:not(:first-child) {
              page-break-before: always;
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

  downloadPDFDirect() {
    const element = document.getElementById('contentToExport');
    if (!element) {
      this.toastr.error('Content not found', 'Error');
      return;
    }

    // Show loading toast
    const toastId = this.toastr.info('PDF तयार करत आहे...', 'कृपया प्रतीक्षा करा', {
      disableTimeOut: true,
      closeButton: false
    }).toastId;

    // Clone the element
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Apply vertical text styles directly to cloned elements
    const landscapeTexts = clonedElement.querySelectorAll('.landscape-text');
    landscapeTexts.forEach((el: any) => {
      el.style.cssText = `
        writing-mode: vertical-rl !important;
        text-orientation: mixed !important;
        white-space: nowrap !important;
        min-width: 30px !important;
        font-size: 8px !important;
      `;
    });

    // Hide buttons in clone
    const buttons = clonedElement.querySelectorAll('button, .hidden-print');
    buttons.forEach((btn: any) => {
      btn.style.display = 'none';
    });

    // Create temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // Generate filename
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentDate = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
    const fileName = `namuna81_single_ward_${currentDate}.pdf`;

    // Use html2pdf with enhanced settings
    const options = {
      margin: [10, 10, 10, 10],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        letterRendering: true,
        logging: false,
        windowWidth: clonedElement.scrollWidth,
        windowHeight: clonedElement.scrollHeight
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape'
      },
      pagebreak: { mode: ['css', 'legacy'], before: '.page-break' }
    };

    html2pdf()
      .set(options)
      .from(clonedElement)
      .save()
      .then(() => {
        // Remove temporary container
        document.body.removeChild(tempContainer);
        if (toastId) {
          this.toastr.clear(toastId);
        }
        this.toastr.success('PDF यशस्वीरित्या डाउनलोड झाली!', 'यशस्वी');
      })
      .catch((error: any) => {
        console.error('Error generating PDF:', error);
        // Remove temporary container
        if (tempContainer.parentNode) {
          document.body.removeChild(tempContainer);
        }
        if (toastId) {
          this.toastr.clear(toastId);
        }
        this.toastr.error('PDF तयार करताना त्रुटी आली', 'त्रुटी');
      });
  }
}
