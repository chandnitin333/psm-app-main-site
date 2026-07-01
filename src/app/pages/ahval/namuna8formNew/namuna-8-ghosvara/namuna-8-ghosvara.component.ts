import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { Namuna8Service } from '../../../../services/namuna8.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../../services/loader.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-namuna-8-ghosvara',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './namuna-8-ghosvara.component.html',
  styleUrl: './namuna-8-ghosvara.component.css'
})
export class Namuna8GhosvaraComponent {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
      isMobileDevice: boolean = false;
    constructor(private router: Router, private apiService: Namuna8Service, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService) {
      const encoded = sessionStorage.getItem('namuna8ghosvara');
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

    }
    getReportDataAPI(){
      this.spinner.show();

      const param =
              {
                "ward": this.receivedData.ward_no,
                "year":this.receivedData.year,
                "start": this.receivedData.start,
                "end":this.receivedData.end,
                "new_user_id":null,
                "from_year":this.receivedData.year1,
                "to_year":this.receivedData.toYear1,
            };
      this.apiService.getNamuna8ghosvara(param).subscribe({
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

            console.log('Reponse Data---:', this.reportData);
          } catch (error) {
            console.error('Error processing data:', error);
          } finally {
            this.spinner.hide();
          }
        },
        error: (err: any) => {
          console.error('Error getting for namuna 8 ghosvara :', err);
          this.toastr.error('डेटा मिळविण्यात त्रुटी', 'त्रुटी');
          this.spinner.hide();
          setTimeout(() => {
            this.router.navigate(['/namuna-8-form-new']);
          }, 1500);
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
        <meta charset="UTF-8">
        <title>Print Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * {
            font-family: 'Noto Sans Devanagari', Arial, sans-serif !important;
          }
              ${styles}
              @page {
                size: A4 portrait;
                margin: 10mm;
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
                overflow-x: visible !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 3px !important;
                margin-bottom: 0 !important;
              }
              thead {
                display: table-header-group !important;
              }
              tbody {
                display: table-row-group !important;
              }
              th, td {
                border: 1px solid #000 !important;
                padding: 6px 4px !important;
                word-wrap: break-word;
                font-size: 16px !important;
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
              .bottom-info {
                font-size: 13px !important;
                margin-top: 5px !important;
                padding: 3px !important;
                line-height: 1.3 !important;
              }
              .page-break {
                page-break-before: always;
              }
              /* br tag spacing in print */
              br {
                display: block !important;
                margin: 3px 0 !important;
                line-height: 3px !important;
              }
              /* Hide the spacer column in print */
              .col-md-1 {
                display: none !important;
              }
              /* Expand col-md-2 to equal width when col-md-1 is hidden */
              .col-md-2 {
                display: table-cell !important;
                width: 20% !important;
                vertical-align: middle !important;
                padding: 2px !important;
                text-align: center !important;
              }
              .col-md-4 {
                display: table-cell !important;
                width: 33.33% !important;
                vertical-align: middle !important;
                padding: 2px !important;
              }
              /* Add top padding to signature-row-first (सरपंच तथा अध्यक्ष row) */
              .signature-row-first {
                padding-top: 55px !important;
              }
              /* Add top signing space above the first signature group (गसरपंच, सचिव, विस्तार अधिकारी) */
              .signature-group-first {
                padding-top: 55px !important;
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
    const fileName = `नमुना_८_ghosvara_${currentDate}.pdf`;

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
                size: A4 portrait;
                margin: 10mm;
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
                overflow-x: visible !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 3px !important;
                margin-bottom: 0 !important;
              }
              thead {
                display: table-header-group !important;
              }
              tbody {
                display: table-row-group !important;
              }
              th, td {
                border: 1px solid #000 !important;
                padding: 6px 4px !important;
                word-wrap: break-word;
                font-size: 16px !important;
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
              .bottom-info {
                font-size: 13px !important;
                margin-top: 5px !important;
                padding: 3px !important;
                line-height: 1.3 !important;
              }
              .page-break {
                page-break-before: always;
              }
              /* br tag spacing in print */
              br {
                display: block !important;
                margin: 3px 0 !important;
                line-height: 3px !important;
              }
              /* Hide the spacer column in print */
              .col-md-1 {
                display: none !important;
              }
              /* Expand col-md-2 to equal width when col-md-1 is hidden */
              .col-md-2 {
                display: table-cell !important;
                width: 20% !important;
                vertical-align: middle !important;
                padding: 2px !important;
                text-align: center !important;
              }
              .col-md-4 {
                display: table-cell !important;
                width: 33.33% !important;
                vertical-align: middle !important;
                padding: 2px !important;
              }
              /* Add top padding to signature-row-first (सरपंच तथा अध्यक्ष row) */
              .signature-row-first {
                padding-top: 55px !important;
              }
              /* Add top signing space above the first signature group (गसरपंच, सचिव, विस्तार अधिकारी) */
              .signature-group-first {
                padding-top: 55px !important;
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
    setTimeout(() => {
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
      const fileName = `namuna_8_ghosvara_${currentDate}.pdf`;

      html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      }).then((canvas) => {
        const pageWidth = 210; // A4 portrait width in mm
        const pageHeight = 297; // A4 portrait height in mm

        // Add margins
        const leftMargin = 10; // 10mm left margin
        const rightMargin = 10; // 10mm right margin
        const topMargin = 10; // 10mm top margin
        const bottomMargin = 5; // 5mm bottom margin

        // Calculate available space for content
        const availableWidth = pageWidth - leftMargin - rightMargin;
        const availableHeight = pageHeight - topMargin - bottomMargin;

        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Calculate dimensions to fit within available space with margins
        const ratio = canvas.width / canvas.height;
        let finalWidth = availableWidth;
        let finalHeight = availableWidth / ratio;

        // Calculate the number of pages needed
        const contentHeight = finalHeight;
        let heightLeft = contentHeight;
        let currentPage = 0;

        // Add pages as needed
        while (heightLeft > 0 || currentPage === 0) {
          if (currentPage > 0) {
            pdf.addPage();
          }

          // Calculate position for this page
          const yPosition = topMargin - (currentPage * availableHeight);

          // Center horizontally with margins
          const xOffset = leftMargin + (availableWidth - finalWidth) / 2;

          // Add image to PDF with margins
          pdf.addImage(imgData, 'PNG', xOffset, yPosition, finalWidth, finalHeight);

          heightLeft -= availableHeight;
          currentPage++;
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
      }).catch((error) => {
        console.error('Error generating PDF:', error);

        // Show buttons again in case of error
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
      });
    }, 100); // Small delay to ensure loading message displays
  }
}
