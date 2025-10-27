import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-namuna-8-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './namuna-8-1.component.html',
  styleUrl: './namuna-8-1.component.css'
})
export class Namuna81Component{
  receivedData: any;
  namuna_8_1_data: any;

  constructor(private router: Router, private customerService: CustomerService,) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    // console.log('Namuna81Component: Received Data via Router', this.receivedData);
  }

ngOnInit() {
  this.get_namuna_8_1_data();
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
      printWindow.print();

      // Auto-close window after print
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  }

}
