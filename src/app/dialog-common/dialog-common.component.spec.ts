import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCommonComponent } from './dialog-common.component';

describe('DialogCommonComponent', () => {
  let component: DialogCommonComponent;
  let fixture: ComponentFixture<DialogCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCommonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
