import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna81Component } from './namuna-8-1.component';

describe('Namuna81Component', () => {
  let component: Namuna81Component;
  let fixture: ComponentFixture<Namuna81Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna81Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna81Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
