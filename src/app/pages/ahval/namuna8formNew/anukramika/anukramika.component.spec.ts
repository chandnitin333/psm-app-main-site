import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnukramikaComponent } from './anukramika.component';

describe('AnukramikaComponent', () => {
  let component: AnukramikaComponent;
  let fixture: ComponentFixture<AnukramikaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnukramikaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnukramikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
