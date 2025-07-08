import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna91Component } from './namuna-9-1.component';

describe('Namuna91Component', () => {
  let component: Namuna91Component;
  let fixture: ComponentFixture<Namuna91Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna91Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna91Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
