import { Component, Inject } from '@angular/core';
import { LayoutModule } from '../../../components/layout/layout.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Util from '../../../utils/utils';
import { ApiService } from '../../../services/api.service';
import { NodaniService } from '../../../services/nodani.service';

@Component({
  selector: 'app-building-kar-aakarani',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './building-kar-aakarani.component.html',
  styleUrl: './building-kar-aakarani.component.css'
})
export class BuildingKarAakaraniComponent {
  building_malmattechePrakar: { MILKAT_VAPAR_ID: number; MILKAT_VAPAR_NAME: String }[] = [];
  building_malmattecheVarnan: { MALMATTA_ID: number; DESCRIPTION_NAME: String }[] = [];
  building_bandkamachaMajla: { FLOOR_ID: number; FLOOR_NAME: String }[] = [];
  userDetails: any = [];

  BuildingkarModal = new FormGroup({
    milkat_vapar_id: new FormControl<number | null>(null),
    malmatta_id: new FormControl<number | null>(null),
    vaparache_prakar: new FormControl<number | null>(null),
    manoramaster_id: new FormControl<number | null>(null),
    areap: new FormControl<number | null>(null),
    areai: new FormControl<number | null>(null),
    totalarea: new FormControl<number | null>(null),
    areap1: new FormControl<number | null>(null),
    areai1: new FormControl<number | null>(null),
    totalarea1: new FormControl<number | null>(null),
    lifespan: new FormControl<number | null>(null),
    constructing: new FormControl<number | null>(null),
    depreciation: new FormControl<number | null>(null),
    weighted: new FormControl<number | null>(null),
    annual_cost: new FormControl<number | null>(null),
    levyrate: new FormControl<number | null>(null),
    one: new FormControl<number | null>(null),
    two: new FormControl<number | null>(null),
  });

   constructor(
    public dialogRef: MatDialogRef<BuildingKarAakaraniComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private NodaniService: NodaniService,
    private util: Util,
    private apiService: ApiService,
  ) {
    console.log('Received data in kundan:', this.data);
  }
  
  ngOnInit(): void {
    this.userDetails = this.apiService.getDecodedToken();
    console.log('userDetails', this.userDetails);
    this.loadMalmattechePrakarDDL();
    this.loadMalmattecheVarnanDDL();
    this.loadBandkamachaMajlaDDL();
  }

  loadMalmattechePrakarDDL(): void {
    this.NodaniService.getMalmattechePrakar_BuildingKarModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.building_malmattechePrakar = res?.data;
      }
    });
  }

  loadMalmattecheVarnanDDL(): void {
    this.NodaniService.getMalmattecheVarnan_BuildingKarModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.building_malmattecheVarnan = res?.data;
      }
    });
  }

  loadBandkamachaMajlaDDL(): void {
    this.NodaniService.getBandkamachaMajla_BuildingKarModal().subscribe({
      next: (res: any) => {
        // console.log('res', res.data);
        this.building_bandkamachaMajla = res?.data;
      }
    });
  }

  getBharankValue(id:any){
    console.log('Selected Milkat Vapar ID:', id);
    this.NodaniService.getgBharankValue_BuildingModal(Number(id)).subscribe({
      next: (res: any) => {
        let bharankValue = res?.data[0].BUILDINGWEIGHTS_NAME;
        console.log('Bharank Value:', bharankValue);
        this.BuildingkarModal.get('weighted')?.setValue(bharankValue || 0);
      }
    });
  }
  getBuildinAndAakaraniDar(malmattaId: any){
    let milkatVaperId = this.BuildingkarModal.value.milkat_vapar_id;
      this.NodaniService.getBuildingValueAndAakaraniDar(Number(malmattaId),Number(milkatVaperId)).subscribe({
        next: (res: any) => {
          let anualCost = res?.data[0].ANNUALPRICE_NAME;
          let levyrate = res?.data[0].LEVYRATE_NAME;
          // console.log('Bharank Value:', bharankValue);
          this.BuildingkarModal.get('annual_cost')?.setValue(anualCost || 0);
          this.BuildingkarModal.get('levyrate')?.setValue(levyrate || 0);
        }
      });
  }
  vayoman(event: any) {
    console.log('Selected Vayoman:', event.target.value);
    let lifespan = Number(event.target.value);
    let currentYear = new Date().getFullYear();
    let constructing = currentYear - lifespan;
    this.BuildingkarModal.get('constructing')?.setValue(Number(constructing) || 0);
  }


  foot_to_meter_conversion()
  {
    let areap = Number(this.BuildingkarModal.value.areap);
    let areai = Number(this.BuildingkarModal.value.areai);
    let totalarea = areap * areai;
    this.BuildingkarModal.get('totalarea')?.setValue(Number(totalarea) || 0);
    let areap1 = parseFloat((areap / 10.764).toFixed(2));
    this.BuildingkarModal.get('areap1')?.setValue(areap1 || 0);
    let areai1 = parseFloat((areai / 10.764).toFixed(2));
    this.BuildingkarModal.get('areai1')?.setValue(areai1 || 0);
    let totalarea1_cal = parseFloat((totalarea / 10.764).toFixed(2));

    this.BuildingkarModal.get('totalarea1')?.setValue(Number(totalarea1_cal) || 0);
    // let capital = parseFloat((Number(this.BuildingkarModal.value.totalarea1) * Number(this.BuildingkarModal.value.annualvalue)).toFixed(2));
    // this.BuildingkarModal.get('capital')?.setValue(Number(capital) || 0);
    // let taxation = Number(capital) * Number(this.BuildingkarModal.value.levyrate) / 1000;
    // console.log('Taxation:', taxation);
    // this.BuildingkarModal.get('taxation')?.setValue(Number(taxation) || 0);
  }

  foot_to_meter_conversion_ekun_foot(){
    // Number(this.khulaBhukhandModal.value.totalarea1)
    let totalarea1_cal = parseFloat((Number(this.BuildingkarModal.value.totalarea) / 10.764).toFixed(2));
    let a1 = parseFloat((Number(this.BuildingkarModal.value.totalarea) / 10.764).toFixed(2));
    this.BuildingkarModal.get('totalarea1')?.setValue(Number(a1) || 0);

    // let capital = parseFloat((Number(this.BuildingkarModal.value.totalarea1) * Number(this.BuildingkarModal.value.annualvalue)).toFixed(2));
    // this.khulaBhukhandModal.get('capital')?.setValue(Number(capital) || 0);
    // let taxation = Number(capital) * Number(this.khulaBhukhandModal.value.levyrate) / 1000;
    // console.log('Taxation:', taxation);
    // this.khulaBhukhandModal.get('taxation')?.setValue(Number(taxation) || 0);
  }

}
