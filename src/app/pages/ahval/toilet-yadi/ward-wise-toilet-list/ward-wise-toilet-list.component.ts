import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AdharListService } from '../../../../services/adhar-list.service';
import html2pdf from 'html2pdf.js';

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
  constructor(private router: Router, private adharListService: AdharListService,) {
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
        event.preventDefault(); // Prevent browser print dialog
        this.downloadAndPreviewPDF();
      }
    }

  downloadPDF() {
        const element = document.getElementById('contentToExport');
        if (element) {
          const currentDate = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const fileName = `शौचालय_यादी_${currentDate}.pdf`;

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
      const fileName = `शौचालय_यादी_${currentDate}.pdf`;

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
