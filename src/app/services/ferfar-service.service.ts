import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FerfarServiceService {

  constructor(private api: ApiService) { }

  searchFerfarDetails(params:any){
    return this.api.post('search-ferfar-yadi', params);
  }
}
