import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardWiseToiletListComponent } from './ward-wise-toilet-list.component';

describe('WardWiseToiletListComponent', () => {
  let component: WardWiseToiletListComponent;
  let fixture: ComponentFixture<WardWiseToiletListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardWiseToiletListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardWiseToiletListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
