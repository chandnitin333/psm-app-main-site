import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-namuna-8-sarkari',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './namuna-8-sarkari.component.html',
  styleUrl: './namuna-8-sarkari.component.css'
})
export class Namuna8SarkariComponent {
  receivedData: any;
  namuna_8_sarkar_data: any;
  MILKAT_VAPAR_NAME: string = '';
isMobileDevice: boolean = false;
  constructor(private router: Router, private customerService: CustomerService,private toastr: ToastrService) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // console.log('Namuna81Component: Received Data via Router', this.receivedData);
  }

ngOnInit() {
  this.get_namuna_8_Sarkari_data();
}
get_namuna_8_Sarkari_data(){
  this.customerService.getNamuna_8_sarkari_data(this.receivedData.value).subscribe({
    next: (res: any) => {
      this.namuna_8_sarkar_data = res.data;
      this.MILKAT_VAPAR_NAME = (this.namuna_8_sarkar_data?.taxandMilkatDetailsRs10?.[0] !== null) ? this.namuna_8_sarkar_data?.taxandMilkatDetailsRs10?.[0]?.MILKAT_VAPAR_NAME : '';
      // console.log('MILKAT_VAPAR_NAME:', this.MILKAT_VAPAR_NAME);
      // console.log('Namuna 8 Sarkari Data:', this.namuna_8_sarkar_data);
    },
    error: (err: Error) => {
      console.error('Error getting for namuna 8 sarkari:', err);
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
          const currentDate = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const fileName = `नमुना_८_${currentDate}.pdf`;

          const options = {
            filename: fileName,
            margin: [15, 15, 15, 15], // top, left, bottom, right (mm)
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, 
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          };

          html2pdf()
            .set(options)
            .from(element)
            .toPdf()
            .save(); // Save the PDF directly
        }
      }
 
  downloadAndPreviewPDF() {
    const element = document.getElementById('contentToExport');
    if (element) {
      const currentDate = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const fileName = `नमुना_८_${currentDate}.pdf`;

      // Generate PDF and open in a new browser tab
      const options = {
        filename: fileName,
        margin: [15, 15, 15, 15], // top, left, bottom, right (mm)
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
          const blob = pdf.output('blob'); // Get the PDF as a blob
          const blobURL = URL.createObjectURL(blob); // Create a temporary blob URL

          // Open the blob URL in a new tab
          const previewWindow = window.open(blobURL, '_blank');

          // Add a delay before attempting to print
          setTimeout(() => {
            // Attempt to automatically open the print dialog
            previewWindow?.print();
          }, 500); // 1000ms delay (1 second) to ensure the PDF is fully loaded
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
          <title>नमुना ८ सरकारी</title>
          <style>
            ${styles}

            /* Print-specific styles */
            @page {
              size: A4 landscape;
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
              padding: 4px !important;
              margin: 0 !important;
            }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
              page-break-inside: avoid;
              font-size: 11px !important;
              margin: 0 !important;
            }

            th, td {
              border: 1px solid #000 !important;
              padding: 4px 5px !important;
              font-size: 11px !important;
              text-align: center !important;
              vertical-align: middle !important;
              word-wrap: break-word;
              line-height: 1.4 !important;
            }

            th {
              font-weight: bold !important;
              background: #f2f2f2 !important;
              padding: 5px !important;
            }

            .heading, .namna {
              text-align: center !important;
              font-size: 16px !important;
              font-weight: bold !important;
              padding: 3px 0 !important;
              margin: 0 0 5px 0 !important;
              line-height: 1.5 !important;
            }

            .san {
              text-align: center !important;
              font-size: 13px !important;
              padding: 3px 0 !important;
              margin: 0 0 5px 0 !important;
              line-height: 1.4 !important;
            }

            .font15 {
              font-size: 11px !important;
              font-weight: bold !important;
              line-height: 1.4 !important;
            }

            .left {
              text-align: left !important;
              float: left;
            }

            .center {
              text-align: center !important;
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
              margin: 0 !important;
              padding: 0 !important;
            }

            .col-md-4 {
              width: 33.33% !important;
              float: left;
              padding: 3px !important;
            }

            .row {
              width: 100% !important;
              clear: both;
              padding: 3px 0 !important;
              margin: 0 0 2px 0 !important;
              display: table !important;
            }

            .row::after {
              content: "";
              display: table;
              clear: both;
            }

            .container-fluid {
              padding: 4px !important;
              margin: 0 !important;
            }

            .col-md-12 {
              padding: 3px !important;
              margin: 0 !important;
            }

            br {
              display: none !important;
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
    const fileName = `namuna_8_sarkari${currentDate}.pdf`;

    const element = document.getElementById('contentToExport');
      if (!element) {
        console.error('Element contentToExport not found');
        return;
      }

      const clonedContent = element.cloneNode(true) as HTMLElement;
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
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>नमुना ८ सरकारी</title>
          <style>
            ${styles}

            /* Print-specific styles */
            @page {
              size: A4 landscape;
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
              padding: 4px !important;
              margin: 0 !important;
            }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
              page-break-inside: avoid;
              font-size: 11px !important;
              margin: 0 !important;
            }

            th, td {
              border: 1px solid #000 !important;
              padding: 4px 5px !important;
              font-size: 11px !important;
              text-align: center !important;
              vertical-align: middle !important;
              word-wrap: break-word;
              line-height: 1.4 !important;
            }

            th {
              font-weight: bold !important;
              background: #f2f2f2 !important;
              padding: 5px !important;
            }

            .heading, .namna {
              text-align: center !important;
              font-size: 16px !important;
              font-weight: bold !important;
              padding: 3px 0 !important;
              margin: 0 0 5px 0 !important;
              line-height: 1.5 !important;
            }

            .san {
              text-align: center !important;
              font-size: 13px !important;
              padding: 3px 0 !important;
              margin: 0 0 5px 0 !important;
              line-height: 1.4 !important;
            }

            .font15 {
              font-size: 11px !important;
              font-weight: bold !important;
              line-height: 1.4 !important;
            }

            .left {
              text-align: left !important;
              float: left;
            }

            .center {
              text-align: center !important;
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
              margin: 0 !important;
              padding: 0 !important;
            }

            .col-md-4 {
              width: 33.33% !important;
              float: left;
              padding: 3px !important;
            }

            .row {
              width: 100% !important;
              clear: both;
              padding: 3px 0 !important;
              margin: 0 0 2px 0 !important;
              display: table !important;
            }

            .row::after {
              content: "";
              display: table;
              clear: both;
            }

            .container-fluid {
              padding: 4px !important;
              margin: 0 !important;
            }

            .col-md-12 {
              padding: 3px !important;
              margin: 0 !important;
            }

            br {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${clonedContent.outerHTML}
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
      const fileName = `namuna_8_sarkari_${currentDate}.pdf`;

      html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      }).then((canvas) => {
        const imgWidth = 297; // A4 width in mm (landscape)
        const imgHeight = 210; // A4 height in mm (landscape)
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'landscape',
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
