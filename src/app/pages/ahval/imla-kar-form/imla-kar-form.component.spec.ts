import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImlaKarFormComponent } from './imla-kar-form.component';

describe('ImlaKarFormComponent', () => {
  let component: ImlaKarFormComponent;
  let fixture: ComponentFixture<ImlaKarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImlaKarFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImlaKarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
