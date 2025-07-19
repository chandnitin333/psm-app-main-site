import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamunaprintComponent } from './namunaprint.component';

describe('NamunaprintComponent', () => {
  let component: NamunaprintComponent;
  let fixture: ComponentFixture<NamunaprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NamunaprintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NamunaprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
