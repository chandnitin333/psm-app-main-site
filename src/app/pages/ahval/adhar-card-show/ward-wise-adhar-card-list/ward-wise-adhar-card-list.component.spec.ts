import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardWiseAdharCardListComponent } from './ward-wise-adhar-card-list.component';

describe('WardWiseAdharCardListComponent', () => {
  let component: WardWiseAdharCardListComponent;
  let fixture: ComponentFixture<WardWiseAdharCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardWiseAdharCardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardWiseAdharCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
