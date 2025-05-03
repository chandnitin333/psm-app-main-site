import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private api: ApiService) {}

  fetchCustomersList(params: any) {
    return this.api.post('get-malmatta-nodni-list-info', params);
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







  getPrakarById(id: number) {
    return this.api.get(`prakar/${id}`);
  }
}
