import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardWisePinyachePaniListComponent } from './ward-wise-pinyache-pani-list.component';

describe('WardWisePinyachePaniListComponent', () => {
  let component: WardWisePinyachePaniListComponent;
  let fixture: ComponentFixture<WardWisePinyachePaniListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardWisePinyachePaniListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardWisePinyachePaniListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
