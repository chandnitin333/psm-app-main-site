import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiraAwasComponent } from './indira-awas.component';

describe('IndiraAwasComponent', () => {
  let component: IndiraAwasComponent;
  let fixture: ComponentFixture<IndiraAwasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndiraAwasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndiraAwasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
