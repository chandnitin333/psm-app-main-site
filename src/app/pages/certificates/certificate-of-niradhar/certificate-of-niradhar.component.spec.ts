import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateOfNiradharComponent } from './certificate-of-niradhar.component';

describe('CertificateOfNiradharComponent', () => {
  let component: CertificateOfNiradharComponent;
  let fixture: ComponentFixture<CertificateOfNiradharComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateOfNiradharComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateOfNiradharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
