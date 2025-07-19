import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna8SarkariComponent } from './namuna-8-sarkari.component';

describe('Namuna8SarkariComponent', () => {
  let component: Namuna8SarkariComponent;
  let fixture: ComponentFixture<Namuna8SarkariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna8SarkariComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna8SarkariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
