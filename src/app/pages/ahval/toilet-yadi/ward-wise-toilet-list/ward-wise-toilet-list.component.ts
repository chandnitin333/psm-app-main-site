import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AdharListService } from '../../../../services/adhar-list.service';
import html2pdf from 'html2pdf.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ward-wise-toilet-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ward-wise-toilet-list.component.html',
  styleUrl: './ward-wise-toilet-list.component.css'
})
export class WardWiseToiletListComponent {
receivedData : any;
  adharList: any;
  ward_number: any;
  constructor(private router: Router, private adharListService: AdharListService, private toastr: ToastrService) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    this.ward_number = this.receivedData.value;
    // console.log('Namuna81Component: Received Data via Router', this.receivedData);
  }
  ngOnInit() {
  this.get_adhar_ward_wise_list();
}
get_adhar_ward_wise_list(){
  this.adharListService.getWard_wise_adhar_list(Number(this.receivedData.value)).subscribe({
    next: (res: any) => {
      this.adharList = res.data;
      console.log('Ward Wise Adhar List:', this.adharList);
    },
    error: (err: Error) => {
      console.error('Error getting for ward wise adhar list :', err);
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
  printDirect() {
    // Add print-specific styles before printing
    const style = document.createElement('style');
    style.id = 'print-style';
    style.innerHTML = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 5mm;
        }
        body * {
          visibility: hidden;
        }
        #contentToExport, #contentToExport * {
          visibility: visible;
        }
        #contentToExport {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);

    // Print
    window.print();

    // Clean up
    setTimeout(() => {
      const styleElement = document.getElementById('print-style');
      if (styleElement) {
        styleElement.remove();
      }
    }, 1000);
  }

  downloadPDF() {
        const element = document.getElementById('contentToExport');
        if (element) {
          const currentDate = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const fileName = `शौचालय_यादी_${currentDate}.pdf`;

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
            .save(); // Save the PDF directly
        }
      }
 
  downloadAndPreviewPDF() {
    const element = document.getElementById('contentToExport');
    if (element) {
      const currentDate = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const fileName = `शौचालय_यादी_${currentDate}.pdf`;

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
}
