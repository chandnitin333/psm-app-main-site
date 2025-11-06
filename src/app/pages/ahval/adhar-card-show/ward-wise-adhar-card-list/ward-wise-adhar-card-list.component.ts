import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { ToastrService } from 'ngx-toastr';
import { AdharListService } from '../../../../services/adhar-list.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-ward-wise-adhar-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ward-wise-adhar-card-list.component.html',
  styleUrl: './ward-wise-adhar-card-list.component.css'
})
export class WardWiseAdharCardListComponent {
  receivedData : any;
  adharList: any;
  ward_number: any;
  isMobileDevice: boolean = false;

  constructor(private router: Router, private adharListService: AdharListService, private toastr: ToastrService, private spinner: LoaderService) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    this.ward_number = this.receivedData.value;
    // Check if mobile device
    this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // console.log('Namuna81Component: Received Data via Router', this.receivedData);
  }
  ngOnInit() {
  this.get_adhar_ward_wise_list();
}
get_adhar_ward_wise_list(){
  this.spinner.show();

  this.adharListService.getWard_wise_adhar_list(Number(this.receivedData.value)).subscribe({
    next: (res: any) => {
      this.adharList = res.data;
      console.log('Ward Wise Adhar List:', this.adharList);
      this.spinner.hide();
    },
    error: (err: Error) => {
      console.error('Error getting for ward wise adhar list :', err);
      this.spinner.hide();
    },
  });
}
   @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault(); // Prevent default browser print
        this.printDirect(); // Use direct browser print with our styles
      }
    }

  // Direct browser print - uses @media print CSS
  // 
  
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
        <title>Print Preview</title>
        <style>
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
            font-size: 12px !important;
            margin-bottom: 2px !important;
            line-height: 1 !important;
          }
          .padding20 {
            margin-bottom: 2px !important;
            font-size: 10px !important;
            line-height: 1 !important;
          }
          .row {
            margin-bottom: 2px !important;
            display: table !important;
            width: 100% !important;
          }
          .font15 {
            font-size: 9px !important;
            line-height: 1 !important;
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
            padding: 2px !important;
            word-wrap: break-word;
            font-size: 9px !important;
            text-align: center !important;
          }
          th {
            font-weight: bold !important;
            background-color: #f0f0f0 !important;
            padding: 3px 2px !important;
          }
          tr {
            border: 1px solid #000 !important;
            page-break-inside: avoid;
            page-break-after: auto;
          }
          .page-break {
            page-break-before: always;
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


//   downloadPDF() {
//   const element = document.getElementById('contentToExport');
//   if (element) {
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, '0');
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const year = now.getFullYear();
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const seconds = String(now.getSeconds()).padStart(2, '0');

//     const currentDate = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
//     const fileName = `आधार_कार्ड_व_वोटर_कार्ड_यादी_${currentDate}.pdf`;

//     const options = {
//       filename: fileName,
//       margin: [15, 15, 15, 15], // top, left, bottom, right (mm)
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, 
//       pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
//     };

//     html2pdf()
//       .set(options)
//       .from(element)
//       .save();
//   }
// }

 
  // downloadAndPreviewPDF1() {
  //   const element = document.getElementById('contentToExport');
  //   if (element) {
  //     const currentDate = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  //     const fileName = `आधार_कार्ड_व_वोटर_कार्ड_यादी_${currentDate}.pdf`;

  //     // Generate PDF and open in a new browser tab
  //     const options = {
  //       filename: fileName,
  //       html2canvas: {},
  //       jsPDF: { orientation: 'landscape' }, // Set orientation to 'landscape'
  //       avoidPageBreak: true // Avoid page breaks
  //     };

  //     html2pdf()
  //       .set(options)
  //       .from(element)
  //       .toPdf()
  //       .get('pdf')
  //       .then((pdf: any) => {
  //         const blob = pdf.output('blob'); // Get the PDF as a blob
  //         const blobURL = URL.createObjectURL(blob); // Create a temporary blob URL

  //         // Open the blob URL in a new tab
  //         const previewWindow = window.open(blobURL, '_blank');

  //         // Add a delay before attempting to print
  //         setTimeout(() => {
  //           // Attempt to automatically open the print dialog
  //           previewWindow?.print();
  //         }, 500); // 1000ms delay (1 second) to ensure the PDF is fully loaded
  //       });
  //   }
  // }
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
    const fileName = `आधार_कार्ड_व_वोटर_कार्ड_यादी_${currentDate}.pdf`;

    // Generate PDF and open in a new browser tab
    const options = {
      filename: fileName,
      margin: [15, 15, 15, 15], // top, left, bottom, right (mm)
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
        const blob = pdf.output('blob'); // Get the PDF as a blob
        const blobURL = URL.createObjectURL(blob); // Create a temporary blob URL

        // Open the blob URL in a new tab
        const previewWindow = window.open(blobURL, '_blank');

        // Add a delay before attempting to print
        setTimeout(() => {
          previewWindow?.print();
        }, 700); // delay to ensure the PDF is fully loaded
      });
  }
}

// Mobile PDF Download - Create blob and trigger direct download
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
  const fileName = `Adhar_Card_List_${currentDate}.pdf`;

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
        <title>आधार कार्ड व वोटर कार्ड यादी</title>
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
            font-size: 12px !important;
            margin-bottom: 2px !important;
            line-height: 1 !important;
          }
          .padding20 {
            margin-bottom: 2px !important;
            font-size: 10px !important;
            line-height: 1 !important;
          }
          .row {
            margin-bottom: 2px !important;
            display: table !important;
            width: 100% !important;
          }
          .font15 {
            font-size: 9px !important;
            line-height: 1 !important;
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
            padding: 2px !important;
            word-wrap: break-word;
            font-size: 9px !important;
            text-align: center !important;
          }
          th {
            font-weight: bold !important;
            background-color: #f0f0f0 !important;
            padding: 3px 2px !important;
          }
          tr {
            border: 1px solid #000 !important;
            page-break-inside: avoid;
            page-break-after: auto;
          }
          .page-break {
            page-break-before: always;
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
