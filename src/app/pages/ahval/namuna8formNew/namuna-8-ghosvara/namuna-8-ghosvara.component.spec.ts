import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna8GhosvaraComponent } from './namuna-8-ghosvara.component';

describe('Namuna8GhosvaraComponent', () => {
  let component: Namuna8GhosvaraComponent;
  let fixture: ComponentFixture<Namuna8GhosvaraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna8GhosvaraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna8GhosvaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
