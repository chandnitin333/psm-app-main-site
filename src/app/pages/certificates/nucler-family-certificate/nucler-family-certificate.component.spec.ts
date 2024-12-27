import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuclerFamilyCertificateComponent } from './nucler-family-certificate.component';

describe('NuclerFamilyCertificateComponent', () => {
  let component: NuclerFamilyCertificateComponent;
  let fixture: ComponentFixture<NuclerFamilyCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuclerFamilyCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuclerFamilyCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
