import { ComponentFixture, TestBed } from '@angular/core/testing';

import { forecastReleaseComponent } from './montecarlo-release.component';

describe('forecastReleaseComponent', () => {
  let component: forecastReleaseComponent;
  let fixture: ComponentFixture<forecastReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [forecastReleaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(forecastReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
