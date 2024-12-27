import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagnicheBillWardComponent } from './magniche-bill-ward.component';

describe('MagnicheBillWardComponent', () => {
  let component: MagnicheBillWardComponent;
  let fixture: ComponentFixture<MagnicheBillWardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagnicheBillWardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagnicheBillWardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
