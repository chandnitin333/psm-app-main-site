import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManoraKarAakarniComponent } from './manora-kar-aakarni.component';

describe('ManoraKarAakarniComponent', () => {
  let component: ManoraKarAakarniComponent;
  let fixture: ComponentFixture<ManoraKarAakarniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManoraKarAakarniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManoraKarAakarniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
