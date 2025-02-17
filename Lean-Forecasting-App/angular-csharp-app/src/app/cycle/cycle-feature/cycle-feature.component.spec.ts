import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleFeatureComponent } from './cycle-feature.component';

describe('CycleFeatureComponent', () => {
  let component: CycleFeatureComponent;
  let fixture: ComponentFixture<CycleFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CycleFeatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
