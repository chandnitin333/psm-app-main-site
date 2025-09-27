import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna81SingleWardComponent } from './namuna81-single-ward.component';

describe('Namuna81SingleWardComponent', () => {
  let component: Namuna81SingleWardComponent;
  let fixture: ComponentFixture<Namuna81SingleWardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna81SingleWardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna81SingleWardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
