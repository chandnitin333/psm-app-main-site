import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFerfarComponent } from './customer-ferfar.component';

describe('CustomerFerfarComponent', () => {
  let component: CustomerFerfarComponent;
  let fixture: ComponentFixture<CustomerFerfarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFerfarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFerfarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
