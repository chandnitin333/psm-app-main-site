import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { MalmattaGrahakYadiService } from '../../../../services/malmatta-grahak-yadi.service';

@Component({
  selector: 'app-malmatta-dharkachi-yadi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './malmatta-dharkachi-yadi.component.html',
  styleUrl: './malmatta-dharkachi-yadi.component.css'
})
export class MalmattaDharkachiYadiComponent {
  receivedData : any;
  malmattaDarkList: any;
  ward_number: any;
  public year: number = 0;
  public end_year: number = 0;
  constructor(private router: Router, private grahakYadiService: MalmattaGrahakYadiService,) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    // this.ward_number = this.receivedData.value;
    console.log('Namuna81Component: Received Data via Router', this.receivedData.value);
  }

   ngOnInit() {
      this.get_adhar_ward_wise_list();
      

  }
  get_adhar_ward_wise_list(){
    const param = {
                "ward": this.receivedData.value.ward_nos,
                "year": this.receivedData.value.year,
                "start": this.receivedData.value.start,
                "end": this.receivedData.value.end
            }
    this.grahakYadiService.malmattaDarkachiYadi(param).subscribe({
      next: (res: any) => {
        this.malmattaDarkList = res.data;
        this.year = this.malmattaDarkList.yearRs10[0].year
        this.end_year = Number(this.year) + 1;
        console.log('Ward Wise Adhar List:', this.malmattaDarkList);
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
          const fileName = `फेरकर_आकारणी_मुल्यांकन_यादी_${currentDate}.pdf`;

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
      const fileName = `फेरकर_आकारणी_मुल्यांकन_यादी_${currentDate}.pdf`;

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
