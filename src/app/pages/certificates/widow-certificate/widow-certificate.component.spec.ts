import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidowCertificateComponent } from './widow-certificate.component';

describe('WidowCertificateComponent', () => {
  let component: WidowCertificateComponent;
  let fixture: ComponentFixture<WidowCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidowCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidowCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
