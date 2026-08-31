import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna8FormNewComponent } from './namuna-8-form-new.component';

describe('Namuna8FormNewComponent', () => {
  let component: Namuna8FormNewComponent;
  let fixture: ComponentFixture<Namuna8FormNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna8FormNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna8FormNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
