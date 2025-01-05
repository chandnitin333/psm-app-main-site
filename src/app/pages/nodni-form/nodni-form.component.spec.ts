import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodniFormComponent } from './nodni-form.component';

describe('NodniFormComponent', () => {
  let component: NodniFormComponent;
  let fixture: ComponentFixture<NodniFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodniFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodniFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
