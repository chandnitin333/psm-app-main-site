import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaniVyavastaYadiComponent } from './pani-vyavasta-yadi.component';

describe('PaniVyavastaYadiComponent', () => {
  let component: PaniVyavastaYadiComponent;
  let fixture: ComponentFixture<PaniVyavastaYadiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaniVyavastaYadiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaniVyavastaYadiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
