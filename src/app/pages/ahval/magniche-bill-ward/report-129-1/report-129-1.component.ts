import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MagnicheBillService } from '../../../../services/magniche-bill.service';
import { LoaderService } from '../../../../services/loader.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BillPaymentService } from '../../../../services/bill-payment.service';

@Component({
  selector: 'app-report-129-1',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './report-129-1.component.html',
  styleUrl: './report-129-1.component.css'
})
export class Report1291Component {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
     isMobileDevice: boolean = false;
    generatedLinks: { [newuserId: number]: string } = {};
    karStatusMap: { [newuserId: number]: { gruhkar: string, panikar: string } } = {};
    constructor(private router: Router, private apiService: MagnicheBillService, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService, private billPayment: BillPaymentService) {
      const encoded = sessionStorage.getItem('magnicheBillWardReport');
      this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (encoded) {
        this.receivedData = JSON.parse(atob(encoded));
        console.log('Encoded Data from sessionStorage:', this.receivedData);
      }else{
        if(this.receivedData.new_user_id == null){
          this.router.navigate(['/magniche-bill-ward']);
        }else{
          this.router.navigate(['/magniche-bill']);
        }
      }
      console.log('Namuna81Component: Received Data via Router', this.receivedData);
    }

    ngOnInit() {
        this.getReportDataAPI();

    }
    getReportDataAPI(){
      const param = {
                  "ward_no": this.receivedData.ward_no || null,
                  "year": this.receivedData.year || null,
                  "start": this.receivedData.start || null,
                  "end": this.receivedData.end || null,
                  "from_year": this.receivedData.from_year || null,
                  "to_year": this.receivedData.to_year || null,
                  "new_user_id": this.receivedData.new_user_id || null,
              };
      this.spinner.show();
      this.apiService.getMagnicheBillReport129_1(param).subscribe({
        next: (res: any) => {
          try {
            this.reportData = res.data;
            if(this.reportData?.rs3.length === 0 || this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
              this.toastr.error('No data found for the selected criteria.', 'Error');
              this.router.navigate(['/magniche-bill']);
              return;
            }
            this.year = this.reportData?.yearRs42?.YEAR_ID
            this.end_year = Number(this.year) + 1;
            this.loadKarStatuses();
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

    loadKarStatuses(): void {
      const ids = (this.reportData?.rs3 ?? [])
        .map((r: any) => Number(r?.NEWUSER_ID))
        .filter((n: number) => Number.isFinite(n) && n > 0);
      if (!ids.length) return;
      // Status is year+report scoped: pass the selected year and this
      // report's type so badges reflect only this bill's payments.
      this.billPayment.karStatusByNewusers(ids, this.receivedData?.year, '129-1').subscribe({
        next: (res: any) => {
          this.karStatusMap = res?.data ?? {};
        },
        error: (err: any) => console.error('Error loading kar statuses:', err),
      });
    }

    karStatus(newuserId: number, karType: 'gruhkar' | 'panikar'): string {
      return this.karStatusMap[newuserId]?.[karType] ?? 'pending';
    }

    karStatusLabel(newuserId: number, karType: 'gruhkar' | 'panikar'): string {
      switch (this.karStatus(newuserId, karType)) {
        case 'verified': return 'भरले ✓';
        case 'claimed': return 'पडताळणी बाकी';
        default: return 'बाकी';
      }
    }

    generatePaymentLink(itemRs3: any): void {
      const newuserId = itemRs3?.NEWUSER_ID;
      if (!newuserId) {
        this.toastr.error('NEWUSER_ID सापडला नाही', 'Error');
        return;
      }
      if (this.generatedLinks[newuserId]) {
        this.copyLink(this.generatedLinks[newuserId]);
        return;
      }
      // Amounts must match the printed bill (each alphabet already includes
      // थकबाकी + चालू with ५% दंड/सूट applied):
      //   पाणी कर QR   = विशेष पाणी कर only (h)
      //   गृहकर QR     = everything else (b + d + e + f + g)
      //   एकूण मागणी   = both together
      const al = itemRs3?.rs4Data?.[0]?.alphabets ?? {};
      const gruhkarAmount =
        (al.b ?? 0) + (al.d ?? 0) + (al.e ?? 0) +
        (al.f ?? 0) + (al.g ?? 0);
      const paniAmount = (al.h ?? 0);
      const billData = {
        khatedar_name: itemRs3?.HOMEUSER_NAME,
        malmatta_number: itemRs3?.MALMATTA_NUMBER,
        annu_kramank: itemRs3?.ANNU_KRAMANK,
        total_amount: Math.round((gruhkarAmount + paniAmount) * 100) / 100,
        gruhkar_amount: Math.round(gruhkarAmount * 100) / 100,
        pani_amount: Math.round(paniAmount * 100) / 100,
      };
      this.billPayment.generateLink({
        newuser_id: newuserId,
        ward_no: itemRs3?.VARD_NUMBER ?? this.receivedData?.ward_no,
        year_id: this.receivedData?.year,
        report_type: '129-1',
        bill_data: billData,
      }).subscribe({
        next: (res: any) => {
          if (res?.status === 201 && res?.token) {
            const url = `${window.location.origin}/bill-pay/${res.token}`;
            this.generatedLinks[newuserId] = url;
            this.copyLink(url);
          } else {
            this.toastr.error(res?.message || 'लिंक तयार होऊ शकली नाही', 'Error');
          }
        },
        error: (err: any) => {
          console.error('Error generating payment link:', err);
          this.toastr.error('लिंक तयार होऊ शकली नाही', 'Error');
        },
      });
    }

    copyLink(url: string): void {
      const onSuccess = () => this.toastr.success('पेमेंट लिंक कॉपी झाली: ' + url, 'यशस्वी', { timeOut: 6000 });
      const fallback = () => {
        // execCommand fallback — works on non-secure origins (e.g. IP access)
        // where navigator.clipboard is unavailable.
        try {
          const ta = document.createElement('textarea');
          ta.value = url;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          const ok = document.execCommand('copy');
          document.body.removeChild(ta);
          if (ok) onSuccess();
          else this.toastr.info(url, 'पेमेंट लिंक (मॅन्युअली कॉपी करा)', { timeOut: 10000, closeButton: true });
        } catch {
          this.toastr.info(url, 'पेमेंट लिंक (मॅन्युअली कॉपी करा)', { timeOut: 10000, closeButton: true });
        }
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(onSuccess).catch(fallback);
      } else {
        fallback();
      }
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

      // PDF generation with margins - Landscape orientation
      const pageWidth = 297;
      const pageHeight = 210;
      const leftMargin = 10;
      const rightMargin = 10;
      const topMargin = 5;
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
          orientation: 'landscape',
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
        const fileName = `imlakar_129_1_${currentDate}.pdf`;

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
                margin: 10mm 8mm 8mm 8mm;
              }
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                padding-top: 5mm !important;
              }
              .heading {
                font-size: 16px !important;
                margin-bottom: 3px !important;
                line-height: 1.2 !important;
              }
              .headingM {
                font-size: 14px !important;
                margin-bottom: 3px !important;
                line-height: 1.2 !important;
              }
              .san {
                font-size: 12px !important;
                line-height: 1.2 !important;
              }
              .padding20 {
                margin-bottom: 3px !important;
                font-size: 12px !important;
                line-height: 1.2 !important;
              }
              .row {
                margin-bottom: 3px !important;
                display: table !important;
                width: 100% !important;
              }
              .container-fluid > .row > .row {
                page-break-after: always !important;
                margin-bottom: 0 !important;
              }
              .font15 {
                font-size: 11px !important;
                line-height: 1.2 !important;
              }
              .table-responsive {
                margin-top: 4px !important;
                overflow-x: visible !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 4px !important;
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
                font-size: 11px !important;
                text-align: center !important;
                line-height: 1.3 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
                padding: 5px 3px !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid;
                page-break-after: auto;
              }
              .page-break {
                page-break-before: always;
              }
              .container-fluid {
                width: 95% !important;
                display: block !important;
                clear: both !important;
                margin: 0 auto !important;
                padding: 0 !important;
              }
              .col-md-6 {
                width: 49.5% !important;
                float: left !important;
                padding: 0 4mm !important;
                box-sizing: border-box !important;
              }
              .dotted-border-right {
                border-right: 2px dashed #000 !important;
                margin-right: 0.5% !important;
                padding-right: 4mm !important;
              }
              .col-md-6:last-child {
                padding-left: 4mm !important;
              }
              .col-md-12 {
                width: 100% !important;
              }
              .col-md-4 {
                width: 33.33% !important;
                float: left !important;
              }
              .sign {
                text-align: right !important;
                font-size: 11px !important;
                margin-top: 8px !important;
                padding-top: 5px !important;
              }
              .tip {
                font-size: 10px !important;
                line-height: 1.2 !important;
                margin-top: 3px !important;
                padding: 2px 0 !important;
              }
              .namna {
                text-align: center !important;
                margin-bottom: 4px !important;
                padding-top: 3px !important;
              }
              p {
                font-size: 10px !important;
                line-height: 1.4 !important;
                margin: 3px 0 !important;
                padding: 2px !important;
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
      const fileName = `imlakar_129_1_${currentDate}.pdf`;

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
                margin: 10mm 8mm 8mm 8mm;
              }
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                padding-top: 5mm !important;
              }
              .heading {
                font-size: 16px !important;
                margin-bottom: 3px !important;
                line-height: 1.2 !important;
              }
              .headingM {
                font-size: 14px !important;
                margin-bottom: 3px !important;
                line-height: 1.2 !important;
              }
              .san {
                font-size: 12px !important;
                line-height: 1.2 !important;
              }
              .padding20 {
                margin-bottom: 3px !important;
                font-size: 12px !important;
                line-height: 1.2 !important;
              }
              .row {
                margin-bottom: 3px !important;
                display: table !important;
                width: 100% !important;
              }
              .container-fluid > .row > .row {
                page-break-after: always !important;
                margin-bottom: 0 !important;
              }
              .font15 {
                font-size: 11px !important;
                line-height: 1.2 !important;
              }
              .table-responsive {
                margin-top: 4px !important;
                overflow-x: visible !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 4px !important;
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
                font-size: 11px !important;
                text-align: center !important;
                line-height: 1.3 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
                padding: 5px 3px !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid;
                page-break-after: auto;
              }
              .page-break {
                page-break-before: always;
              }
              .container-fluid {
                width: 95% !important;
                display: block !important;
                clear: both !important;
                margin: 0 auto !important;
                padding: 0 !important;
              }
              .col-md-6 {
                width: 49.5% !important;
                float: left !important;
                padding: 0 4mm !important;
                box-sizing: border-box !important;
              }
              .dotted-border-right {
                border-right: 2px dashed #000 !important;
                margin-right: 0.5% !important;
                padding-right: 4mm !important;
              }
              .col-md-6:last-child {
                padding-left: 4mm !important;
              }
              .col-md-12 {
                width: 100% !important;
              }
              .col-md-4 {
                width: 33.33% !important;
                float: left !important;
              }
              .sign {
                text-align: right !important;
                font-size: 11px !important;
                margin-top: 8px !important;
                padding-top: 5px !important;
              }
              .tip {
                font-size: 10px !important;
                line-height: 1.2 !important;
                margin-top: 3px !important;
                padding: 2px 0 !important;
              }
              .namna {
                text-align: center !important;
                margin-bottom: 4px !important;
                padding-top: 3px !important;
              }
              p {
                font-size: 10px !important;
                line-height: 1.4 !important;
                margin: 3px 0 !important;
                padding: 2px !important;
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
