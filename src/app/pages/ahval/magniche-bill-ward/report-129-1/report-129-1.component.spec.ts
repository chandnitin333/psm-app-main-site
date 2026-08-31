import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Report1291Component } from './report-129-1.component';

describe('Report1291Component', () => {
  let component: Report1291Component;
  let fixture: ComponentFixture<Report1291Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Report1291Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Report1291Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
