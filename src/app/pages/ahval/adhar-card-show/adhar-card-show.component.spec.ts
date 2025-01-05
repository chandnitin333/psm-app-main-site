import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdharCardShowComponent } from './adhar-card-show.component';

describe('AdharCardShowComponent', () => {
  let component: AdharCardShowComponent;
  let fixture: ComponentFixture<AdharCardShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdharCardShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdharCardShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
