import { ComponentFixture, TestBed } from '@angular/core/testing';

import { manorakComponent } from './manora.component';

describe('manorakComponent', () => {
  let component: manorakComponent;
  let fixture: ComponentFixture<manorakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [manorakComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(manorakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
