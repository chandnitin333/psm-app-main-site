import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Namuna8Service } from '../../../../services/namuna8.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../../services/loader.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportQrComponent } from '../../../../components/report-qr/report-qr.component';
import { ReportLinkService } from '../../../../services/report-link.service';

@Component({
  selector: 'app-namuna-8-sarkari-ward',
  standalone: true,
  imports: [CommonModule,ToastrModule,ReportQrComponent ],
  templateUrl: './namuna-8-sarkari-ward.component.html',
  styleUrl: './namuna-8-sarkari-ward.component.css'
})
export class Namuna8SarkariWardComponent {
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
      const encoded = sessionStorage.getItem('namuna8sarkari');
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

      const param =
              {
                "ward": this.receivedData.ward_no,
                "year":this.receivedData.year,
                "start": this.receivedData.start,
                "end":this.receivedData.end
            };
      this.reportParams = param;   // QR link uses the exact same params
      this.apiService.getNamuna8sarkariWard(param).subscribe({
        next: (res: any) => {
          try {
            this.reportData = res.data;

            // Check if data is empty
            if (!this.reportData?.rs14 || this.reportData.rs14.length === 0) {
              this.toastr.warning('डेटा उपलब्ध नाही', 'चेतावणी');
              setTimeout(() => {
                this.router.navigate(['/namuna-8-form-new']);
              }, 1500);
              this.spinner.hide();
              return;
            }

            this.buildPerRecordQrLinks(param);
            console.log('Reponse Data---:', this.reportData);
          } catch (error) {
            console.error('Error processing data:', error);
          } finally {
            this.spinner.hide();
          }
        },
        error: (err: any) => {
          console.error('Error getting for namuna 8 sarkari ward :', err);
          this.toastr.error('डेटा मिळविण्यात त्रुटी', 'त्रुटी');
          this.spinner.hide();
          setTimeout(() => {
            this.router.navigate(['/namuna-8-form-new']);
          }, 1500);
        },
      });
    }
    /** One bulk call → per-record QR (each record opens just that record). */
    private buildPerRecordQrLinks(param: any): void {
      if (this.isPublic) return;
      const rows: any[] = this.reportData?.rs14 || [];
      const ids = rows.map(r => r?.new_user_id).filter(id => id !== null && id !== undefined);
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
        <meta charset="UTF-8">
        <title>Print Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * {
            font-family: 'Noto Sans Devanagari', Arial, sans-serif !important;
          }
              ${styles}
              /* One report per printed page */
              .page-break {
                page-break-after: always !important;
                page-break-inside: avoid !important;
                display: block !important;
              }
              .page-break:last-of-type { page-break-after: auto !important; }
              .qr-anchor-row { min-height: 76px !important; position: relative !important; }
              .qr-anchor {
                position: absolute !important;
                top: 0 !important;
                right: 0 !important;
                left: auto !important;
                width: auto !important;
                text-align: right !important;
              }
              .report-qr-img { width: 48px !important; height: 48px !important; border: 1px solid #000 !important; background: #fff !important; }
              .report-qr-caption { font-size: 7px !important; line-height: 1.1 !important; display: block !important; text-align: center !important; }
              .report-qr-block { display: inline-flex !important; flex-direction: column !important; align-items: center !important; }
              @page {
                size: A4 landscape;
                margin: 22mm 10mm 8mm 10mm;
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
                width: 1100px !important;
                display: block !important;
                margin: 0 auto !important;
                padding: 0 !important;
                zoom: 0.92;
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
                font-size: 15px !important;
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
        const fileName = `namuna8_sarkar_ward_${currentDate}.pdf`;

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
              /* One report per printed page */
              .page-break {
                page-break-after: always !important;
                page-break-inside: avoid !important;
                display: block !important;
              }
              .page-break:last-of-type { page-break-after: auto !important; }
              .qr-anchor-row { min-height: 76px !important; position: relative !important; }
              .qr-anchor {
                position: absolute !important;
                top: 0 !important;
                right: 0 !important;
                left: auto !important;
                width: auto !important;
                text-align: right !important;
              }
              .report-qr-img { width: 48px !important; height: 48px !important; border: 1px solid #000 !important; background: #fff !important; }
              .report-qr-caption { font-size: 7px !important; line-height: 1.1 !important; display: block !important; text-align: center !important; }
              .report-qr-block { display: inline-flex !important; flex-direction: column !important; align-items: center !important; }
              @page {
                size: A4 landscape;
                margin: 22mm 10mm 8mm 10mm;
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
                width: 1100px !important;
                display: block !important;
                margin: 0 auto !important;
                padding: 0 !important;
                zoom: 0.92;
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
                font-size: 15px !important;
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

    async downloadPDFDirect() {
      const element = document.getElementById('contentToExport');
      if (!element) {
        this.toastr.error('Content not found', 'Error');
        return;
      }

      // Show loading message with persistent toast
      const loadingToast = this.toastr.info(
        'PDF तयार करत आहे, कृपया प्रतीक्षा करा...',
        'लोड होत आहे',
        {
          timeOut: 0,
          extendedTimeOut: 0,
          closeButton: false,
          tapToDismiss: false,
          progressBar: true,
          disableTimeOut: true
        }
      );

      // Small delay to ensure loading toast is visible
      setTimeout(async () => {
        try {
          // Hide buttons before capturing
          const buttons = element.querySelectorAll('button, .hidden-print');
          buttons.forEach((btn: any) => {
            btn.style.display = 'none';
          });

          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          const currentDate = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
          const fileName = `namuna8_sarkari_ward_${currentDate}.pdf`;

          // Get all page-break divs
          const pageBreaks = element.querySelectorAll('.page-break');

          if (pageBreaks.length === 0) {
            this.toastr.error('No records found to export', 'Error');
            buttons.forEach((btn: any) => { btn.style.display = ''; });
            this.toastr.clear(loadingToast.toastId);
            return;
          }

          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          });

          const pageWidth = 297; // A4 width in mm (landscape)
          const pageHeight = 210; // A4 height in mm (landscape)

          // Add margins
          const leftMargin = 10; // 10mm left margin
          const rightMargin = 10; // 10mm right margin
          const topMargin = 5; // 5mm top margin
          const bottomMargin = 5; // 5mm bottom margin

          // Calculate available space for content
          const availableWidth = pageWidth - leftMargin - rightMargin;
          const availableHeight = pageHeight - topMargin - bottomMargin;

          // Process each page-break div separately
          for (let i = 0; i < pageBreaks.length; i++) {
            const pageElement = pageBreaks[i] as HTMLElement;

            // Capture this specific page
            const canvas = await html2canvas(pageElement, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff'
            });

            // Add a new page for each record (except the first one)
            if (i > 0) {
              pdf.addPage();
            }

            const imgData = canvas.toDataURL('image/png');

            // Calculate dimensions to fit within available space with margins
            const ratio = canvas.width / canvas.height;
            let finalWidth = availableWidth;
            let finalHeight = availableWidth / ratio;

            // If height exceeds available space, scale down
            if (finalHeight > availableHeight) {
              finalHeight = availableHeight;
              finalWidth = availableHeight * ratio;
            }

            // Center the image within the available space (with margins)
            const xOffset = leftMargin + (availableWidth - finalWidth) / 2;
            const yOffset = topMargin + (availableHeight - finalHeight) / 2;

            // Add image to PDF with margins
            pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
          }

          // Save the PDF
          pdf.save(fileName);

          // Show buttons again
          buttons.forEach((btn: any) => {
            btn.style.display = '';
          });

          // Clear loading toast and show success
          this.toastr.clear(loadingToast.toastId);
          this.toastr.success('PDF डाउनलोड यशस्वी!', 'यशस्वी', {
            timeOut: 3000,
            closeButton: true,
            progressBar: true
          });
        } catch (error) {
          console.error('Error generating PDF:', error);

          // Show buttons again in case of error
          const buttons = element.querySelectorAll('button, .hidden-print');
          buttons.forEach((btn: any) => {
            btn.style.display = '';
          });

          // Clear loading toast and show error
          this.toastr.clear(loadingToast.toastId);
          this.toastr.error('PDF तयार करताना त्रुटी आली', 'त्रुटी', {
            timeOut: 5000,
            closeButton: true,
            progressBar: true
          });
        }
      }, 100); // Small delay to ensure loading message displays
    }
}
