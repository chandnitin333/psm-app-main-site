import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna8wardNewComponent } from './namuna8ward-new.component';

describe('Namuna8wardNewComponent', () => {
  let component: Namuna8wardNewComponent;
  let fixture: ComponentFixture<Namuna8wardNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna8wardNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna8wardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
