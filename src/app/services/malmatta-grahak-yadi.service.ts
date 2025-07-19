import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MalmattaGrahakYadiService {
  constructor(private api: ApiService) {}

  getWardNumberList() {
    return this.api.get(`get-all-ward-list`);
  }

  getWard_wise_adhar_list(ward_number: number) {
    return this.api.get(`get-ward-wise-adhar-list/${ward_number}`);
  }

  malmattaDarkachiYadi(params: any) {
    return this.api.post(`malmatta-darkachi-yadi-list`, params);
  }

}
