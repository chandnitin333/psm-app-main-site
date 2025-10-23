import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class Namuna9Service {
  constructor(private api: ApiService) {}

 

  getAnukramikaData(params: any) {
    return this.api.post(`get-namuna-9-anukramnika`, params);
  }

  getNamuna9WardNew(params: any) {
    return this.api.post(`get-namuna-9-vard-new`, params);
  }

  getNamuna9New(params: any) {
    return this.api.post(`get-namuna-9-new`, params);
  }

 

getNamuna9ghosvara(params: any) {
    return this.api.post(`get-namuna-9-ghosvara-new`, params);
  }


}
