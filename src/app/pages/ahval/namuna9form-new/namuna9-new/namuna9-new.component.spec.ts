import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna9NewComponent } from './namuna9-new.component';

describe('Namuna9NewComponent', () => {
  let component: Namuna9NewComponent;
  let fixture: ComponentFixture<Namuna9NewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna9NewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna9NewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
