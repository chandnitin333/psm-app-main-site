import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportQrComponent } from '../../../components/report-qr/report-qr.component';
import { ReportLinkService } from '../../../services/report-link.service';

@Component({
  selector: 'app-namuna-8-1',
  standalone: true,
  imports: [CommonModule, ReportQrComponent],
  templateUrl: './namuna-8-1.component.html',
  styleUrl: './namuna-8-1.component.css'
})
export class Namuna81Component{
  receivedData: any;
  namuna_8_1_data: any;
  isMobileDevice: boolean = false;
  isPublic: boolean = false;     // opened via QR scan (/public-report/...) — no login
  publicToken: string = '';

  constructor(private router: Router, private customerService: CustomerService,private toastr: ToastrService,
    private route: ActivatedRoute, private reportLink: ReportLinkService) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    // console.log('Namuna81Component: Received Data via Router', this.receivedData);
    this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.publicToken = this.route.snapshot.paramMap.get('token') || '';
    this.isPublic = !!this.publicToken;
  }

ngOnInit() {
  if (this.isPublic) {
    this.get_public_namuna_8_1_data();
  } else {
    this.get_namuna_8_1_data();
  }
}
get_namuna_8_1_data(){
  this.customerService.getNamuna_8_1_data(this.receivedData.value).subscribe({
    next: (res: any) => {
      this.namuna_8_1_data = res.data;
      console.log('Namuna 8.1 Data:', this.namuna_8_1_data);
    },
    error: (err: Error) => {
      console.error('Error getting for namuna 8:', err);
    },
  });
}

get_public_namuna_8_1_data(){
  this.reportLink.getPublicReport(this.publicToken).subscribe({
    next: (res: any) => {
      console.log('public report response:', res);
      if ((res?.status === 200 || res?.status === undefined) && res?.data) {
        this.namuna_8_1_data = res.data;
      } else {
        this.toastr.error(res?.message || 'रिपोर्ट लिंक अवैध आहे किंवा कालबाह्य झाली आहे.', 'Error');
      }
    },
    error: (err: Error) => {
      console.error('Error getting public namuna 8:', err);
      this.toastr.error('रिपोर्ट लोड होऊ शकला नाही.', 'Error');
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
      const fileName = `नमुना_८_${currentDate}.pdf`;

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
      const fileName = `नमुना_८_${currentDate}.pdf`;

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
          <title>नमुना ८</title>
          <style>
            ${styles}

            /* Report QR: reserve room so it never overlaps the जिल्हा row */
            .qr-anchor-row { min-height: 64px !important; position: relative !important; }
            .qr-anchor { position: absolute !important; top: 0 !important; right: 0 !important; }
            .report-qr-img { width: 48px !important; height: 48px !important; border: 1px solid #000 !important; background: #fff !important; }
            .report-qr-caption { font-size: 7px !important; line-height: 1.1 !important; display: block !important; text-align: center !important; }
            .report-qr-block { display: inline-flex !important; flex-direction: column !important; align-items: center !important; }

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
              padding: 5px !important;
            }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
              page-break-inside: avoid;
              font-size: 9px !important;
            }

            th, td {
              border: 1px solid #000 !important;
              padding: 2px !important;
              font-size: 9px !important;
              text-align: center !important;
              vertical-align: middle !important;
              word-wrap: break-word;
            }

            th {
              font-weight: bold !important;
              background: #f2f2f2 !important;
            }

            .heading {
              text-align: center !important;
              font-size: 12px !important;
              font-weight: bold !important;
              padding: 3px 0 !important;
              line-height: 1 !important;
            }

            .san {
              text-align: center !important;
              font-size: 10px !important;
              padding: 2px 0 !important;
              line-height: 1 !important;
            }

            .font15 {
              font-size: 9px !important;
              font-weight: bold !important;
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
            }

            .col-md-4 {
              width: 33.33% !important;
              float: left;
            }

            .row {
              width: 100% !important;
              clear: both;
              padding: 2px 0 !important;
            }

            .row::after {
              content: "";
              display: table;
              clear: both;
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
  const fileName = `namuna_8_1_${currentDate}.pdf`;

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
          <title>नमुना ८</title>
          <style>
            ${styles}

            /* Report QR: reserve room so it never overlaps the जिल्हा row */
            .qr-anchor-row { min-height: 64px !important; position: relative !important; }
            .qr-anchor { position: absolute !important; top: 0 !important; right: 0 !important; }
            .report-qr-img { width: 48px !important; height: 48px !important; border: 1px solid #000 !important; background: #fff !important; }
            .report-qr-caption { font-size: 7px !important; line-height: 1.1 !important; display: block !important; text-align: center !important; }
            .report-qr-block { display: inline-flex !important; flex-direction: column !important; align-items: center !important; }

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
              padding: 5px !important;
            }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
              page-break-inside: avoid;
              font-size: 9px !important;
            }

            th, td {
              border: 1px solid #000 !important;
              padding: 2px !important;
              font-size: 9px !important;
              text-align: center !important;
              vertical-align: middle !important;
              word-wrap: break-word;
            }

            th {
              font-weight: bold !important;
              background: #f2f2f2 !important;
            }

            .heading {
              text-align: center !important;
              font-size: 12px !important;
              font-weight: bold !important;
              padding: 3px 0 !important;
              line-height: 1 !important;
            }

            .san {
              text-align: center !important;
              font-size: 10px !important;
              padding: 2px 0 !important;
              line-height: 1 !important;
            }

            .font15 {
              font-size: 9px !important;
              font-weight: bold !important;
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
            }

            .col-md-4 {
              width: 33.33% !important;
              float: left;
            }

            .row {
              width: 100% !important;
              clear: both;
              padding: 2px 0 !important;
            }

            .row::after {
              content: "";
              display: table;
              clear: both;
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
    const fileName = `namuna_8_1_${currentDate}.pdf`;

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
