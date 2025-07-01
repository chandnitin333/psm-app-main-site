import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhulaBhukhandKarAakaraniComponent } from './khula-bhukhand-kar-aakarani.component';

describe('KhulaBhukhandKarAakaraniComponent', () => {
  let component: KhulaBhukhandKarAakaraniComponent;
  let fixture: ComponentFixture<KhulaBhukhandKarAakaraniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhulaBhukhandKarAakaraniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhulaBhukhandKarAakaraniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
