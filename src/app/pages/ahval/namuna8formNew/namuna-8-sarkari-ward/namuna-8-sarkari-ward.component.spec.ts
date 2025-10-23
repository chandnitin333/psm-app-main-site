import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna8SarkariWardComponent } from './namuna-8-sarkari-ward.component';

describe('Namuna8SarkariWardComponent', () => {
  let component: Namuna8SarkariWardComponent;
  let fixture: ComponentFixture<Namuna8SarkariWardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna8SarkariWardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna8SarkariWardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
