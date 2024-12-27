import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptOfCertificateComponent } from './receipt-of-certificate.component';

describe('ReceiptOfCertificateComponent', () => {
  let component: ReceiptOfCertificateComponent;
  let fixture: ComponentFixture<ReceiptOfCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptOfCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptOfCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
