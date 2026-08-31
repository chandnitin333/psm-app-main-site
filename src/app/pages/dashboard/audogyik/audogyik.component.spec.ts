import { ComponentFixture, TestBed } from '@angular/core/testing';

import { audogyikComponent } from './audogyik.component';

describe('audogyikComponent', () => {
  let component: audogyikComponent;
  let fixture: ComponentFixture<audogyikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [audogyikComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(audogyikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
