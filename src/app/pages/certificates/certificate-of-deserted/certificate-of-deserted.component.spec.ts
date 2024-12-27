import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateOfDesertedComponent } from './certificate-of-deserted.component';

describe('CertificateOfDesertedComponent', () => {
  let component: CertificateOfDesertedComponent;
  let fixture: ComponentFixture<CertificateOfDesertedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateOfDesertedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateOfDesertedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
