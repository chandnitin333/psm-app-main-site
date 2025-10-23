import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna9GhosvaraComponent } from './namuna9-ghosvara.component';

describe('Namuna9GhosvaraComponent', () => {
  let component: Namuna9GhosvaraComponent;
  let fixture: ComponentFixture<Namuna9GhosvaraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna9GhosvaraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna9GhosvaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
