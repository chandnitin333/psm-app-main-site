import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna8NewVersionCustomerPageComponent } from './namuna-8-new-version-customer-page.component';

describe('Namuna8NewVersionCustomerPageComponent', () => {
  let component: Namuna8NewVersionCustomerPageComponent;
  let fixture: ComponentFixture<Namuna8NewVersionCustomerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna8NewVersionCustomerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna8NewVersionCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
