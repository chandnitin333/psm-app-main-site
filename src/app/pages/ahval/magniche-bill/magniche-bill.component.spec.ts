import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagnicheBillComponent } from './magniche-bill.component';

describe('MagnicheBillComponent', () => {
  let component: MagnicheBillComponent;
  let fixture: ComponentFixture<MagnicheBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagnicheBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagnicheBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
