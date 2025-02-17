import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleComponent } from './cycle.component';

describe('CycleComponent', () => {
  let component: CycleComponent;
  let fixture: ComponentFixture<CycleComponent>;
/**
	 * Vor jedem Test:
	 * - Konfiguriert das TestBed mit den notwendigen Modulen und Komponenten.
	 * - Kompiliert die Komponenten.
	 * - Initialisiert die Komponente und das zugehörige Fixture.
	 * - Löst Change Detection aus, um sicherzustellen, dass die Komponente korrekt initialisiert ist.
	 */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
/**
	 * Testet, ob die Komponente erfolgreich erstellt wurde.
	 */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
