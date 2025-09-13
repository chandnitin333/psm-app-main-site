import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MalmattaGrahakYadiService } from '../../../../services/malmatta-grahak-yadi.service';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-malmatta-grahak-yadi-ghar-kar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './malmatta-grahak-yadi-ghar-kar.component.html',
  styleUrl: './malmatta-grahak-yadi-ghar-kar.component.css'
})
export class MalmattaGrahakYadiGharKarComponent {
  receivedData : any;
  bindingDataList: any;
  ward_number: any;
  public year: number = 0;
  public end_year: number = 0;
  constructor(private router: Router, private grahakYadiService: MalmattaGrahakYadiService, private route: ActivatedRoute) {
    const encoded = sessionStorage.getItem('GharKarLavaychAheForm');
      if (encoded) {
        this.receivedData = JSON.parse(atob(encoded));
      }else{
        this.router.navigate(['/malmatta-grahak-yadi']);
      }
      console.log('Received Data via Router---->', this.receivedData);
    }
  
  ngOnInit() {
      this.get_ghar_kar_lavaychi_ahe_yadi_list();
      

  }
  get_ghar_kar_lavaychi_ahe_yadi_list(){
    const param = {
                "ward": this.receivedData.ward_nos,
                "year": this.receivedData.year,
                "start": this.receivedData.start,
                "end": this.receivedData.end
            }
    this.grahakYadiService.malmatta_grahak_yadi_ghar_karni(param).subscribe({
      next: (res: any) => {
        this.bindingDataList = res.data;
        this.year = this.bindingDataList.yearRs10[0].year
        this.end_year = Number(this.year) + 1;
        console.log('Ghar kar lavaychi ahe List:', this.bindingDataList);
      },
      error: (err: Error) => {
        console.error('Error getting for Ghar kar lavaychi ahe List :', err);
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
      const fileName = `फेरकर_आकारणी_मुल्यांकन_यादी_घर_कर_लावायचा_आहे_${currentDate}.pdf`;

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
      const fileName = `फेरकर_आकारणी_मुल्यांकन_यादी_घर_कर_लावायचा_आहे_${currentDate}.pdf`;

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
