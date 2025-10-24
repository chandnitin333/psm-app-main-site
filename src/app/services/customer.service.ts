import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private api: ApiService) {}
  

  fetchCustomersList(params: any) {
    return this.api.post('search-customer-in-malmatta-nodni', params);
  }

  addCustomer(params: any) {
    return this.api.post(`add-new-customer-in-malmatta-nodni`, params);
  }

  getAnukramankBywardNo(params: any) {
    return this.api.post(`get-annu-kramank-in-malmatta-nodni`, params);
  }

  verifyUserLogin(params: any) {
    return this.api.post(`verify-user-for-permission`, params);
  }

  getMalmattaNodniById(id: number) {
    return this.api.get(`get-malmatta-nodni-user-by-id/${id}`);
  }

  updateCustomerList(params: any) {
    return this.api.put(`update-malmatta-nodni`, params);
  }
  getDropdownYearsList() {
    return this.api.get(`get-all-year-list`);
  }

  addSillakJoda(params: any) {
    return this.api.post(`insert-update-sillak-joda`, params);
  }
  deleteCustomerFromNodani(id: number) {
    return this.api.delete(`delete-malmatta-nodni-info/${id}`);
  }
  getNamuna_8_1_data(new_user_id: number) {
    return this.api.get(`get-namuna-8-1/${new_user_id}`);
  }
  getNamuna_9_1_data(new_user_id: number, vard_numbers: number) {
    return this.api.get(`get-namuna-9-1/${new_user_id}/${vard_numbers}`); // Corrected URL
  }
   getNamuna_8_sarkari_data(new_user_id: number) {
    return this.api.get(`get-namuna-8-sarkari/${new_user_id}`);
  }

  getNamuna_8_new_version_data(params: any) {
    // return this.api.get(` get-namuna-8-1-single-vard/${new_user_id}`);
    return this.api.post(`get-namuna-8-1-single-vard`, params);
  }

 


  // ---------------------------------- tax generation apis----------------------------
  getTaxGenerationRecords(params: any) {
    return this.api.post(`get-tax-generation`, params);
  }

  // ------------------customer Vasuli -------------------
  fetchCustomersVasuliList(params: any) {
    return this.api.post('search-customer-vasuli', params);
  }
  addCustomerVasuli(params: any) {
    return this.api.post(`save-customer-vasuli`, params);
  }
  getVasuliByid(id: number) {
    return this.api.get(`get-customer-vasuli-by-id/${id}`);
  }

  updateCustomerVasuli(params: any, id:any) {
    return this.api.put(`update-customer-vasuli-by-id/${id}`, params);
  }

  deleteCustomerVasuli(id: number) {
    return this.api.delete(`delete-customer-vasuli-by-id/${id}`);
  }

  // ------------------ फेरफार यादी (Ferfar Yadi) ------------------
  fetchFerfarYadiList(params: any) {
    return this.api.post('search-ferfar-yadi', params);
  }
  getFerfarNamunaYadiDDL() {
    return this.api.get('ferfar-namuna-yadi-ddl');
  }
  getGrampanchaytDDL() {
    return this.api.get('ferfar-panchayat-list-ddl');
  }
   addFerfarYadi(params: any) {
    return this.api.post(`add-new-ferfar-yadi`, params);
  }
   getFerfarByid(id: number) {
    return this.api.get(`get-ferfar-yadi-by-id/${id}`);
  }
  updateFerfar(params: any, id:any) {
    return this.api.put(`update-ferfar-yadi-by-id/${id}`, params);
  }
  deleteCustomerFerfar(param: any, id: number) {
    return this.api.put(`delete-ferfar-yadi-by-id/${id}`, param);
  }
  fetchDataAnuNo_wardNo(params: any) {
    return this.api.post(`get-customer-by-annu-id-ward-no`, params);
  }
  fetchMagilKarData(params: any) {
    return this.api.post(`get-magil-kar-data`, params);
  }
  fetchChaluKarData(params: any) {
    return this.api.post(`get-chalu-kar-data`, params);
  }
  uploadPdf(params: FormData) {
    return from(this.api.postFormData(`add-ferfar-yadi-pdf`, params));
  }
  pefFerfarList(params: any) {
    return this.api.post('pdf-ferfar-yadi', params);
  }

  customerUpdate(params: FormData) {
    return from(this.api.postFormData(`update-customer-image`, params));
  }
  
  // ---------------------------------- Dashboard APIS ------------------------------//

  fetchChaluKhatedar(params: any) {
    return this.api.post(`get-chalu-khatedar-list`, params);
  }
  fetchAdhikrut(params: any) {
    return this.api.post(`get-adhikrut-list`, params);
  }
  fetchGharKar(params: any) {
    return this.api.post(`get-ghar-kar-list`, params);
  }
  fetchImlakar(params: any) {
    return this.api.post(`/get-imlakar-list`, params);
  }
  fetchIndiraAwas(params: any) {
    return this.api.post(`/get-indira-awas-list`, params);
  }
  
}
