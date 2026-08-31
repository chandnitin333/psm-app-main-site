import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImlakarAnukramanikaComponent } from './imlakar-anukramanika.component';

describe('ImlakarAnukramanikaComponent', () => {
  let component: ImlakarAnukramanikaComponent;
  let fixture: ComponentFixture<ImlakarAnukramanikaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImlakarAnukramanikaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImlakarAnukramanikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
