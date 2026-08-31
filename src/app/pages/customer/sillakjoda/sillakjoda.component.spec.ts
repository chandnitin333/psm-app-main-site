import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SillakjodaComponent } from './sillakjoda.component';

describe('SillakjodaComponent', () => {
  let component: SillakjodaComponent;
  let fixture: ComponentFixture<SillakjodaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SillakjodaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SillakjodaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
