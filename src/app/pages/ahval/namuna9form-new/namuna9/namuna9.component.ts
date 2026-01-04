import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { Namuna9Service } from '../../../../services/namuna9.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../../services/loader.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-namuna9',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './namuna9.component.html',
  styleUrl: './namuna9.component.css'
})
export class Namuna9Component {
    Math = Math;
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    isMobileDevice: boolean = false;
    constructor(private router: Router, private apiService: Namuna9Service, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService) {
      const encoded = sessionStorage.getItem('namuna9');
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
            };
      this.apiService.getNamuna9WardNew(param).subscribe({
        next: (res: any) => {
          try {
            this.reportData = res.data;

            // Check if data is empty
            if (!this.reportData?.rs3 || this.reportData.rs3.length === 0) {
              this.toastr.warning('डेटा उपलब्ध नाही', 'चेतावणी');
              setTimeout(() => {
                this.router.navigate(['/namuna-9-form-new']);
              }, 1500);
              this.spinner.hide();
              return;
            }

            if (this.reportData?.yearRs42 && this.reportData.yearRs42.length > 0) {
              this.year = this.reportData.yearRs42[0].year;
              this.end_year = Number(this.year) + 1;
            }
          } catch (error) {
            console.error('Error processing data:', error);
          } finally {
            this.spinner.hide();
          }
        },
        error: (err: any) => {
          console.error('Error getting for namuna 9 :', err);
          this.toastr.error('डेटा मिळविण्यात त्रुटी', 'त्रुटी');
          this.spinner.hide();
          setTimeout(() => {
            this.router.navigate(['/namuna-9-form-new']);
          }, 1500);
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
    const fileName = `namuna9_${currentDate}.pdf`;

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
        const fileName = `namuna9_${currentDate}.pdf`;

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
