import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { ImlakarService } from '../../../../services/imlakar.service';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-imlakar-anukramanika',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './imlakar-anukramanika.component.html',
  styleUrl: './imlakar-anukramanika.component.css'
})
export class ImlakarAnukramanikaComponent {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
      isMobileDevice: boolean = false;
    constructor(private router: Router, private apiService: ImlakarService, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService) {
      const encoded = sessionStorage.getItem('imlakaranukramanikaFormReport');
      this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (encoded) {
        this.receivedData = JSON.parse(atob(encoded));
      }else{
        this.router.navigate(['/imla-kar-form-new']);
      }
      console.log('Namuna81Component: Received Data via Router', this.receivedData);
    }

    ngOnInit() {
        this.getReportDataAPI();

    }
    getReportDataAPI(){
      this.spinner.show();
      const param = {
                  "ward": this.receivedData.ward_no
              };
      this.apiService.imlakarAnukranika(param).subscribe({
        next: (res: any) => {
          try {
            this.reportData = res.data;
            if(this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
              this.toastr.error('No data found for the selected criteria.', 'Error');
              this.router.navigate(['/imla-kar-form-new']);
              return;
            }
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

    downloadPDFDirect() {
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

      // PDF generation with margins - Portrait orientation
      const pageWidth = 210;
      const pageHeight = 297;
      const leftMargin = 10;
      const rightMargin = 10;
      const topMargin = 10;
      const bottomMargin = 5;
      const availableWidth = pageWidth - leftMargin - rightMargin;
      const availableHeight = pageHeight - topMargin - bottomMargin;

      html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        // Multi-page handling
        let heightLeft = finalHeight;
        let currentPage = 0;

        while (heightLeft > 0 || currentPage === 0) {
          if (currentPage > 0) {
            pdf.addPage();
          }

          const yPosition = currentPage === 0 ? topMargin : topMargin - (currentPage * availableHeight);
          const xOffset = leftMargin + (availableWidth - finalWidth) / 2;

          pdf.addImage(imgData, 'PNG', xOffset, yPosition, finalWidth, finalHeight);

          heightLeft -= availableHeight;
          currentPage++;

          if (heightLeft <= 0) break;
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
        const fileName = `imlakar_anukramnika_${currentDate}.pdf`;

        pdf.save(fileName);
        this.toastr.success('PDF यशस्वीरित्या डाउनलोड झाली!', 'यशस्वी');
      }).catch(error => {
        console.error('Error generating PDF:', error);

        // Restore buttons
        buttons.forEach(btn => (btn as HTMLElement).style.display = '');

        // Clear loading toast
        if (toastId) {
          this.toastr.clear(toastId);
        }

        this.toastr.error('PDF तयार करताना त्रुटी आली', 'त्रुटी');
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
        const fileName = `इमलाकर_अनुक्रमणिका_${currentDate}.pdf`;

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
        const fileName = `इमलाकर_अनुक्रमणिका_${currentDate}.pdf`;

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
            <title>इमलाकर अनुक्रमणिका</title>
            <style>
              ${styles}

              /* Print-specific styles */
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
                font-family: 'Noto Sans Devanagari', Arial, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color: #000;
                background: white;
              }

              #contentToExport {
                width: 100%;
                padding: 3px !important;
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
                padding: 0 !important;
                margin: 0 0 2px 0 !important;
                line-height: 1 !important;
              }

              .san {
                text-align: center !important;
                font-size: 10px !important;
                padding: 0 !important;
                margin: 0 0 2px 0 !important;
                line-height: 1 !important;
              }

              .font15 {
                font-size: 9px !important;
                font-weight: bold !important;
                line-height: 1 !important;
              }

              .left {
                text-align: left !important;
                float: left;
              }

              .center {
                text-align: center !important;
              }

              .center.tahsil {
                text-align: center !important;
                margin-left: 0 !important;
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
                padding: 0 5px !important;
              }

              .col-md-4:nth-child(1) {
                text-align: left !important;
              }

              .col-md-4:nth-child(2) {
                text-align: center !important;
              }

              .col-md-4:nth-child(2) span {
                float: none !important;
                display: inline-block !important;
              }

              .col-md-4:nth-child(3) {
                text-align: right !important;
              }

              .row {
                width: 100% !important;
                clear: both;
                padding: 2px 0 !important;
              }

              .header-row {
                margin-bottom: 5px !important;
              }

              .header-row .col-md-4:nth-child(1) {
                text-align: left !important;
              }

              .header-row .col-md-4:nth-child(2) {
                text-align: center !important;
              }

              .header-row .col-md-4:nth-child(2) span {
                float: none !important;
                display: inline-block !important;
              }

              .header-row .col-md-4:nth-child(3) {
                text-align: right !important;
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
      const fileName = `imlakar_anukramnika_${currentDate}.pdf`;
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
            <title>इमलाकर अनुक्रमणिका</title>
            <style>
              ${styles}

              /* Print-specific styles */
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
                font-family: 'Noto Sans Devanagari', Arial, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color: #000;
                background: white;
              }

              #contentToExport {
                width: 100%;
                padding: 3px !important;
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
                padding: 0 !important;
                margin: 0 0 2px 0 !important;
                line-height: 1 !important;
              }

              .san {
                text-align: center !important;
                font-size: 10px !important;
                padding: 0 !important;
                margin: 0 0 2px 0 !important;
                line-height: 1 !important;
              }

              .font15 {
                font-size: 9px !important;
                font-weight: bold !important;
                line-height: 1 !important;
              }

              .left {
                text-align: left !important;
                float: left;
              }

              .center {
                text-align: center !important;
              }

              .center.tahsil {
                text-align: center !important;
                margin-left: 0 !important;
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
                padding: 0 5px !important;
              }

              .col-md-4:nth-child(1) {
                text-align: left !important;
              }

              .col-md-4:nth-child(2) {
                text-align: center !important;
              }

              .col-md-4:nth-child(2) span {
                float: none !important;
                display: inline-block !important;
              }

              .col-md-4:nth-child(3) {
                text-align: right !important;
              }

              .row {
                width: 100% !important;
                clear: both;
                padding: 2px 0 !important;
              }

              .header-row {
                margin-bottom: 5px !important;
              }

              .header-row .col-md-4:nth-child(1) {
                text-align: left !important;
              }

              .header-row .col-md-4:nth-child(2) {
                text-align: center !important;
              }

              .header-row .col-md-4:nth-child(2) span {
                float: none !important;
                display: inline-block !important;
              }

              .header-row .col-md-4:nth-child(3) {
                text-align: right !important;
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
}
