import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImlaKarComponent } from './imla-kar.component';

describe('ImlaKarComponent', () => {
  let component: ImlaKarComponent;
  let fixture: ComponentFixture<ImlaKarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImlaKarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImlaKarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
