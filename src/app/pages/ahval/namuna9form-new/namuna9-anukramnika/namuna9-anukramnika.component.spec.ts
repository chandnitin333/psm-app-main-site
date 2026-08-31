import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna9AnukramnikaComponent } from './namuna9-anukramnika.component';

describe('Namuna9AnukramnikaComponent', () => {
  let component: Namuna9AnukramnikaComponent;
  let fixture: ComponentFixture<Namuna9AnukramnikaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna9AnukramnikaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna9AnukramnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
