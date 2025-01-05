import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasuliComponent } from './vasuli.component';

describe('VasuliComponent', () => {
  let component: VasuliComponent;
  let fixture: ComponentFixture<VasuliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VasuliComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VasuliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
