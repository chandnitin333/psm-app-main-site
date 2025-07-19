import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private dataSource = new BehaviorSubject<any>(1); // Or use specific type
  data$ = this.dataSource.asObservable();

  sendData(data: any) {
    console.log('Sending Data:', data); // Debug log
    this.dataSource.next(data);
  }
}
