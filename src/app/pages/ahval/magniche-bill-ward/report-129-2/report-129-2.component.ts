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
import { BillQrComponent } from '../../../../components/bill-qr/bill-qr.component';
import { ReportQrComponent } from '../../../../components/report-qr/report-qr.component';
import { ReportLinkService } from '../../../../services/report-link.service';

@Component({
  selector: 'app-report-129-2',
  standalone: true,
  imports: [CommonModule,ToastrModule,BillQrComponent,ReportQrComponent],
  templateUrl: './report-129-2.component.html',
  styleUrl: './report-129-2.component.css'
})
export class Report1292Component {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    isMobileDevice: boolean = false;
    generatedLinks: { [newuserId: number]: string } = {};
    karStatusMap: { [newuserId: number]: { gruhkar: string, panikar: string } } = {};
    isPublic: boolean = false;
    publicToken: string = '';
    reportParams: any = null;
    perRecordQrUrl: { [id: string]: string } = {};
    constructor(private router: Router, private apiService: MagnicheBillService, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService, private billPayment: BillPaymentService, private reportLink: ReportLinkService) {
      this.publicToken = this.route.snapshot.paramMap.get('token') || '';
      this.isPublic = !!this.publicToken;
      this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (this.isPublic) { this.receivedData = {}; return; }
      const encoded = sessionStorage.getItem('magnicheBillWardReport_2');
      if (encoded) {
        this.receivedData = JSON.parse(atob(encoded));
      }else{
        this.router.navigate(['/magniche-bill-ward']);
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
              this.roundNumbers(this.reportData);
              this.year = (Array.isArray(this.reportData?.yearRS42) ? this.reportData?.yearRS42?.[0]?.year : (this.reportData?.yearRS42?.currentYear ?? this.reportData?.yearRS42?.year));
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

    /** Round every numeric value so the bill shows whole numbers everywhere. */
    private roundNumbers(obj: any): void {
      if (!obj || typeof obj !== 'object') return;
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (typeof v === 'number') {
          obj[k] = Math.round(v);
        } else if (v && typeof v === 'object') {
          this.roundNumbers(v);
        }
      }
    }

    /** Actual rupee amount for a stored percentage (e.g. 5% दंड / सूट) applied
     *  to a base amount — shows the computed value instead of the raw percent. */
    pct(base: any, percent: any): number {
      return Math.round((Number(base) || 0) * (Number(percent) || 0) / 100);
    }

    /** एकूण मागणी — sum of all 5% दंड (penalty) amounts across the tax rows. */
    totalPlusAmt(item: any): number {
      const r = item?.rs4Data?.[0] || {};
      return this.pct(r.bhumi, r.plus)
        + this.pct(r.diva, r.diva_batti_plus_5)
        + this.pct(r.aarogya, r.aarogya_plus_5)
        + this.pct(r.safai, r.safae_plus_5)
        + this.pct(r.samanya, r.samanya_pani_plus_5)
        + this.pct(r.vishesh, r.vishesh_pani_plus_5);
    }

    /** एकूण मागणी — sum of all 5% सूट (discount) amounts across the tax rows. */
    totalLessAmt(item: any): number {
      const r = item?.rs4Data?.[0] || {};
      return this.pct(item?.BHUMIKAR, r.less)
        + this.pct(item?.VIZ_DIVVABATTIKAR, r.diva_batti_less_5)
        + this.pct(item?.AAROGYA_RAKSHAN_KAR, r.aarogya_less_5)
        + this.pct(item?.SAFAI_KAR, r.safae_less_5)
        + this.pct(item?.SAMANYA_PANI_KAR, r.samanya_pani_less_5)
        + this.pct(item?.VISHESH_PANI_KAR, r.vishesh_pani_less_5);
    }

    /** One bulk call → per-record report-view QR (each opens just that record). */
    private buildPerRecordQrLinks(param: any): void {
      if (this.isPublic) return;
      const rows: any[] = this.reportData?.rs3 || [];
      const ids = rows.map(r => r?.NEWUSER_ID).filter(id => id !== null && id !== undefined);
      if (ids.length === 0) return;
      this.reportLink.generateLinksBulk({
        report_key: '129-2',
        report_params: param,
        new_user_ids: ids,
      }).subscribe({
        next: (res: any) => {
          const tokens = res?.tokens || {};
          const origin = window.location.origin;
          const map: { [id: string]: string } = {};
          for (const id of Object.keys(tokens)) {
            map[id] = `${origin}/public-report/magniche-bill-ward-report-129-2/${tokens[id]}`;
          }
          this.perRecordQrUrl = map;
        },
        error: (err: any) => console.error('bulk QR link error:', err),
      });
    }

    getReportDataAPI(){
      this.spinner.show();
      const param = {
                  "ward_no": this.receivedData.ward_no || null,
                  "year": this.receivedData.year || null,
                  "start": this.receivedData.start || null,
                  "end": this.receivedData.end || null,
                  "from_year": this.receivedData.from_year || null,
                  "to_year": this.receivedData.to_year || null,
                  "new_user_id": this.receivedData.new_user_id || null,
              };
      this.reportParams = param;
      this.apiService.getMagnicheBillReport129_2(param).subscribe({
        next: (res: any) => {
          try {
            this.reportData = res.data;
            if(this.reportData?.rs3.length === 0 || this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
              this.toastr.error('No data found for the selected criteria.', 'Error');
              this.router.navigate(['/magniche-bill-ward']);
              return;
            }
            this.roundNumbers(this.reportData);
            this.year = (Array.isArray(this.reportData?.yearRS42) ? this.reportData?.yearRS42?.[0]?.year : (this.reportData?.yearRS42?.currentYear ?? this.reportData?.yearRS42?.year))
            this.end_year = Number(this.year) + 1;
            this.loadKarStatuses();
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

    loadKarStatuses(): void {
      const ids = (this.reportData?.rs3 ?? [])
        .map((r: any) => Number(r?.NEWUSER_ID))
        .filter((n: number) => Number.isFinite(n) && n > 0);
      if (!ids.length) return;
      // Status is year+report scoped: this is the 129-2 report.
      this.billPayment.karStatusByNewusers(ids, this.receivedData?.year, '129-2').subscribe({
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
      // Same amount split as 129-1: पाणी कर = h (विशेष पाणी कर),
      // गृहकर = b + d + e + f + g; एकूण = both.
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
        report_type: '129-2',
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
        const fileName = `imlakar_129_2_${currentDate}.pdf`;

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
              .hidden-print { display: none !important; }
              .bill-qr-block {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 6px !important;
                margin: 1px 0 !important;
                padding: 0 !important;
                page-break-inside: avoid;
              }
              .bill-qr-img {
                width: 52px !important;
                height: 52px !important;
                border: 1px solid #000 !important;
                padding: 1px !important;
                background: #fff !important;
              }
              .bill-qr-caption { font-size: 9px !important; line-height: 1.2 !important; text-align: left !important; }
              .bill-qr-sub { font-size: 8px !important; }
              @page {
                size: A4 landscape;
                margin: 10mm 5mm 8mm 20mm;
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
                line-height: 1.4 !important;
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
      const fileName = `imlakar_129_2_${currentDate}.pdf`;

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
              .hidden-print { display: none !important; }
              .bill-qr-block {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 6px !important;
                margin: 1px 0 !important;
                padding: 0 !important;
                page-break-inside: avoid;
              }
              .bill-qr-img {
                width: 52px !important;
                height: 52px !important;
                border: 1px solid #000 !important;
                padding: 1px !important;
                background: #fff !important;
              }
              .bill-qr-caption { font-size: 9px !important; line-height: 1.2 !important; text-align: left !important; }
              .bill-qr-sub { font-size: 8px !important; }
              @page {
                size: A4 landscape;
                margin: 10mm 5mm 8mm 20mm;
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
                line-height: 1.4 !important;
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
