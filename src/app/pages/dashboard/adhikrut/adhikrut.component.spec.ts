import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhikrutComponent } from './adhikrut.component';

describe('AdhikrutComponent', () => {
  let component: AdhikrutComponent;
  let fixture: ComponentFixture<AdhikrutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdhikrutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdhikrutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
