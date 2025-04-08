import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-namuna-8-sarkari',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './namuna-8-sarkari.component.html',
  styleUrl: './namuna-8-sarkari.component.css'
})
export class Namuna8SarkariComponent {
 receivedData: any;
  namuna_8_sarkar_data: any;

  constructor(private router: Router, private customerService: CustomerService,) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    // console.log('Namuna81Component: Received Data via Router', this.receivedData);
  }

ngOnInit() {
  this.get_namuna_8_Sarkari_data();
}
get_namuna_8_Sarkari_data(){
  this.customerService.getNamuna_8_sarkari_data(this.receivedData.value).subscribe({
    next: (res: any) => {
      this.namuna_8_sarkar_data = res.data;
      console.log('Namuna 8 Sarkari Data:', this.namuna_8_sarkar_data);
    },
    error: (err: Error) => {
      console.error('Error getting for namuna 8 sarkari:', err);
    },
  });
}
   @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault(); // Prevent browser print dialog
        this.downloadAndPreviewPDF();
      }
    }
    
  downloadPDF() {
        const element = document.getElementById('contentToExport');
        if (element) {
          const currentDate = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const fileName = `नमुना_८_${currentDate}.pdf`;

          const options = {
            filename: fileName,
            html2canvas: {},
            jsPDF: { orientation: 'landscape' },
            avoidPageBreak: true
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
      const fileName = `नमुना_८_${currentDate}.pdf`;

      // Generate PDF and open in a new browser tab
      const options = {
        filename: fileName,
        html2canvas: {},
        jsPDF: { orientation: 'landscape' }, // Set orientation to 'landscape'
        avoidPageBreak: true // Avoid page breaks
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
