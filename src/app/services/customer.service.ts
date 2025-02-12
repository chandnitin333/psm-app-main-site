import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private api: ApiService) { }

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








  updatePrakar(params: any) {
    return this.api.put(`update-prakar`, params);
  }
  deletePrakar(id: number) {
    return this.api.delete(`delete-prakar/${id}`);
  }

  getPrakarById(id: number) {
    return this.api.get(`prakar/${id}`);
  }
}
