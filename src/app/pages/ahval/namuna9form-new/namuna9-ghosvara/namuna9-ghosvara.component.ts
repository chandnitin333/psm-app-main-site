import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Namuna9Service } from '../../../../services/namuna9.service';
import html2pdf from 'html2pdf.js';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-namuna9-ghosvara',
  standalone: true,
  imports: [CommonModule,ToastrModule],
  templateUrl: './namuna9-ghosvara.component.html',
  styleUrl: './namuna9-ghosvara.component.css'
})
export class Namuna9GhosvaraComponent {
receivedData : any;
    reportData: any;
    ward_number: any;
    public year: number = 0;
    public end_year: number = 0;


    bhumikar0=0
    bhumicount0=0
    VIZ0=0
    VIZcount0=0
    aarogya0=0
    aarogyacount0=0
    safai0=0
    safaicount0=0
    pani0=0
    panicount0=0
    vishesh0=0
    visheshcount0=0
    bhumi00=0
    diva00=0
    aarogya00=0
    safai00=0
    samanya00=0
    vishesh00=0
    etar00=0
    notice00=0
    total00=0


    // odyagik
    VIZ_DIVVABATTIKAR1=0
    AAROGYA_RAKSHAN_KAR1=0
    SAFAI_KAR1=0
    SAMANYA_PANI_KAR1=0
    VISHESH_PANI_KAR1=0
    EKUN1=0
    VIZ1=0  
    VIZcount1=0
    aarogya1=0
    aarogyacount1=0
    safai1=0
    safaicount1=0
    pani1=0
    panicount1=0
    vishesh1=0
    visheshcount1=0
    bb1=0
    dd1=0
    aa1=0
    ss1=0
    ssa1=0
    vv1=0
    ee1=0
    nn1=0
    tt1=0
    ws1=0	
    manoradd11=0

    VIZ_DIVVABATTIKAR2=0
    AAROGYA_RAKSHAN_KAR2=0
    SAFAI_KAR2=0
    SAMANYA_PANI_KAR2=0
    VISHESH_PANI_KAR2=0
    EKUN2=0
    VIZ2=0  
    VIZcount2=0
    aarogya2=0
    aarogyacount2=0
    safai2=0
    safaicount2=0
    pani2=0
    panicount2=0
    vishesh2=0
    visheshcount2=0
    bb2=0
    dd2=0
    aa2=0
    ss2=0
    ssa2=0
    vv2=0
    ee2=0
    nn2=0
    tt2=0
    ws2=0	
    manoradd2=0

isMobileDevice: boolean = false;

    constructor(private router: Router, private apiService: Namuna9Service, private route: ActivatedRoute, private toastr: ToastrService, private spinner: LoaderService) {
      const encoded = sessionStorage.getItem('namuna9Ghoswara');
      this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (encoded) {
        this.receivedData = JSON.parse(atob(encoded));
      }else{
        this.router.navigate(['/namuna-9-form-new']);
      }
      console.log('Namuna81Component: Received Data via Router', this.receivedData);
    }

