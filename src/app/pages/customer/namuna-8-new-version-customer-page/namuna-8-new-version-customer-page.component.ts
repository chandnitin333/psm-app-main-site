import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { CustomerService } from '../../../services/customer.service';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-namuna-8-new-version-customer-page',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
  templateUrl: './namuna-8-new-version-customer-page.component.html',
  styleUrl: './namuna-8-new-version-customer-page.component.css'
})
export class Namuna8NewVersionCustomerPageComponent {
receivedData : any;
  reportData: any;
  ward_number: any;
  public year: number = 0;
  public end_year: number = 0;
  constructor(private router: Router,  private route: ActivatedRoute, private apiService: CustomerService) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
  }

   ngOnInit() {
      this.getReportDataAPI();
      

  }
  
  getReportDataAPI(){
    // this.apiService.getNamuna_8_new_version_data(this.receivedData.value).subscribe({
    // next: (res: any) => {
    //   this.reportData = res.data;
    //   console.log('Reponse Data:', this.reportData);
    // },
    // error: (err: Error) => {
    //   console.error('Error getting for namuna 8 sarkari:', err);
    // },
  // });
  const param = {
                "ward": null,
                "year": null,
                "start": null,
                "end": null,
                "new_user_id": this.receivedData.value
            }
    this.apiService.getNamuna_8_new_version_data(param).subscribe({
      next: (res: any) => {
        this.reportData = res.data;
        this.year = this.reportData.yearRs42[0].year
        this.end_year = Number(this.year) + 1;
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
        this.downloadAndPreviewPDF();
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
      const fileName = `नमुना_८_New_${currentDate}.pdf`;

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
      const fileName = `नमुना_८_New_${currentDate}.pdf`;

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
}
