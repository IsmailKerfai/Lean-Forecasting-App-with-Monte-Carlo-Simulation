import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontecarloComponent } from './montecarlo.component';

describe('MontecarloComponent', () => {
  let component: MontecarloComponent;
  let fixture: ComponentFixture<MontecarloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontecarloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MontecarloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
