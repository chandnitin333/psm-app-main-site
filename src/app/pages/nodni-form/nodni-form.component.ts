import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { LayoutModule } from '../../components/layout/layout.module';
import { BuildingKarAakaraniComponent } from './building-kar-aakarani/building-kar-aakarani.component';
import { KhulaBhukhandKarAakaraniComponent } from './khula-bhukhand-kar-aakarani/khula-bhukhand-kar-aakarani.component';
import { ManoraKarAakarniComponent } from './manora-kar-aakarni/manora-kar-aakarni.component';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NodaniService } from '../../services/nodani.service';

@Component({
  selector: 'app-nodni-form',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,MatTabGroup],
  templateUrl: './nodni-form.component.html',
  styleUrl: './nodni-form.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodniFormComponent implements AfterViewInit {
toYearSelected: string = '2025';
fromYearSelected: string = '2024';
// @ViewChild('tabGroup') tabGrou!: MatTabGroup;
userDetails: any = [];
otherTaxData:any = [];
otherTaxTableData: any = [];

nodaniForm = new FormGroup({
    annu_kramank: new FormControl(undefined),
    malmatta_kramank: new FormControl(undefined),
    ward_kramank: new FormControl(undefined),
    plot_kramank: new FormControl(undefined),
    khasara_kramank: new FormControl(undefined),
    survey_kramank: new FormControl(undefined),
    voter_card_number: new FormControl(undefined),
    aadhar_card_number: new FormControl(undefined),
    mobile_number: new FormControl(undefined),
    ghar_malkache_nav: new FormControl(undefined),
    patni_mulache_nav: new FormControl(undefined),
    bhogvat_dharkache_nav: new FormControl(undefined),
    patta_nagar_layout: new FormControl(undefined),
    kaymacha_patta: new FormControl(undefined),
    purves: new FormControl(undefined),
    paschimes: new FormControl(undefined),
    uttares: new FormControl(undefined),
    dakshines: new FormControl(undefined),
    pinachya_panichi_vyavstha_radio: new FormControl(undefined),
    ghari_toilet_radio: new FormControl(undefined),
    vanijya_prakar_radio: new FormControl(undefined),
    miltkat_prakar_radio: new FormControl(undefined),
    emarat_mokadi_jaga_radio: new FormControl(undefined),
    emarat_jamin_dharmik_radio: new FormControl(undefined),
    bhogvat_dharak_malak_radio: new FormControl(undefined),
    lambi: new FormControl(undefined),
    rundi: new FormControl(undefined),
    shetrafadh_foot: new FormControl(undefined),
    shetrafadh_meter: new FormControl(undefined),
    viz_divabatti_kar: new FormControl(undefined),
    aaraogya_rakashan_kar: new FormControl(undefined),
    safae_kar: new FormControl(undefined),
    samanya_pani_kar: new FormControl(undefined),
    vishesh_pani_kar: new FormControl(undefined),
    urvarit_khali_jaga_feet: new FormControl(undefined),
    jaminiche_bhandavali_mulya: new FormControl(undefined),
    emaratiche_bhandavali_mulya: new FormControl(undefined),
    ekun_bhandavli_mulya: new FormControl(undefined),
    khula_bhukand_kar_aakarani_txt: new FormControl(undefined),
    emartiche_kar_akarani_txt: new FormControl(undefined),
    gruhkar_bhumikar_from_property_tax: new FormControl(undefined),
    gruhkar_bhumikar_from_tax_payble: new FormControl(undefined),
    chalu_kar: new FormControl(undefined),
    magil_kar: new FormControl(undefined),
    ekun_kar_bharna: new FormControl(undefined),
    magahun_ghat_kiva_badal: new FormControl(undefined),
    
  });

constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private NodaniService: NodaniService
  ) {}
