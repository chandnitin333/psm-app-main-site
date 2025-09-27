import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerImageUploadComponent } from './customer-image-upload.component';

describe('CustomerImageUploadComponent', () => {
  let component: CustomerImageUploadComponent;
  let fixture: ComponentFixture<CustomerImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerImageUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
