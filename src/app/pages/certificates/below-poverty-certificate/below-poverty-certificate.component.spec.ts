import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BelowPovertyCertificateComponent } from './below-poverty-certificate.component';

describe('BelowPovertyCertificateComponent', () => {
  let component: BelowPovertyCertificateComponent;
  let fixture: ComponentFixture<BelowPovertyCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BelowPovertyCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BelowPovertyCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
