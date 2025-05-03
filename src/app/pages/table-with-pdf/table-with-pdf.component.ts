import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import html2pdf from 'html2pdf.js';
import { LayoutModule } from '../../components/layout/layout.module';


@Component({
  selector: 'app-table-with-pdf',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule],
  templateUrl: './table-with-pdf.component.html',
  styleUrl: './table-with-pdf.component.css'
})
export class TableWithPdfComponent {
  downloadPDF() {
      const element = document.getElementById('contentToExport');
      // console.log(element);
      if (element) {
        // Get the current date and time in a format you prefer
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-'); // Format as 'dd-mm-yyyy'
        const formattedTime = currentDate.toLocaleTimeString('en-GB').replace(/:/g, '-'); // Format time as 'hh-mm-ss'

        // Combine the formatted date and time to create a unique filename
        const fileName = `adhar_show_${formattedDate}_${formattedTime}.pdf`;

        // Generate PDF and open in a new browser tab
        const options = {
          filename: fileName,
          html2canvas: {
            removeContainer: true, // Remove additional border
            scale: 2, // Increase scale to improve quality
            useCORS: true // Enable cross-origin resource sharing
          },
          jsPDF: { orientation: 'landscape' }, // Set orientation to 'landscape'
          avoidPageBreak: true, // Avoid page breaks
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
          });
      }
  }
 
  downloadAndPreviewPDF() {
    const element = document.getElementById('contentToExport');
    if (element) {
      const currentDate = new Date().toLocaleDateString(); // Example of dynamic filename content
      const fileName = `export_${currentDate}.pdf`;

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
