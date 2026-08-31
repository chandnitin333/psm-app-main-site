import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaluKhatedarComponent } from './chalu-khatedar.component';

describe('ChaluKhatedarComponent', () => {
  let component: ChaluKhatedarComponent;
  let fixture: ComponentFixture<ChaluKhatedarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChaluKhatedarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChaluKhatedarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
