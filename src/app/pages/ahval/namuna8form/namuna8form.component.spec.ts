import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna8formComponent } from './namuna8form.component';

describe('Namuna8formComponent', () => {
  let component: Namuna8formComponent;
  let fixture: ComponentFixture<Namuna8formComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna8formComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna8formComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
