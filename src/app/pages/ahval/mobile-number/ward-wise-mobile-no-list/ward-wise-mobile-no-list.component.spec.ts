import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardWiseMobileNoListComponent } from './ward-wise-mobile-no-list.component';

describe('WardWiseMobileNoListComponent', () => {
  let component: WardWiseMobileNoListComponent;
  let fixture: ComponentFixture<WardWiseMobileNoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardWiseMobileNoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardWiseMobileNoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
