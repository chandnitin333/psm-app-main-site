import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivingCertificateComponent } from './living-certificate.component';

describe('LivingCertificateComponent', () => {
  let component: LivingCertificateComponent;
  let fixture: ComponentFixture<LivingCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivingCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivingCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
