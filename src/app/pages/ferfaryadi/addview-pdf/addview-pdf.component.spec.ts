import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddviewPdfComponent } from './addview-pdf.component';

describe('AddviewPdfComponent', () => {
  let component: AddviewPdfComponent;
  let fixture: ComponentFixture<AddviewPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddviewPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddviewPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
