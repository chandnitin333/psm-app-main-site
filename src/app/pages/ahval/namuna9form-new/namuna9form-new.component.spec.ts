import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna9formNewComponent } from './namuna9form-new.component';

describe('Namuna9formNewComponent', () => {
  let component: Namuna9formNewComponent;
  let fixture: ComponentFixture<Namuna9formNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna9formNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna9formNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
