import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImlaKarFormNewComponent } from './imla-kar-form-new.component';

describe('ImlaKarFormNewComponent', () => {
  let component: ImlaKarFormNewComponent;
  let fixture: ComponentFixture<ImlaKarFormNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImlaKarFormNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImlaKarFormNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
