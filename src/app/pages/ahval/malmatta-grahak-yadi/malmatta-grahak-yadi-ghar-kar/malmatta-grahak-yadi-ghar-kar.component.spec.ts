import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalmattaGrahakYadiGharKarComponent } from './malmatta-grahak-yadi-ghar-kar.component';

describe('MalmattaGrahakYadiGharKarComponent', () => {
  let component: MalmattaGrahakYadiGharKarComponent;
  let fixture: ComponentFixture<MalmattaGrahakYadiGharKarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MalmattaGrahakYadiGharKarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MalmattaGrahakYadiGharKarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
