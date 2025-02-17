import { ComponentFixture, TestBed } from '@angular/core/testing';

import { forecastStoriesComponent } from './montecarlo-sprint.component';

describe('forecastStoriesComponent', () => {
  let component: forecastStoriesComponent;
  let fixture: ComponentFixture<forecastStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [forecastStoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(forecastStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
