import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { Namuna8Service } from '../../../../services/namuna8.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-namuna-8-ghosvara',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './namuna-8-ghosvara.component.html',
  styleUrl: './namuna-8-ghosvara.component.css'
})
export class Namuna8GhosvaraComponent {
    receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;
    constructor(private router: Router, private apiService: Namuna8Service, private route: ActivatedRoute, private toastr: ToastrService) {
      const encoded = sessionStorage.getItem('namuna8ghosvara');
      if (encoded) {
        this.receivedData = JSON.parse(atob(encoded));
      }else{
        this.router.navigate(['/namuna-8-form-new']);
      }
      console.log('Namuna81Component: Received Data via Router', this.receivedData);
    }

    ngOnInit() {
        this.getReportDataAPI();

    }
    getReportDataAPI(){
      const param =   
              {
                "ward": this.receivedData.ward_no,
                "year":this.receivedData.year,
                "start": this.receivedData.start,
                "end":this.receivedData.end,
                "new_user_id":null,
                "from_year":this.receivedData.year1,
                "to_year":this.receivedData.toYear1,
            }
      this.apiService.getNamuna8ghosvara(param).subscribe({
        next: (res: any) => {
          this.reportData = res.data;
          // this.year = this.reportData.yearRs42[0].year
          // this.end_year = Number(this.year) + 1;
          if(this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
            // alert('No data found for the selected criteria.');
              this.toastr.error('No data found for the selected criteria.', 'Error');
              this.router.navigate(['/imla-kar-form-new']);
          }
          console.log('Reponse Data---:', this.reportData);
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
        const fileName = `नमुना_८_गोषवारा_${currentDate}.pdf`;

        const options = {
          filename: fileName,
          margin: [15, 15, 15, 15],
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
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
        const fileName = `नमुना_८_गोषवारा_${currentDate}.pdf`;

        const options = {
          filename: fileName,
          margin: [15, 15, 15, 15],
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
