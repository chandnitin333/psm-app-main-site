import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Namuna8Service } from '../../../../services/namuna8.service';
import html2pdf from 'html2pdf.js';
import { LoaderService } from '../../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-anukramika',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anukramika.component.html',
  styleUrl: './anukramika.component.css'
})
export class AnukramikaComponent {
  receivedData : any;
  reportData: any;
  ward_number: any;
  public year: number = 0;
  public end_year: number = 0;
  isMobileDevice: boolean = false;
  constructor(private router: Router, private apiService: Namuna8Service, private route: ActivatedRoute, private spinner: LoaderService, private toastr: ToastrService, ) {
    const encoded = sessionStorage.getItem('Namuna8anukramanikaForm');
     this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (encoded) {
      this.receivedData = JSON.parse(atob(encoded));
    }else{
      // Use replaceUrl to avoid creating extra history entry
      this.router.navigate(['/namuna-8-form-new'], { replaceUrl: true });
    }
    console.log('Namuna81Component: Received Data via Router', this.receivedData);
  }

   ngOnInit() {
      this.getReportDataAPI();
      

  }
  getReportDataAPI(){
    this.spinner.show();

    const param = {
      "ward": this.receivedData.ward_no,
      "year": this.receivedData.year,
      "start": this.receivedData.start,
      "end": this.receivedData.end
    };

    this.apiService.getAnukramikaData(param).subscribe({
      next: (res: any) => {
        try {
          this.reportData = res.data;
          console.log('Reponse Data:', this.reportData);
        } catch (error) {
          console.error('Error processing data:', error);
        } finally {
          this.spinner.hide();
        }
      },
      error: (err: any) => {
        console.error('Error getting for anukramika list :', err);
        this.spinner.hide();
      }
    });
  }
  @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault(); // Prevent browser print dialog
        this.printDirect();
      }
    }

  // Direct browser print - matches ward-wise-adhar-list style
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
              size: A4 portrait;
              margin: 8mm;
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
              font-size: 18px !important;
              margin-bottom: 2px !important;
              line-height: 1.1 !important;
            }
            .padding20 {
              margin-bottom: 2px !important;
              font-size: 13px !important;
              line-height: 1.1 !important;
            }
            .row {
              margin-bottom: 2px !important;
              display: table !important;
              width: 100% !important;
            }
            .font15 {
              font-size: 13px !important;
              line-height: 1.1 !important;
            }
            .table-responsive {
              margin-top: 3px !important;
              overflow-x: visible !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
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
              padding: 4px 3px !important;
              word-wrap: break-word;
              font-size: 14px !important;
              text-align: center !important;
            }
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
              padding: 4px 3px !important;
              font-size: 14px !important;
            }
            tr {
              border: 1px solid #000 !important;
              page-break-inside: avoid;
              page-break-after: auto;
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
      const fileName = `नमुना_८_अनुक्रमणिका_${currentDate}.pdf`;

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
      const fileName = `नमुना_८_अनुक्रमणिका_${currentDate}.pdf`;

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
    const fileName = `नमुना_८_अनुक्रमणिका_${currentDate}.pdf`;

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
              margin: 8mm;
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
              font-size: 18px !important;
              margin-bottom: 2px !important;
              line-height: 1.1 !important;
            }
            .padding20 {
              margin-bottom: 2px !important;
              font-size: 13px !important;
              line-height: 1.1 !important;
            }
            .row {
              margin-bottom: 2px !important;
              display: table !important;
              width: 100% !important;
            }
            .font15 {
              font-size: 13px !important;
              line-height: 1.1 !important;
            }
            .table-responsive {
              margin-top: 3px !important;
              overflow-x: visible !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
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
              padding: 4px 3px !important;
              word-wrap: break-word;
              font-size: 14px !important;
              text-align: center !important;
            }
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
              padding: 4px 3px !important;
              font-size: 14px !important;
            }
            tr {
              border: 1px solid #000 !important;
              page-break-inside: avoid;
              page-break-after: auto;
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
      const fileName = `anukramika_list_${currentDate}.pdf`;

      html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      }).then((canvas) => {
        const imgWidth = 210; // A4 width in mm (portrait)
        const imgHeight = 297; // A4 height in mm (portrait)
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Calculate the number of pages needed
        const pageHeight = imgHeight;
        const contentHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = contentHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, contentHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - contentHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, contentHeight);
          heightLeft -= pageHeight;
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
