import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToiletYadiComponent } from './toilet-yadi.component';

describe('ToiletYadiComponent', () => {
  let component: ToiletYadiComponent;
  let fixture: ComponentFixture<ToiletYadiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToiletYadiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToiletYadiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
