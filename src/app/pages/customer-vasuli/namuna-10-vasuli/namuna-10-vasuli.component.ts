import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { CustomerService } from '../../../services/customer.service';
import { ApiService } from '../../../services/api.service';
import { numberToMarathiWords } from '../../../utils/utils';

@Component({
  selector: 'app-namuna-10-vasuli',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './namuna-10-vasuli.component.html',
  styleUrl: './namuna-10-vasuli.component.css'
})
export class Namuna10VasuliComponent {
receivedData: any;
namuna_10_data: any;
userDetails: any = [];
akshariRs:string = '';
currentYear: number = new Date().getFullYear();
currentDate: Date = new Date();

  constructor(private router: Router, private customerService: CustomerService,private apiService: ApiService,) {
    this.receivedData = this.router.getCurrentNavigation()?.extras.state;
    console.log('Namuna10VasuliComponent: Received Data via Router', this.receivedData);
  }

ngOnInit() {
  this.userDetails = this.apiService.getDecodedToken();
  this.get_namuna_10_vasuli_data();
  console.log('userDetails total', this.namuna_10_data?.EKUN_JAMMA_KELELI_RAKKAM);

  
}
get_namuna_10_vasuli_data(){
  this.customerService.getVasuliByid(this.receivedData.value).subscribe({
    next: (res: any) => {
      this.namuna_10_data = res.data[0];
      console.log('Namuna 10 Data:', this.namuna_10_data);
      this.akshariRs = numberToMarathiWords(Number(this.namuna_10_data?.EKUN_JAMMA_KELELI_RAKKAM))
    },
    error: (err: Error) => {
      console.error('Error getting for namuna 10 Vasuli:', err);
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
    const currentDate = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    const fileName = `नमुना_10_कराबद्दल_पावती_${currentDate}.pdf`;

    const options = {
      filename: fileName,
      margin: [20, 20, 20, 20], // [top, left, bottom, right] in mm
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf()
      .set(options)
      .from(element)
      .save(); // Directly download PDF
  }
}

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
    const fileName = `नमुना_10_कराबद्दल_पावती_${currentDate}.pdf`;

    const options = {
      filename: fileName,
      margin: [20, 20, 20, 20],  // [top, left, bottom, right] margin in mm
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, 
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // prevent table cuts
    };

    html2pdf()
      .set(options)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        const blob = pdf.output('blob'); 
        const blobURL = URL.createObjectURL(blob); 

        // Open in new tab
        const previewWindow = window.open(blobURL, '_blank');

        // Print after load
        setTimeout(() => {
          previewWindow?.print();
        }, 800);
      });
  }
}

}
