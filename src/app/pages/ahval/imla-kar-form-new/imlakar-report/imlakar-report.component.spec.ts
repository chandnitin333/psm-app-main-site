import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImlakarReportComponent } from './imlakar-report.component';

describe('ImlakarReportComponent', () => {
  let component: ImlakarReportComponent;
  let fixture: ComponentFixture<ImlakarReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImlakarReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImlakarReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
