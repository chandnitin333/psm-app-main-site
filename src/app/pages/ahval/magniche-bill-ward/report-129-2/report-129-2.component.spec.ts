import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Report1292Component } from './report-129-2.component';

describe('Report1292Component', () => {
  let component: Report1292Component;
  let fixture: ComponentFixture<Report1292Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Report1292Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Report1292Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
