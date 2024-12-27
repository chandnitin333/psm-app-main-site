import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxGenerrationComponent } from './tax-generration.component';

describe('TaxGenerrationComponent', () => {
  let component: TaxGenerrationComponent;
  let fixture: ComponentFixture<TaxGenerrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxGenerrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxGenerrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
