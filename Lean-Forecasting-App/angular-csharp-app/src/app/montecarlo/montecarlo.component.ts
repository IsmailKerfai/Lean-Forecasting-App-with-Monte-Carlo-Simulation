import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * MontecarloComponent - Diese Komponente ist für die Auswahl der unterschiedlichen Modi für die Montecarlo Prognosen da. Es gibt die Auswahl zwischen einem
 * Forecast Release und einem Forecast Sprint.
 * 
 * Autor: Wael Laatiri und Jeanette Maziossek
 * Version: 21.01.2025
 */

@Component({
  selector: 'app-montecarlo',
  standalone: true,
  templateUrl: './montecarlo.component.html',
  styleUrls: ['./montecarlo.component.css'],
})
export class MontecarloComponent {

  //Routing der Buttons
  constructor(private router: Router) {}

  /**
   * Navigiert zum Dashboard.
   */
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Navigiert zur Seite für den Throughput.
   */
  navigateToThroughput(): void {
    this.router.navigate(['/throughput']);
  }

  /**
   * Navigiert zur Cycle-Ansicht
   */
  navigateToCycle(): void {
    this.router.navigate(['/cycle']);
  }

  /**
   * Navigiert zur Prognose-Ansicht
   */
  navigateToPrognosis(): void {
    this.router.navigate(['/prognosis']);
  }

  /**
   * Navigiert zur Forecast-Release-Ansicht
   */
  navigateToForecastRelease(): void {
    this.router.navigate(['/prognosis/forecast-Release']);
  }

  /**
   * Navigiert zur Forecast-Sprint-Ansicht
   */
  navigateToForecastSprint(): void {
    this.router.navigate(['/prognosis/forecast-Sprint']);
  }

}
