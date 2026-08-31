import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalmattaGrahakYadiKhulaBhukhandComponent } from './malmatta-grahak-yadi-khula-bhukhand.component';

describe('MalmattaGrahakYadiKhulaBhukhandComponent', () => {
  let component: MalmattaGrahakYadiKhulaBhukhandComponent;
  let fixture: ComponentFixture<MalmattaGrahakYadiKhulaBhukhandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MalmattaGrahakYadiKhulaBhukhandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MalmattaGrahakYadiKhulaBhukhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
