import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithPdfComponent } from './table-with-pdf.component';

describe('TableWithPdfComponent', () => {
  let component: TableWithPdfComponent;
  let fixture: ComponentFixture<TableWithPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWithPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableWithPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
