import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ImlakarService } from '../../../../services/imlakar.service';
import { Namuna8Service } from '../../../../services/namuna8.service';
import { ApiService } from '../../../../services/api.service';
import { LoaderService } from '../../../../services/loader.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportQrComponent } from '../../../../components/report-qr/report-qr.component';
import { ReportLinkService } from '../../../../services/report-link.service';

@Component({
  selector: 'app-namuna-8-images',
  standalone: true,
  imports: [CommonModule,ToastrModule,ReportQrComponent],
  templateUrl: './namuna-8-images.component.html',
  styleUrl: './namuna-8-images.component.css'
})
export class Namuna8ImagesComponent {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    file_baseUrl= "";
    isMobileDevice: boolean = false;
    isPublic: boolean = false;     // opened via QR scan — no login
    publicToken: string = '';
    reportParams: any = null;      // params for QR link generation
    perRecordQrUrl: { [id: string]: string } = {};   // one scanner per record
    constructor(private router: Router, private apiService: Namuna8Service, private route: ActivatedRoute, private toastr: ToastrService, private api: ApiService, private spinner: LoaderService,
      private reportLink: ReportLinkService) {
      this.publicToken = this.route.snapshot.paramMap.get('token') || '';
      this.isPublic = !!this.publicToken;
      const encoded = sessionStorage.getItem('namuna8imgaesform');
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
        this.file_baseUrl= this.api.file_baseUrl;

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
              if (this.reportData?.from_to_year?.from_year === 0 && this.reportData?.from_to_year?.to_year === 0) {
                this.reportData.from_to_year.from_year = Number(this.year) + 3;
                this.reportData.from_to_year.to_year = Number(this.year) + 4;
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
      // Show loader before API call
      this.spinner.show();

      const param =
              {
                "ward": this.receivedData.ward_no || 0,
                "year":this.receivedData.year || 0,
                "start": this.receivedData.start || 0,
                "end":this.receivedData.end || 0,
                "new_user_id":this.receivedData.new_user_id || null,
                "from_year":this.receivedData.year1 || 0,
                "to_year":this.receivedData.toYear1 || 0,
            };
      this.reportParams = param;   // QR link uses the exact same params
      this.apiService.getNamuna8Images(param).subscribe({
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

            if( this.reportData?.from_to_year?.from_year === 0 && this.reportData?.from_to_year?.to_year === 0){
              this.reportData.from_to_year.from_year = Number(this.year) + 3;
              this.reportData.from_to_year.to_year = Number(this.year) + 4;
            }
            this.buildPerRecordQrLinks(param);
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
    /** One bulk call → per-record QR (each record opens just itself, with images). */
    private buildPerRecordQrLinks(param: any): void {
      if (this.isPublic) return;
      const rows: any[] = this.reportData?.rs3 || [];
      const ids = rows.map(r => r?.NEWUSER_ID).filter(id => id !== null && id !== undefined);
      if (ids.length === 0) return;
      this.reportLink.generateLinksBulk({
        report_key: 'namuna-8-images',
        report_params: param,
        new_user_ids: ids,
      }).subscribe({
        next: (res: any) => {
          const tokens = res?.tokens || {};
          const origin = window.location.origin;
          const map: { [id: string]: string } = {};
          for (const id of Object.keys(tokens)) {
            map[id] = `${origin}/public-report/namuna-8-images/${tokens[id]}`;
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

    // Direct browser print - uses @media print CSS with landscape orientation
    async printDirect() {
      const printContent = document.getElementById('contentToExport');
      if (!printContent) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      // Placeholder shown immediately while we prepare a self-contained doc.
      printWindow.document.write('<!doctype html><html><head><meta charset="UTF-8"><title>Print Preview</title></head><body style="font-family:sans-serif;padding:24px;font-size:16px;color:#333">रिपोर्ट तयार करत आहे, कृपया प्रतीक्षा करा…</body></html>');

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

      // Inline every image as a data URL so the print tab makes NO network
      // requests — it renders instantly instead of re-fetching 100s of images.
      const printBody = printContent.cloneNode(true) as HTMLElement;
      await this.inlinePrintImages(printBody);

      // Write content to print window
      printWindow.document.open();
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
              #contentToExport .qr-anchor-row { min-height: 122px !important; position: relative !important; }
              #contentToExport .qr-anchor { position: absolute !important; top: 0 !important; left: 0 !important; right: auto !important; z-index: 10 !important; }
              #contentToExport .report-qr-img { width: 86px !important; height: 86px !important; border: 1px solid #000 !important; background: #fff !important; padding: 1px !important; }
              #contentToExport .report-qr-caption { font-size: 11px !important; line-height: 1.1 !important; display: block !important; text-align: center !important; }
              #contentToExport .report-qr-block { display: inline-flex !important; flex-direction: column !important; align-items: center !important; }
              .photo-cell { position: relative !important; }
              .n8-photo { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; object-fit: fill !important; display: block !important; }
              @page {
                size: A4 landscape;
                margin: 24mm 8mm 8mm 12mm;
              }
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
              body {
                margin: 0 !important;
                padding: 0 !important;
              }
              p {
                margin: 0 !important;
                padding: 0 !important;
              }
              div {
                margin: 0 !important;
                padding: 0 !important;
              }
              span {
                margin: 0 !important;
                padding: 0 !important;
              }
              .container-fluid {
                padding: 0 !important;
                margin: 0 !important;
              }
              /* Fixed 1450px report scaled to fit A4 landscape — wide columns,
                 no word-wrap (matches the new project's print). */
              #contentToExport {
                width: 1450px !important;
                margin: 0 auto !important;
                padding: 0 !important;
                zoom: 0.7;
              }
              .page-break {
                page-break-before: always !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .page-break:first-child {
                page-break-before: avoid !important;
              }
              .heading {
                font-size: 30px !important;
                margin-bottom: 3px !important;
                line-height: 1.4 !important;
                padding-top: 0 !important;
                font-weight: bold !important;
              }
              .san {
                font-size: 23px !important;
                margin-bottom: 3px !important;
                line-height: 1.3 !important;
              }
              .font15 {
                font-size: 19px !important;
                line-height: 1.3 !important;
                white-space: nowrap !important;
              }
              .col-md-12 {
                padding: 0 !important;
                margin: 0 !important;
              }
              .col-md-4 {
                display: table-cell !important;
                width: 33.33% !important;
                vertical-align: middle !important;
                padding: 0 !important;
              }
              .col-md-4:nth-child(1) {
                text-align: left !important;
              }
              .col-md-4:nth-child(2) {
                text-align: center !important;
              }
              .col-md-4:nth-child(3) {
                text-align: right !important;
              }
              .col-md-4 span {
                display: block !important;
                width: 100% !important;
              }
              .col-md-4:nth-child(1) span,
              .col-md-4:nth-child(1) .font15 {
                text-align: left !important;
              }
              .col-md-4:nth-child(2) span,
              .col-md-4:nth-child(2) .font15,
              .center.tahsil span,
              .center.tahsil .font15 {
                text-align: center !important;
                display: block !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                padding-left: 100px !important;
              }
              .col-md-4:nth-child(3) span,
              .col-md-4:nth-child(3) .font15 {
                text-align: right !important;
              }
              .col-md-8 {
                display: table-cell !important;
                width: 66.66% !important;
                padding: 0 !important;
              }
              .col-md-4 .font15.right,
              .col-md-4 > span.right {
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .row {
                margin-bottom: 3px !important;
                display: table !important;
                width: 100% !important;
                table-layout: fixed !important;
              }
              .left {
                float: none !important;
                text-align: left !important;
                display: block !important;
              }
              .center,
              .center.tahsil {
                text-align: center !important;
                margin-left: 0 !important;
                display: block !important;
              }
              .right {
                float: none !important;
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .font15.left {
                text-align: left !important;
              }
              .font15.right {
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .table-responsive {
                margin-top: 3px !important;
                overflow-x: visible !important;
                padding: 0 !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin: 0 !important;
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
                padding: 5px 2px !important;
                word-wrap: break-word;
                font-size: 15px !important;
                text-align: center !important;
                line-height: 1.25 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
                padding: 5px 2px !important;
                font-size: 15px !important;
              }
              tr[style*="font-weight:bold"] td,
              td b,
              td strong {
                font-weight: bold !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid !important;
              }
              .heading,
              .row {
                page-break-inside: avoid !important;
              }
              .page-break {
                page-break-inside: avoid !important;
              }
              table {
                page-break-inside: avoid !important;
              }
              .table-responsive {
                page-break-inside: avoid !important;
              }
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            ${printBody.outerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();

      // Images are inline data URLs → render is immediate. Print once.
      let printed = false;
      const doPrint = () => {
        if (printed) return;
        printed = true;
        try {
          printWindow.focus();
          printWindow.onafterprint = () => { printWindow.close(); };
          printWindow.print();
        } catch { /* ignore */ }
      };
      printWindow.onload = doPrint;
      setTimeout(doPrint, 600);   // fallback if onload already fired
    }

    /** Replace each <img> src with an inline data URL (fetched once, from the
     *  resized ?w=600 endpoint + browser cache). The print tab then needs no
     *  network at all, so the preview renders immediately. QR images are
     *  already data URLs and are skipped. */
    private async inlinePrintImages(root: HTMLElement): Promise<void> {
      const imgs = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
      await Promise.all(imgs.map(async (img) => {
        const src = img.getAttribute('src') || '';
        if (!src || src.startsWith('data:')) return;   // QR / already inline
        try {
          const resp = await fetch(src, { cache: 'force-cache' });
          const blob = await resp.blob();
          const dataUrl: string = await new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result as string);
            fr.onerror = reject;
            fr.readAsDataURL(blob);
          });
          this.applyPrintImage(img, dataUrl);
        } catch {
          /* fetch failed (e.g. CORS) — fall back to the original network URL */
          this.applyPrintImage(img, src);
        }
      }));
    }

    /* Property photo must FILL its cell in print. object-fit/absolute on an <img>
       is unreliable in real-Chrome print (td isn't a reliable containing block and
       zoom breaks height:100%). Painting the image as the cell's background with
       background-size:100% 100% fills the box in every environment. */
    private applyPrintImage(img: HTMLImageElement, url: string): void {
      if (img.classList.contains('n8-photo')) {
        const cell = img.closest('td') as HTMLElement | null;
        if (cell) {
          cell.style.backgroundImage = `url("${url}")`;
          cell.style.backgroundSize = '100% 100%';
          cell.style.backgroundRepeat = 'no-repeat';
          cell.style.backgroundPosition = 'center';
          // force the background to actually print (browsers skip background graphics otherwise)
          cell.style.setProperty('-webkit-print-color-adjust', 'exact', 'important');
          cell.style.setProperty('print-color-adjust', 'exact', 'important');
          // remove the <img> entirely — hiding via display:none is overridden by
          // the `.n8-photo { display: block !important }` print rule, which would
          // otherwise show the photo twice (background + img).
          img.remove();
          return;
        }
      }
      img.setAttribute('src', url);
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
        const fileName = `नमुना_८_images_${currentDate}.pdf`;

        const options = {
          filename: fileName,
          margin: [15, 15, 15, 15],
          image: { type: 'jpeg', quality: 0.6 },
          html2canvas: { scale: 1.5, useCORS: true },
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
        const fileName = `नमुना_८_images_${currentDate}.pdf`;

        const options = {
          filename: fileName,
          margin: [15, 15, 15, 15],
          image: { type: 'jpeg', quality: 0.6 },
          html2canvas: { scale: 1.5, useCORS: true },
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
    const fileName = `namuna_8_images_${currentDate}.pdf`;

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
              #contentToExport .qr-anchor-row { min-height: 122px !important; position: relative !important; }
              #contentToExport .qr-anchor { position: absolute !important; top: 0 !important; left: 0 !important; right: auto !important; z-index: 10 !important; }
              #contentToExport .report-qr-img { width: 86px !important; height: 86px !important; border: 1px solid #000 !important; background: #fff !important; padding: 1px !important; }
              #contentToExport .report-qr-caption { font-size: 11px !important; line-height: 1.1 !important; display: block !important; text-align: center !important; }
              #contentToExport .report-qr-block { display: inline-flex !important; flex-direction: column !important; align-items: center !important; }
              .photo-cell { position: relative !important; }
              .n8-photo { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; object-fit: fill !important; display: block !important; }
              @page {
                size: A4 landscape;
                margin: 24mm 8mm 8mm 12mm;
              }
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
              body {
                margin: 0 !important;
                padding: 0 !important;
              }
              p {
                margin: 0 !important;
                padding: 0 !important;
              }
              div {
                margin: 0 !important;
                padding: 0 !important;
              }
              span {
                margin: 0 !important;
                padding: 0 !important;
              }
              .container-fluid {
                padding: 0 !important;
                margin: 0 !important;
              }
              /* Fixed 1450px report scaled to fit A4 landscape — wide columns,
                 no word-wrap (matches the new project's print). */
              #contentToExport {
                width: 1450px !important;
                margin: 0 auto !important;
                padding: 0 !important;
                zoom: 0.7;
              }
              .page-break {
                page-break-before: always !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .page-break:first-child {
                page-break-before: avoid !important;
              }
              .heading {
                font-size: 30px !important;
                margin-bottom: 3px !important;
                line-height: 1.4 !important;
                padding-top: 0 !important;
                font-weight: bold !important;
              }
              .san {
                font-size: 23px !important;
                margin-bottom: 3px !important;
                line-height: 1.3 !important;
              }
              .font15 {
                font-size: 19px !important;
                line-height: 1.3 !important;
                white-space: nowrap !important;
              }
              .col-md-12 {
                padding: 0 !important;
                margin: 0 !important;
              }
              .col-md-4 {
                display: table-cell !important;
                width: 33.33% !important;
                vertical-align: middle !important;
                padding: 0 !important;
              }
              .col-md-4:nth-child(1) {
                text-align: left !important;
              }
              .col-md-4:nth-child(2) {
                text-align: center !important;
              }
              .col-md-4:nth-child(3) {
                text-align: right !important;
              }
              .col-md-4 span {
                display: block !important;
                width: 100% !important;
              }
              .col-md-4:nth-child(1) span,
              .col-md-4:nth-child(1) .font15 {
                text-align: left !important;
              }
              .col-md-4:nth-child(2) span,
              .col-md-4:nth-child(2) .font15,
              .center.tahsil span,
              .center.tahsil .font15 {
                text-align: center !important;
                display: block !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                padding-left: 100px !important;
              }
              .col-md-4:nth-child(3) span,
              .col-md-4:nth-child(3) .font15 {
                text-align: right !important;
              }
              .col-md-8 {
                display: table-cell !important;
                width: 66.66% !important;
                padding: 0 !important;
              }
              .col-md-4 .font15.right,
              .col-md-4 > span.right {
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .row {
                margin-bottom: 3px !important;
                display: table !important;
                width: 100% !important;
                table-layout: fixed !important;
              }
              .left {
                float: none !important;
                text-align: left !important;
                display: block !important;
              }
              .center,
              .center.tahsil {
                text-align: center !important;
                margin-left: 0 !important;
                display: block !important;
              }
              .right {
                float: none !important;
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .font15.left {
                text-align: left !important;
              }
              .font15.right {
                text-align: right !important;
                display: block !important;
                width: 100% !important;
              }
              .table-responsive {
                margin-top: 3px !important;
                overflow-x: visible !important;
                padding: 0 !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin: 0 !important;
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
                padding: 5px 2px !important;
                word-wrap: break-word;
                font-size: 15px !important;
                text-align: center !important;
                line-height: 1.25 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
                padding: 5px 2px !important;
                font-size: 15px !important;
              }
              tr[style*="font-weight:bold"] td,
              td b,
              td strong {
                font-weight: bold !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid !important;
              }
              .heading,
              .row {
                page-break-inside: avoid !important;
              }
              .page-break {
                page-break-inside: avoid !important;
              }
              table {
                page-break-inside: avoid !important;
              }
              .table-responsive {
                page-break-inside: avoid !important;
              }
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
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
        const fileName = `namuna_8_images_${currentDate}.pdf`;

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

          // Capture this specific page. scale 1.5 (not 2) keeps text readable
          // while roughly halving pixel area, and the photo is downsampled to
          // its display size — so output size stays bounded regardless of how
          // large the source images are.
          const canvas = await html2canvas(pageElement, {
            scale: 1.5,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });

          // Add a new page for each record (except the first one)
          if (i > 0) {
            pdf.addPage();
          }

          // JPEG (compressed) instead of PNG (lossless) — this is the single
          // biggest size win: a full-page PNG can be 10-15x larger than JPEG.
          const imgData = canvas.toDataURL('image/jpeg', 0.6);

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

          // Add image to PDF with margins (JPEG + FAST compression)
          pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
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
