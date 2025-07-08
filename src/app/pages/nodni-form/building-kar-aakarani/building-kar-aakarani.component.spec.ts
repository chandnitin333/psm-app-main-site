import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingKarAakaraniComponent } from './building-kar-aakarani.component';

describe('BuildingKarAakaraniComponent', () => {
  let component: BuildingKarAakaraniComponent;
  let fixture: ComponentFixture<BuildingKarAakaraniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingKarAakaraniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingKarAakaraniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
