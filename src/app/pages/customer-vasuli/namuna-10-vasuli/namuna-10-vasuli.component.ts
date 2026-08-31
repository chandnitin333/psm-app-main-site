import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { CustomerService } from '../../../services/customer.service';
import { ApiService } from '../../../services/api.service';
import { numberToMarathiWords } from '../../../utils/utils';

@Component({
  selector: 'app-namuna-10-vasuli',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './namuna-10-vasuli.component.html',
  styleUrl: './namuna-10-vasuli.component.css'
})
export class Namuna10VasuliComponent {
receivedData: any;
namuna_10_data: any;
userDetails: any = [];
akshariRs:string = '';
currentYear: number = new Date().getFullYear();
currentDate: Date = new Date();

  constructor(private router: Router, private customerService: CustomerService,private apiService: ApiService,) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    console.log('Namuna10VasuliComponent: Received Data via Router', this.receivedData);
  }

ngOnInit() {
  this.userDetails = this.apiService.getDecodedToken();
  this.get_namuna_10_vasuli_data();
  console.log('userDetails total', this.namuna_10_data?.EKUN_JAMMA_KELELI_RAKKAM);

  
}
get_namuna_10_vasuli_data(){
  this.customerService.getVasuliByid(this.receivedData.value).subscribe({
    next: (res: any) => {
      this.namuna_10_data = res.data[0];
      console.log('Namuna 10 Data:', this.namuna_10_data);
      this.akshariRs = numberToMarathiWords(Number(this.namuna_10_data?.EKUN_JAMMA_KELELI_RAKKAM))
    },
    error: (err: Error) => {
      console.error('Error getting for namuna 10 Vasuli:', err);
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
    const currentDate = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    const fileName = `नमुना_10_कराबद्दल_पावती_${currentDate}.pdf`;

    const options = {
      filename: fileName,
      margin: [20, 20, 20, 20], // [top, left, bottom, right] in mm
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf()
      .set(options)
      .from(element)
      .save(); // Directly download PDF
  }
}

  downloadAndPreviewPDF() {
  const element = document.getElementById('contentToExport');
  if (element) {
    const currentDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const fileName = `नमुना_10_कराबद्दल_पावती_${currentDate}.pdf`;

    const options = {
      filename: fileName,
      margin: [20, 20, 20, 20],  // [top, left, bottom, right] margin in mm
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // prevent table cuts
    };

    html2pdf()
      .set(options)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        const blob = pdf.output('blob');
        const blobURL = URL.createObjectURL(blob);

        // Open in new tab
        const previewWindow = window.open(blobURL, '_blank');

        // Print after load
        setTimeout(() => {
          previewWindow?.print();
        }, 800);
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
          <title>नमुना १० कराबद्दल पावती</title>
          <style>
            ${styles}

            /* Print-specific styles */
            @page {
              size: A4 portrait;
              margin: 10mm;
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
              font-size: 15px !important;
              margin: 4px 0 !important;
            }

            th, td {
              border: 1px solid #000 !important;
              padding: 5px 4px !important;
              font-size: 15px !important;
              text-align: center !important;
              vertical-align: middle !important;
              line-height: 1.25 !important;
              word-break: keep-all !important;
            }

            th {
              font-weight: bold !important;
              background: #f2f2f2 !important;
            }

            .heading {
              text-align: center !important;
              font-size: 19px !important;
              font-weight: bold !important;
              padding: 4px 0 !important;
              margin: 4px 0 !important;
              line-height: 1.3 !important;
            }

            .san {
              text-align: center !important;
              font-size: 14px !important;
              padding: 3px 0 !important;
              margin: 3px 0 !important;
              line-height: 1.3 !important;
            }

            .font15 {
              font-size: 13px !important;
              font-weight: bold !important;
              line-height: 1.3 !important;
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

            .container-fluid {
              padding: 5px !important;
            }

            .col-md-4 {
              width: 33.33% !important;
              float: left;
            }

            .row {
              width: 100% !important;
              clear: both;
              padding: 3px 0 !important;
              margin: 2px 0 !important;
            }

            .row::after {
              content: "";
              display: table;
              clear: both;
            }

            p {
              font-size: 11px !important;
              line-height: 1.3 !important;
              padding: 3px 0 !important;
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

}
