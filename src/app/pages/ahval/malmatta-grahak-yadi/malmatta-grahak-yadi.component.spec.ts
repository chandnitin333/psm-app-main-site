import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalmattaGrahakYadiComponent } from './malmatta-grahak-yadi.component';

describe('MalmattaGrahakYadiComponent', () => {
  let component: MalmattaGrahakYadiComponent;
  let fixture: ComponentFixture<MalmattaGrahakYadiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MalmattaGrahakYadiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MalmattaGrahakYadiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
