import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna9formComponent } from './namuna9form.component';

describe('Namuna9formComponent', () => {
  let component: Namuna9formComponent;
  let fixture: ComponentFixture<Namuna9formComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna9formComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna9formComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
