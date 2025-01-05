import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidenceCertificateComponent } from './residence-certificate.component';

describe('ResidenceCertificateComponent', () => {
  let component: ResidenceCertificateComponent;
  let fixture: ComponentFixture<ResidenceCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidenceCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidenceCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
