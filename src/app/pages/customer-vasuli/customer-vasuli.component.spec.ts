import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerVasuliComponent } from './customer-vasuli.component';

describe('CustomerVasuliComponent', () => {
  let component: CustomerVasuliComponent;
  let fixture: ComponentFixture<CustomerVasuliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerVasuliComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerVasuliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
