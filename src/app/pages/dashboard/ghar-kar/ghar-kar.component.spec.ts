import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GharKarComponent } from './ghar-kar.component';

describe('GharKarComponent', () => {
  let component: GharKarComponent;
  let fixture: ComponentFixture<GharKarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GharKarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GharKarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
