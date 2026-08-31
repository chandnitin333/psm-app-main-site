import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna9Component } from './namuna9.component';

describe('Namuna9Component', () => {
  let component: Namuna9Component;
  let fixture: ComponentFixture<Namuna9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna9Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
