import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MagnicheBillService {
  constructor(private api: ApiService) {}

 

  getMagnicheBillReport129_1(params: any) {
    return this.api.post(`magniche-bill-129-1`, params);
  }

  getMagnicheBillReport129_2(params: any) {
    return this.api.post(`magniche-bill-129-2`, params);
  }

  searchmagnicheUser(params: any) {
    return this.api.post(`search-magniche-bill`, params);
  }


}
