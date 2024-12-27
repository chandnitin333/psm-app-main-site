import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToiletCertificateComponent } from './toilet-certificate.component';

describe('ToiletCertificateComponent', () => {
  let component: ToiletCertificateComponent;
  let fixture: ComponentFixture<ToiletCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToiletCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToiletCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
