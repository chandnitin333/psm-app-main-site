import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Namuna8Service } from '../../../../services/namuna8.service';
import html2pdf from 'html2pdf.js';

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
  constructor(private router: Router, private apiService: Namuna8Service, private route: ActivatedRoute) {
    const encoded = sessionStorage.getItem('Namuna8anukramanikaForm');
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
    const param = {
                "ward": this.receivedData.ward_no,
                "year": this.receivedData.year,
                "start": this.receivedData.start,
                "end": this.receivedData.end
            }
    this.apiService.getAnukramikaData(param).subscribe({
      next: (res: any) => {
        this.reportData = res.data;
        console.log('Reponse Data:', this.reportData);
      },
      error: (err: Error) => {
        console.error('Error getting for anukramika list :', err);
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

  // Direct browser print - uses @media print CSS with portrait orientation
  printDirect() {
    const printContent = document.getElementById('contentToExport');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
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
          <title>Print Preview</title>
          <style>
            ${styles}
            @page {
              size: A4 portrait;
              margin: 15mm 12mm;
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
            #contentToExport {
              width: 100% !important;
            }
            .heading {
              font-size: 14px !important;
              margin-bottom: 4px !important;
              padding-top: 0 !important;
              font-weight: bold !important;
            }
            .san {
              font-size: 12px !important;
              margin-bottom: 3px !important;
            }
            .font15 {
              font-size: 11px !important;
              white-space: nowrap !important;
            }
            .row {
              margin-bottom: 3px !important;
              display: table !important;
              width: 100% !important;
              table-layout: fixed !important;
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
            .col-md-4.center,
            .col-md-4.center.tahsil {
              display: table-cell !important;
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
              white-space: nowrap !important;
              display: block !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .col-md-4:nth-child(3) span,
            .col-md-4:nth-child(3) .font15 {
              text-align: right !important;
            }
            .left {
              float: none !important;
              text-align: left !important;
              display: block !important;
            }
            .center,
            .center.tahsil {
              text-align: center !important;
              display: block !important;
              margin-left: 0 !important;
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
              margin-top: 5px !important;
              overflow-x: visible !important;
              padding: 0 !important;
              width: 100% !important;
            }
            table {
              width: 100% !important;
              max-width: 100% !important;
              border-collapse: collapse !important;
              margin-top: 5px !important;
              table-layout: auto !important;
            }
            thead {
              display: table-header-group !important;
            }
            tbody {
              display: table-row-group !important;
            }
            th, td {
              border: 1px solid #000 !important;
              padding: 4px 5px !important;
              font-size: 10px !important;
              text-align: center !important;
              word-wrap: break-word !important;
              line-height: 1.4 !important;
              box-sizing: border-box !important;
            }
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
              padding: 5px 5px !important;
              font-size: 11px !important;
            }
            tr {
              border: 1px solid #000 !important;
              page-break-inside: avoid !important;
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
      printWindow.print();

      // Auto-close after print (optional)
      setTimeout(() => printWindow.close(), 1000);
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
}
