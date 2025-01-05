import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LayoutModule } from '../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import html2pdf from 'html2pdf.js';


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
      if (element) {
        // Get the current date and time in a format you prefer
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-'); // Format as 'dd-mm-yyyy'
        const formattedTime = currentDate.toLocaleTimeString('en-GB').replace(/:/g, '-'); // Format time as 'hh-mm-ss'
        
        // Combine the formatted date and time to create a unique filename
        const fileName = `adhar_show_${formattedDate}_${formattedTime}.pdf`;

        // Use the dynamically created file name in html2pdf
        html2pdf()
          .from(element)
          .save(fileName);  // Use the dynamically generated filename with date and time
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
      jsPDF: { orientation: 'portrait' }
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
