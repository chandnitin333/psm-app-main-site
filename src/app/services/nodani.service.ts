import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class NodaniService {
  constructor(private api: ApiService) {}

  
  addNodaniForm(params: any) {
    return this.api.post(`save-nodni-from`, params);
  }
  
  fetchOtherTaxCalculation(params: any) {
    return this.api.post('get-other-tax-calculation', params);
  }
  getMalmattechePrakar_KhulaBhukandModal() {
    return this.api.get(`get-khula-bhukhand-kar-malmatteche-prakar-ddl`);
  }
  getgavthanBaherche_KhulaBhukandModal(id: number) {
    return this.api.get(`get-khula-bhukhand-kar-gavthan-ddl/${id}`);
  }
  getlandAnnualAndAakaraniRateValues_KhulaBhukandModal(id: number) {
    return this.api.get(`get-jamin-anual-rate-akarani-dar/${id}`);
  }
  getyearIdName_KhulaBhukandModal() {
    return this.api.get(`get-year-id-year-name`);
  }

  addKhulaBhukhandForm(params: any) {
    return this.api.post(`save-khali-bhukhand`, params);
  }
  updateKhulaBhukhandForm(params: any, id:any) {
    return this.api.put(`update-khula-bhukhand-modal/${id}`, params);
  }
  deleteKhulaBhukhand(id: number) {
    return this.api.delete(`delete-khula-bhukhand-record/${id}`);
  }
  getKhulabhukhandSavedRecords(params: any){
    return this.api.post("get-open-construction-tax-assessment",  params)
  }
  editKhulabhukhandModal(id: number) {
    return this.api.get(`edit-khula-bhukhand-modal-by-id/${id}`);
  }
 

  getMalmattechePrakar_BuildingKarModal() {
    return this.api.get(`get-building-kar-malmatteche-prakar-ddl`);
  }
  getMalmattecheVarnan_BuildingKarModal() {
    return this.api.get(`get-building-kar-malmatteche-varnan-ddl`);
  }
  getBandkamachaMajla_BuildingKarModal() {
    return this.api.get(`get-building-kar-bandkamacha-majla-ddl`);
  }
  getgBharankValue_BuildingModal(id: number) {
    return this.api.get(`get-bharank-from-malmatteche-prakar-select/${id}`);
  }
  getBuildingValueAndAakaraniDar(malmattaId: number,milkatVaperId: number) {
    return this.api.get(`get-anual-building-value-aakarani-dar-building-modal/${malmattaId}/${milkatVaperId}`);
  }
  getgGhasaraDar_BuildingModal(malmattaId: number,vayoman: number) {
    return this.api.get(`get-new-ghasara-dar-building-modal/${malmattaId}/${vayoman}`);
  }

  addBuildingkarForm(params: any) {
    return this.api.post(`save-bandh-kam`, params);
  }
   getbankamachiKarAakarniSavedRecords(params: any){
    return this.api.post("get-tax-assessment-construction",  params)
  }
  editbandkamKarAakaraniModal(id: number) {
    return this.api.get(`edit-bandkam-kar-aakarni-modal-data/${id}`);
  }
  updateBandkamKarModal(params: any, id:any) {
    return this.api.put(`update-bandkam-kar-aakarani-modal/${id}`, params);
  }
  deletebandkamKarAkarniRecords(id: number) {
    return this.api.delete(`delete-bandkam-kar-aakarni-record/${id}`);
  }
 


  getMalmattechePrakar_ManoraModal() {
    return this.api.get(`get-monora-kar-malmatteche-prakar-ddl`);
  }
  getMalmattecheVarnan_ManoraModal() {
    return this.api.get(`get-monora-kar-malmatteche-varnan-ddl`);
  }
  getBandkamachaMajla_ManoraModal() {
    return this.api.get(`get-monora-kar-manorache-bhag-ddl`);
  }

  addManoraForm(params: any) {
    return this.api.post(`save-tax-payer`, params);
  }
   getmanoraKarAakarniSavedRecords(params: any){
    return this.api.post("get-tax-assessment-towers",  params)
  }
  editmanoraKarAakaraniModal(id: number) {
    return this.api.get(`edit-manora-kar-aakarni-modal-data/${id}`);
  }
  updateManoraKarModal(params: any, id:any) {
    return this.api.put(`update-manora-kar-aakarani-modal/${id}`, params);
  }
  deleteManoraAkarniRecords(id: number) {
    return this.api.delete(`delete-manora-kar-aakarni-record/${id}`);
  }
  resetTableApis(api_url:string, params: any){
    return this.api.post(api_url,  params)
  }
  
  // verifyUserLogin(params: any) {
  //   return this.api.post(`verify-user-for-permission`, params);
  // }

  // getMalmattaNodniById(id: number) {
  //   return this.api.get(`get-malmatta-nodni-user-by-id/${id}`);
  // }

  // updateCustomerList(params: any) {
  //   return this.api.put(`update-malmatta-nodni`, params);
  // }
  // getDropdownYearsList() {
  //   return this.api.get(`get-all-year-list`);
  // }

  // addSillakJoda(params: any) {
  //   return this.api.post(`insert-update-sillak-joda`, params);
  // }
  // deleteCustomerFromNodani(id: number) {
  //   return this.api.delete(`delete-malmatta-nodni-info/${id}`);
  // }
  // getNamuna_8_1_data(new_user_id: number) {
  //   return this.api.get(`get-namuna-8-1/${new_user_id}`);
  // }
  // getNamuna_9_1_data(new_user_id: number, vard_numbers: number) {
  //   return this.api.get(`get-namuna-9-1/${new_user_id}/${vard_numbers}`); // Corrected URL
  // }
  //  getNamuna_8_sarkari_data(new_user_id: number) {
  //   return this.api.get(`get-namuna-8-sarkari/${new_user_id}`);
  // }

}
