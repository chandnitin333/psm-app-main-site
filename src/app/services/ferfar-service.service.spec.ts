import { TestBed } from '@angular/core/testing';

import { FerfarServiceService } from './ferfar-service.service';

describe('FerfarServiceService', () => {
  let service: FerfarServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FerfarServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
