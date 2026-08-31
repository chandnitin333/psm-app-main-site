import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Namuna8ImagesComponent } from './namuna-8-images.component';

describe('Namuna8ImagesComponent', () => {
  let component: Namuna8ImagesComponent;
  let fixture: ComponentFixture<Namuna8ImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Namuna8ImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Namuna8ImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
