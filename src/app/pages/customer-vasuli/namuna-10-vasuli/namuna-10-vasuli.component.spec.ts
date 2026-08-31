import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna10VasuliComponent } from './namuna-10-vasuli.component';

describe('Namuna10VasuliComponent', () => {
  let component: Namuna10VasuliComponent;
  let fixture: ComponentFixture<Namuna10VasuliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna10VasuliComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna10VasuliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
