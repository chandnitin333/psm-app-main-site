import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalmattaDharkachiYadiComponent } from './malmatta-dharkachi-yadi.component';

describe('MalmattaDharkachiYadiComponent', () => {
  let component: MalmattaDharkachiYadiComponent;
  let fixture: ComponentFixture<MalmattaDharkachiYadiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MalmattaDharkachiYadiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MalmattaDharkachiYadiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
