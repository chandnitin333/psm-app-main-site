import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class Namuna8Service {
  constructor(private api: ApiService) {}

 

  getAnukramikaData(params: any) {
    return this.api.post(`get-namuna-8-anukramnika`, params);
  }

  getNamuna8WardNew(params: any) {
    return this.api.post(`get-namuna-8-vard-new`, params);
  }

  getNamuna81SingleWardNew(params: any) {
    return this.api.post(`get-namuna-8-1-single-vard`, params);
  }

  getNamuna8Images(params: any) {
    return this.api.post(`get-namuna-8-images`, params);
  }

  getNamuna8ghosvara(params: any) {
    return this.api.post(`get-namuna-8-ghosvara`, params);
  }

  getNamuna8sarkariWard(params: any) {
    return this.api.post(`get-namuna-8-sarkari`, params);
  }


}