// readonly panelOpenState = signal(false);
ngOnInit(){
  // console.log('NodniFormComponent initialized');
  this.userDetails = this.apiService.getDecodedToken();
  this.getOtherTaxCalculationApi();
  // console.log('User Details:', this.userDetails);
}
 goToNextTab(tabGroup: MatTabGroup) { 
  const nextIndex = (tabGroup.selectedIndex! + 1) % tabGroup._tabs.length; 
  tabGroup.selectedIndex = nextIndex;
 }

 goToPreviousTab(tabGroup: MatTabGroup) { 
    const previousIndex = (tabGroup.selectedIndex! - 1 + tabGroup._tabs.length) % tabGroup._tabs.length; 
    tabGroup.selectedIndex = previousIndex; 
  }
  khula_bhukand_modal(element:any) {
    console.log('Selected Element:', element.target.value);
    this.openKhulaBhukandModal(element);
  }
  building_kar_aakarani(element:any) {
    console.log('Selected Element:', element.target.value);
    this.openBuildingKarModal(element);
  }
  manora_kar_aakarani(element:any) {
    console.log('Selected Element:', element.target.value);
    this.openManoraKarModal(element);
  }
  openKhulaBhukandModal(element:any): void {
    const dialogRef = this.dialog.open(KhulaBhukhandKarAakaraniComponent, {
      width: '1000px', // Adjust size
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Modal Data:', result);
      }
    });
  }
  openBuildingKarModal(element:any): void {
    const dialogRef = this.dialog.open(BuildingKarAakaraniComponent, {
      width: '1000px', // Adjust size
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Modal Data:', result);
      }
    });
  }
  openManoraKarModal(element:any): void {
    const dialogRef = this.dialog.open(ManoraKarAakarniComponent, {
      width: '1000px', // Adjust size
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Modal Data:', result);
      }
    });
  }
  save_nodani_form(){
    if (!this.nodaniForm.invalid) {
      //  txt_number, txt_vard_number, txt_malmatta_number, txt_plot_number,
      //       txt_khasara_number, txt_survey_number, txt_voter_card_number, txt_aadhar_card_number,
      //       txt_mobile_number, txt_home_name, txt_spouse, txt_bhogatwadarache_name, txt_address,
      //       txt_kamayacha_address, txt_bhogatwarache_malak, txt_east, txt_west, txt_north, txt_south,
      //       txt_water, txt_washroom, txt_milkat_prakar, txt_emarat_jamin, txt_emarat_mokdi,
      //       txt_lambi, txt_rundi, txt_shetrafadh_foot, txt_shetrafadh_meter,
      //       user_id, randomNumber, token, rno
      let params = {
        txt_number: this.nodaniForm.value.annu_kramank,
        txt_malmatta_number: this.nodaniForm.value.malmatta_kramank,
        txt_vard_number: this.nodaniForm.value.ward_kramank,
        txt_plot_number: this.nodaniForm.value.plot_kramank,
        txt_khasara_number: this.nodaniForm.value.khasara_kramank,
        txt_survey_number: this.nodaniForm.value.survey_kramank,
        txt_voter_card_number: this.nodaniForm.value.voter_card_number,
        txt_aadhar_card_number: this.nodaniForm.value.aadhar_card_number,
        txt_mobile_number: this.nodaniForm.value.mobile_number,
        txt_home_name: this.nodaniForm.value.ghar_malkache_nav,
        txt_spouse: this.nodaniForm.value.patni_mulache_nav,
        txt_bhogatwadarache_name: this.nodaniForm.value.bhogvat_dharkache_nav,
        txt_address: this.nodaniForm.value.patta_nagar_layout,
        txt_kamayacha_address: this.nodaniForm.value.kaymacha_patta,
        txt_east: this.nodaniForm.value.purves,
        txt_west: this.nodaniForm.value.paschimes,
        txt_north: this.nodaniForm.value.uttares,
        txt_south: this.nodaniForm.value.dakshines,
        txt_water: this.nodaniForm.value.pinachya_panichi_vyavstha_radio,
        txt_washroom: this.nodaniForm.value.ghari_toilet_radio,
        vanijya_prakar_radio: this.nodaniForm.value.vanijya_prakar_radio,
        txt_milkat_prakar: this.nodaniForm.value.miltkat_prakar_radio,
        txt_emarat_mokdi: this.nodaniForm.value.emarat_mokadi_jaga_radio,
        txt_emarat_jamin: this.nodaniForm.value.emarat_jamin_dharmik_radio,
        txt_bhogatwarache_malak: this.nodaniForm.value.bhogvat_dharak_malak_radio,
        txt_lambi: this.nodaniForm.value.lambi,
        txt_rundi: this.nodaniForm.value.rundi,
        txt_shetrafadh_foot: this.nodaniForm.value.shetrafadh_foot,
        txt_shetrafadh_meter: this.nodaniForm.value.shetrafadh_meter,
        viz_divabatti_kar: this.nodaniForm.value.viz_divabatti_kar,
        aaraogya_rakashan_kar: this.nodaniForm.value.aaraogya_rakashan_kar,
        safae_kar: this.nodaniForm.value.safae_kar,
        samanya_pani_kar: this.nodaniForm.value.samanya_pani_kar,
        vishesh_pani_kar: this.nodaniForm.value.vishesh_pani_kar,
        urvarit_khali_jaga_feet: this.nodaniForm.value.urvarit_khali_jaga_feet,
        jaminiche_bhandavali_mulya: this.nodaniForm.value.jaminiche_bhandavali_mulya,
        emaratiche_bhandavali_mulya: this.nodaniForm.value.emaratiche_bhandavali_mulya,
        ekun_bhandavli_mulya: this.nodaniForm.value.ekun_bhandavli_mulya,
        khula_bhukand_kar_aakarani_txt: this.nodaniForm.value.khula_bhukand_kar_aakarani_txt,
        emartiche_kar_akarani_txt: this.nodaniForm.value.emartiche_kar_akarani_txt,
        gruhkar_bhumikar_from_property_tax: this.nodaniForm.value.gruhkar_bhumikar_from_property_tax,
        gruhkar_bhumikar_from_tax_payble: this.nodaniForm.value.gruhkar_bhumikar_from_tax_payble,
        chalu_kar: this.nodaniForm.value.chalu_kar,
        magil_kar: this.nodaniForm.value.magil_kar,
        ekun_kar_bharna: this.nodaniForm.value.ekun_kar_bharna,
        magahun_ghat_kiva_badal: this.nodaniForm.value.magahun_ghat_kiva_badal,
        user_id: this.userDetails.userId,
        randomNumber:"", 
        token:"",
        rno:""
      };
      this.NodaniService.addNodaniForm(params).subscribe({
        next: (res: any) => {
          console.log('res', res);
          if (res.status == 201) {
            console.log('inside', res);
            this.toastr.success(res.message, 'Success');
            // this.loginSuccess = false;
          } else {
            this.toastr.warning(res.message, 'Warning');
          }
          // this.isLoading = false;
        },
        error: (err: Error) => {
          console.error('Error adding nodani form:', err);
          this.toastr.error('There was an error adding the nidani form.', 'Error');
        },
      });
    } else {
      this.toastr.warning('Please fill all required fields.', 'warning');
    }
  }
  
  getOtherTaxCalculationApi() {
    // let params = {      
    //     district_id:this.userDetails.DISTRICT_ID,
    //     taluka_id:this.userDetails.TALUKA_ID,
    //     panchayat_id:this.userDetails.PANCHAYAT_ID  
       
    //   }
    //   console.log('Params for Other Tax Calculation:', params);
    this.NodaniService
      .fetchOtherTaxCalculation({      
        district_id: this.userDetails.DISTRICT_ID,
        taluka_id: this.userDetails.TALUKA_ID,
        panchayat_id: this.userDetails.PANCHAYAT_ID 
      }).subscribe({
        next: (res: any) => {
          // console.log('Response from Other Tax Calculation:', res);
          this.otherTaxData = res?.data[0] ?? [];
          // console.log('Other Tax Data:', this.otherTaxData[0]);
          this.otherTaxTableData = [
            {  karanchi_nav: 'विज /दिवाबत्ती कर', value:this.otherTaxData.TAXRATE1, key:'TAXRATE1'},
            {  karanchi_nav: 'आरोग्य रक्षण कर', value:this.otherTaxData.TAXRATE2, key:'TAXRATE2'},
            {  karanchi_nav: 'सफाई कर', value:this.otherTaxData.TAXRATE3, key:'TAXRATE3'},
            {  karanchi_nav: 'सामान्य पानी क़र', value:this.otherTaxData.TAXRATE4, key:'TAXRATE4'},
            {  karanchi_nav: 'विशेष पाणी कर', value:this.otherTaxData.TAXRATE5, key:'TAXRATE5'},
          ]
          console.log('Other Tax Table Data:', this.otherTaxTableData);
        },
        error: (err: any) => {
          console.error('Error fetch Parkar Data:', err);
        },
      });
  }
  ngAfterViewInit() {
    // this.getOtherTaxCalculationApi();
  }
  
}
