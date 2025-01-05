import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDuesCertificateComponent } from './no-dues-certificate.component';

describe('NoDuesCertificateComponent', () => {
  let component: NoDuesCertificateComponent;
  let fixture: ComponentFixture<NoDuesCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoDuesCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoDuesCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