    ngOnInit() {
        this.getReportDataAPI();

    }
    getReportDataAPI(){
      this.spinner.show();
      const param =   
              {
                "ward": this.receivedData.ward_no,
                "year": this.receivedData.year
            }
      this.apiService.getNamuna9ghosvara(param).subscribe({
        next: (res: any) => {
          this.reportData = res.data;
          this.year = this.reportData?.yearRs1[0].year
          this.end_year = Number(this.year) + 1;
          console.log('Reponse Data---:', this.reportData);
          if(this.reportData?.rs3 === undefined || this.reportData?.rs3 === null){
            // alert('No data found for the selected criteria.');
              this.toastr.error('No data found for the selected criteria.', 'Error');
              this.router.navigate(['/namuna-9-form-new']);
          }

          // rs 3 calculation
          if(this.reportData.rs3. length > 0 && this.reportData?.rs3 != null){
            this.vishesh0=this.vishesh0+this.reportData?.rs3?.vishesh
            this.visheshcount0=this.visheshcount0+this.reportData.rs3?.visheshcount
		  		  this.pani0=this.pani0+this.reportData?.rs3?.pani
            this.panicount0=this.panicount0+this.reportData?.rs3?.panicount
				    this.safai0=this.safai0+this.reportData?.rs3?.safai
            this.safaicount0=this.safaicount0+this.reportData?.rs3?.safaicount
			      this.aarogya0=this.aarogya0+this.reportData?.rs3?.aarogya
            this.aarogyacount0=this.aarogyacount0+this.reportData?.rs3?.aarogyacount
				    this.VIZ0=this.VIZ0+this.reportData?.rs3?.VIZ
            this.VIZcount0=this.VIZcount0+this.reportData?.rs3?.VIZcount
			      this.bhumikar0=this.bhumikar0+this.reportData?.rs3?.bhumikar
            this.bhumicount0=this.bhumicount0+this.reportData?.rs3?.bhumicount
          }

          if(this.reportData?.rs4?.length > 0 && this.reportData?.rs4 != null){
            this.bhumi00=this.bhumi00+this.reportData?.rs4?.bhumi
            this.diva00=this.diva00+this.reportData?.rs4?.diva
	   			  this.aarogya00=this.aarogya00+this.reportData?.rs4?.aarogya
            this.safai00=this.safai00+this.reportData?.rs4?.safai
	   			  this.samanya00=this.samanya00+this.reportData?.rs4?.samanya
            this.vishesh00=this.vishesh00+this.reportData?.rs4?.vishesh
	   			  this.etar00=this.etar00+this.reportData?.rs4?.etar
            this.notice00=this.notice00+this.reportData?.rs4?.notice
	   			  this.total00=this.total00+this.reportData?.rs4?.total
          }

          if(this.reportData?.rs5?.length>0 && this.reportData?.rs5 != null){
            this.vishesh1=this.vishesh1+this.reportData?.rs5?.vishesh1;
            this.visheshcount1=this.visheshcount1+this.reportData?.rs5?.visheshcount1;
            this.pani1=this.pani1+this.reportData?.rs5?.pani1;
            this.panicount1=this.panicount1+this.reportData?.rs5?.panicount1;
            this.safai1=this.safai1+this.reportData?.rs5?.safai1;   
            this.safaicount1=this.safaicount1+this.reportData?.rs5?.safaicount1; 
            this.aarogya1=this.aarogya1+this.reportData?.rs5?.aarogya1;   
            this.aarogyacount1=this.aarogyacount1+this.reportData?.rs5?.aarogyacount1; 
            this.VIZ1=this.VIZ1+this.reportData?.rs5?.VIZ1;   
            this.VIZcount1=this.VIZcount1+this.reportData?.rs5?.VIZcount1;            
            this.VIZ_DIVVABATTIKAR1=this.VIZ_DIVVABATTIKAR1+this.reportData?.rs5?.VIZ_DIVVABATTIKAR;   
            this.AAROGYA_RAKSHAN_KAR1=this.AAROGYA_RAKSHAN_KAR1+this.reportData?.rs5?.AAROGYA_RAKSHAN_KAR;
            this.SAFAI_KAR1=this.SAFAI_KAR1+this.reportData?.rs5?.SAFAI_KAR;
            this.SAMANYA_PANI_KAR1=this.SAMANYA_PANI_KAR1+this.reportData?.rs5?.SAMANYA_PANI_KAR;
            this.VISHESH_PANI_KAR1=this.VISHESH_PANI_KAR1+this.reportData?.rs5?.VISHESH_PANI_KAR;
            this.EKUN1=this.EKUN1+this.reportData?.rs5?.EKUN;
            this.ws1=this.ws1+this.reportData?.rs5?.ws;   
            this.manoradd11=this.manoradd11+this.reportData?.rs5?.manoraaddition;
          }
          
          if(this.reportData?.rs8?.length > 0 && this.reportData?.rs8 != null){
            this.bb1=this.bb1+this.reportData?.rs8?.bhumi_kar;   
            this.dd1=this.dd1+this.reportData?.rs8?.diva_batti_kar;
            this.aa1=this.aa1+this.reportData?.rs8?.aarogya_rakshan_kar;
            this.ss1=this.ss1+this.reportData?.rs8?.safai_kar;
            this.ssa1=this.ssa1+this.reportData?.rs8?.samanya_pani_kar;
            this.vv1=this.vv1+this.reportData?.rs8?.vishesh_pani_kar;
            this.ee1=this.ee1+this.reportData?.rs8?.etar_fees;
            this.nn1=this.nn1+this.reportData?.rs8?.notice_fees;
            this.tt1=this.tt1+this.reportData?.rs8?.total;
          }

          if(this.reportData?.rs9?.length > 0 && this.reportData?.rs9 != null){
              this.vishesh2=this.vishesh2+this.reportData?.rs9?.vishesh5   
              this.visheshcount2=this.visheshcount2+this.reportData?.rs9?.visheshcount5
              this.pani2=this.pani2+this.reportData?.rs9?.pani4   
              this.panicount2=this.panicount2+this.reportData?.rs9?.panicount4
              this.safai2=this.safai2+this.reportData?.rs9?.safai3   
              this.safaicount2=this.safaicount2+this.reportData?.rs9?.safaicount3
              this.aarogya2=this.aarogya2+this.reportData?.rs9?.aarogya2   
              this.aarogyacount2=this.aarogyacount2+this.reportData?.rs9?.aarogyacount2
              this.VIZ2=this.VIZ2+this.reportData?.rs9?.VIZ2   
              this.VIZcount2=this.VIZcount2+this.reportData?.rs9?.VIZcount2
              this.VIZ_DIVVABATTIKAR2=this.VIZ_DIVVABATTIKAR2+this.reportData?.rs9?.VIZ_DIVVABATTIKAR   
              this.AAROGYA_RAKSHAN_KAR2=this.AAROGYA_RAKSHAN_KAR2+this.reportData?.rs9?.AAROGYA_RAKSHAN_KAR
              this.SAFAI_KAR2=this.SAFAI_KAR2+this.reportData?.rs9?.SAFAI_KAR
              this.SAMANYA_PANI_KAR2=this.SAMANYA_PANI_KAR2+this.reportData?.rs9?.SAMANYA_PANI_KAR
              this.VISHESH_PANI_KAR2=this.VISHESH_PANI_KAR2+this.reportData?.rs9?.VISHESH_PANI_KAR
              this.EKUN2=this.EKUN2+this.reportData?.rs9?.EKUN  
              this.ws2=this.ws2+this.reportData?.rs9?.ws   
              this.manoradd2=this.manoradd2+this.reportData?.rs9?.manoraaddition
          }
          if(this.reportData?.rs10.length >0  && this.reportData?.rs10 != null){
              this.bb2=this.bb2+this.reportData?.rs10?.bhumi_kar   
              this.dd2=this.dd2+this.reportData?.rs10?.diva_batti_kar
              this.aa2=this.aa2+this.reportData?.rs10?.aarogya_rakshan_kar
              this.ss2=this.ss2+this.reportData?.rs10?.safai_kar
              this.ssa2=this.ssa2+this.reportData?.rs10?.samanya_pani_kar
              this.vv2=this.vv2+this.reportData?.rs10?.vishesh_pani_kar
              this.ee2=this.ee2+this.reportData?.rs10?.etar_fees
              this.nn2=this.nn2+this.reportData?.rs10?.notice_fees
					    this.tt2=this.tt2+this.reportData?.rs10?.total
          }
          
          this.spinner.hide();
        },
        error: (err: Error) => {
          console.error('Error getting for anukramika list :', err);
          this.spinner.hide();
        },
      });
    }
    @HostListener('window:keydown', ['$event'])
      handleKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 'p') {
          event.preventDefault(); // Prevent browser print dialog
          this.printDirect();
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
        const fileName = `नमुना_९_गोषवारा${currentDate}.pdf`;

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
        const fileName = `नमुना_९_गोषवारा${currentDate}.pdf`;

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

    // Direct browser print - uses @media print CSS
    printDirect() {
      const printContent = document.getElementById('contentToExport');
      if (!printContent) return;
      console.log('printContent', printContent);

      // Clone content for a clean print
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      // Copy styles
      const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join('');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      // Write content to print window
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Preview</title>
            <style>
              ${styles}
              @page {
                size: A4 landscape;
                margin: 8mm 10mm 8mm 10mm;
              }
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                padding-top: 3mm !important;
              }
              .heading {
                font-size: 16px !important;
                margin-bottom: 2px !important;
                line-height: 1.2 !important;
                text-align: center !important;
                font-weight: bold !important;
              }
              .san {
                font-size: 12px !important;
                line-height: 1.2 !important;
                text-align: center !important;
                margin-bottom: 2px !important;
              }
              .font15 {
                font-size: 12px !important;
                line-height: 1.2 !important;
                font-weight: bold !important;
                margin-bottom: 3px !important;
              }
              .container-fluid {
                width: 98% !important;
                display: block !important;
                margin: 0 auto !important;
                padding: 0 !important;
              }
              .row {
                margin-bottom: 2px !important;
                display: block !important;
                width: 100% !important;
                clear: both !important;
              }
              .col-md-12 {
                width: 100% !important;
                display: block !important;
                margin-bottom: 2px !important;
              }
              .table-responsive {
                margin-top: 0px !important;
                margin-bottom: 4px !important;
                overflow-x: visible !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 0px !important;
                margin-bottom: 4px !important;
              }
              thead {
                display: table-header-group !important;
              }
              tbody {
                display: table-row-group !important;
              }
              th, td {
                border: 1px solid #000 !important;
                padding: 3px 4px !important;
                word-wrap: break-word;
                font-size: 11px !important;
                text-align: center !important;
                line-height: 1.3 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
                padding: 4px 4px !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid;
              }
              .fontW {
                font-weight: bold !important;
              }
              p {
                font-size: 11px !important;
                line-height: 1.3 !important;
                margin: 2px 0 !important;
                padding: 1px !important;
              }
              div > p:last-child {
                margin-bottom: 4px !important;
              }
            </style>
          </head>
          <body>
            ${printContent.outerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait until content fully loads before printing
      printWindow.onload = () => {
        printWindow.focus();

        // Close window after print dialog is closed (whether printed or canceled)
        printWindow.onafterprint = () => {
          printWindow.close();
        };

        printWindow.print();
      };
    }
     downloadPDFMobile() {
    const printContent = document.getElementById('contentToExport');
    if (!printContent) {
      this.toastr.error('Content not found', 'Error');
      return;
    }

    this.toastr.info('PDF तयार करत आहे...', 'कृपया प्रतीक्षा करा', {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: true
    });

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentDate = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
    const fileName = `namuna9_ghosavara_${currentDate}.pdf`;

    // Copy all styles
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    // Create complete HTML with styles
    const htmlContent = `
      <html>
          <head>
            <title>Print Preview</title>
            <style>
              ${styles}
              @page {
                size: A4 landscape;
                margin: 8mm 10mm 8mm 10mm;
              }
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                padding-top: 3mm !important;
              }
              .heading {
                font-size: 16px !important;
                margin-bottom: 2px !important;
                line-height: 1.2 !important;
                text-align: center !important;
                font-weight: bold !important;
              }
              .san {
                font-size: 12px !important;
                line-height: 1.2 !important;
                text-align: center !important;
                margin-bottom: 2px !important;
              }
              .font15 {
                font-size: 12px !important;
                line-height: 1.2 !important;
                font-weight: bold !important;
                margin-bottom: 3px !important;
              }
              .container-fluid {
                width: 98% !important;
                display: block !important;
                margin: 0 auto !important;
                padding: 0 !important;
              }
              .row {
                margin-bottom: 2px !important;
                display: block !important;
                width: 100% !important;
                clear: both !important;
              }
              .col-md-12 {
                width: 100% !important;
                display: block !important;
                margin-bottom: 2px !important;
              }
              .table-responsive {
                margin-top: 0px !important;
                margin-bottom: 4px !important;
                overflow-x: visible !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 0px !important;
                margin-bottom: 4px !important;
              }
              thead {
                display: table-header-group !important;
              }
              tbody {
                display: table-row-group !important;
              }
              th, td {
                border: 1px solid #000 !important;
                padding: 3px 4px !important;
                word-wrap: break-word;
                font-size: 11px !important;
                text-align: center !important;
                line-height: 1.3 !important;
              }
              th {
                font-weight: bold !important;
                background-color: #f0f0f0 !important;
                padding: 4px 4px !important;
              }
              tr {
                border: 1px solid #000 !important;
                page-break-inside: avoid;
              }
              .fontW {
                font-weight: bold !important;
              }
              p {
                font-size: 11px !important;
                line-height: 1.3 !important;
                margin: 2px 0 !important;
                padding: 1px !important;
              }
              div > p:last-child {
                margin-bottom: 4px !important;
              }
            </style>
          </head>
          <body>
            ${printContent.outerHTML}
          </body>
        </html>
    `;

    // Create a blob from the HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.pdf', '.html'); // Download as HTML first
    link.style.display = 'none';
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.toastr.clear();
    this.toastr.success('फाईल डाउनलोड झाली! ब्राउझरमध्ये उघडून Print > Save as PDF करा', 'यशस्वी', {
      timeOut: 8000,
      closeButton: true
    });
  }
}
