import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ImlakarService {
  constructor(private api: ApiService) {}

 

  getImlakarData(params: any) {
    return this.api.post(`get-imlakar-new`, params);
  }

  imlakarAnukranika(params: any) {
    return this.api.post(`get-imlakar-anukramnika`, params);
  }




}
