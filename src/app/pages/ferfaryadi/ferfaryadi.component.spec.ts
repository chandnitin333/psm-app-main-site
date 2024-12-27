import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FerfaryadiComponent } from './ferfaryadi.component';

describe('FerfaryadiComponent', () => {
  let component: FerfaryadiComponent;
  let fixture: ComponentFixture<FerfaryadiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FerfaryadiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FerfaryadiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
