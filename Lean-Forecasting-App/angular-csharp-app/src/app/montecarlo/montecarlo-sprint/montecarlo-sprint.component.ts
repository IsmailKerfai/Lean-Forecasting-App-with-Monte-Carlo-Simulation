import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { Chart } from 'chart.js/auto';
import { Plugin } from 'chart.js';
import {CommonModule} from '@angular/common';

/**
 * ForecastStoriesComponent - Diese Komponente ist für das Monte Carlo Simulation und die Visualisierung der Simulationsergebnisse verantwortlich.
 * Sie ermöglicht die Simulation von Release-Daten basierend auf Features oder Stories, berechnet die Enddaten für beide Szenarien und stellt
 * die Ergebnisse als Histogramme dar.
 * 
 * Autor: Wael Laatiri und Jeanette Maziossek
 * Version: 21.01.2025
 */

@Component({
  selector: 'app-montecarlo-sprint',
  templateUrl: './montecarlo-sprint.component.html',
  standalone: true,
  styleUrl: './montecarlo-sprint.component.css',
  imports: [CommonModule],
})
export class forecastStoriesComponent implements OnInit{
  chart: any;
  activeButton: 'features' | 'stories' = 'features';
  simulationKey: string = '';

  //Charts Variables
  featureBins: number[] = [];
  featureFrequencies: number[] = [];

  storyBins: number[] = [];
  storyFrequencies: number[] = [];


  //Test description parameters for features
  p50: number = 0;
  p85: number = 0;
  p95: number = 0;
  numberOfWeeks: number = 0;
  storiesPerFeature: number = 0;
  numberOfStoriesP95: number = 0;
  numberOfStoriesP85: number = 0;
  numberOfStoriesP50: number = 0;
  numberOfRightSizedFeatureP95: number = 0;
  numberOfRightSizedFeatureP85: number = 0;
  numberOfRightSizedFeatureP50: number = 0;


  // Stories Data
  storiesP50: number = 0;    // 50% for Stories
  storiesP85: number = 0;    // 85% for Stories
  totalWeeks: number = 0;
  totalSprints: number = 0;
  StoriesnumberOfStoriesP85: number = 0;
  StoriesnumberOfStoriesP50: number = 0;
  // default inputs
  defaultSimulationCount: number = 5000;
  defaultStartDate: string = '';
  defaultEndDate: string = '';
  defaultStartDateStories: string = ''; // will be set from stories simulation key
  defaultEndDateStories: string = '';   // will be set from stories simulation key
  defaultFeaturesStartDate: string = '2025-01-01';
  defaultFeaturesEndDate: string = '2025-03-31';
  defaultStoriesStartDate: string = '2024-11-22';
  defaultStoriesEndDate: string = '2025-02-28';

  // dynamic values
  startDate: string = this.defaultStartDate;
  endDate: string = this.defaultEndDate;
  startDateStories: string = this.defaultStartDateStories;
  endDateStories: string = this.defaultEndDateStories;
  simulationCount: number = this.defaultSimulationCount;

  featureStartDate: string = this.defaultFeaturesStartDate;
  featureEndDate: string = this.defaultFeaturesEndDate;
  storyStartDate: string = this.defaultStoriesStartDate;
  storyEndDate: string = this.defaultStoriesEndDate;


  /**
   * Initialisiert den Komponent und führt die Simulation zu Beginn aus.
   */
  ngOnInit() {
    this.runSimulation(this.startDate, this.endDate, this.defaultSimulationCount);
  }

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



  constructor(private router: Router, private appService: AppService) {
  }

  /**
   * Setzt den Wert der Simulation (Anzahl der Durchläufe).
   * @param event Das Change-Event des Inputs
   */
  onSimulationCountChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    // Ensure the input is a valid positive number
    this.simulationCount = value > 0 ? value : this.defaultSimulationCount;
  }

  /**
   * Setzt das Startdatum je nach aktivem Modus ('features' oder 'stories').
   * @param event Das Change-Event des Inputs
   */
  onStartDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (this.activeButton === 'features') {
      this.startDate = target.value || this.defaultStartDate;
    } else {
      this.startDateStories = target.value || this.defaultStartDateStories;
    }
  }

  /**
   * Setzt das Enddatum je nach aktivem Modus ('features' oder 'stories').
   * @param event Das Change-Event des Inputs
   */
  onEndDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (this.activeButton === 'features') {
      this.endDate = target.value || this.defaultEndDate;
    } else {
      this.endDateStories = target.value || this.defaultEndDateStories;
    }
  }

  /**
   * Speichert die aktuell eingestellten Daten und startet die entsprechende Simulation.
   */
  onSaveDates(): void {
    if (this.activeButton === 'features') {
      this.fetchCountFeatureSimulation(); // Call fetchCountFeatures with updated dates
    } else {
      this.fetchCountStorySimulation(); // Call fetchCountStories with updated dates
    }
  }


  /**
   * Behandelt die Eingabe des Startdatums und validiert das Format.
   * @param event Das Event mit der Eingabe des Benutzers
   */
  onDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const part = input.value.split("-");

    if (part.length === 3) {
      const year = part[0];

      // Restrict year length to 4 characters
      if (year.length > 4) {
        part[0] = year.substring(0, 4); // Trim to 4 characters
        input.value = part.join("-");
      }
    }
  }

  /**
   * Behandelt die Eingabe des Enddatums und validiert das Format.
   * @param event Das Event mit der Eingabe des Benutzers
   */
  handleStartDateInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    // Validate the date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input)) {
      console.error("Invalid date format. Please use YYYY-MM-DD.");
      if (this.activeButton === 'features') {
        this.featureStartDate = this.defaultFeaturesStartDate;
      } else if (this.activeButton === 'stories') {
        this.storyStartDate = this.defaultStoriesStartDate;
      }
    } else {
      if (this.activeButton === 'features') {
        this.featureStartDate = input;
      } else if (this.activeButton === 'stories') {
        this.storyStartDate = input;
      }
    }
  }

  /**
   * Behandelt die Eingabe des Enddatums und validiert das Format.
   * @param event Das Event mit der Eingabe des Benutzers
   */
  handleEndDateInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    // Validate the date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input)) {
      console.error("Invalid date format. Please use YYYY-MM-DD.");
      if (this.activeButton === 'features') {
        this.featureEndDate = this.defaultFeaturesEndDate;
      } else if (this.activeButton === 'stories') {
        this.storyEndDate = this.defaultStoriesEndDate;
      }
    } else {
      if (this.activeButton === 'features') {
        this.featureEndDate = input;
      } else if (this.activeButton === 'stories') {
        this.storyEndDate = input;
      }
    }
  }

  /**
   * Setzt den aktiven Button ('features' oder 'stories') und startet die entsprechende Simulation.
   * @param button Der Modus, der aktiviert werden soll ('features' oder 'stories')
   */
  setActiveButton(button: 'features' | 'stories') {
    this.activeButton = button;
    const count = this.simulationCount;
    if (button === 'features') {
      const startDateToUse = (this.startDate && this.startDate.trim()) || this.defaultStartDate;
      const endDateToUse   = (this.endDate && this.endDate.trim())   || this.defaultEndDate;
      this.runSimulation(startDateToUse, endDateToUse, count);
    } else {
      const startDateToUse = (this.startDateStories && this.startDateStories.trim()) || this.defaultStartDateStories;
      const endDateToUse   = (this.endDateStories && this.endDateStories.trim())   || this.defaultEndDateStories;
      this.runStoriesSimulation(startDateToUse, endDateToUse, count);
    }
  }


  /**
   * Je nachdem, ob der Modus 'features' oder 'stories' ausgewählt wird, erfolgt die Simulation dessen.
   */
  onSimulate() {
    const count = this.simulationCount > 0 ? this.simulationCount : this.defaultSimulationCount;
    if (this.activeButton === 'features') {
      const startDateToUse = (this.startDate && this.startDate.trim()) || this.defaultStartDate;
      const endDateToUse   = (this.endDate && this.endDate.trim())   || this.defaultEndDate;
      console.log('Feature simulation triggered with:', startDateToUse, endDateToUse, count);
      this.runSimulation(startDateToUse, endDateToUse, count);
    } else {
      // For stories simulation, use the stories simulation defaults if dates are empty.
      const startDateToUse = (this.startDateStories && this.startDateStories.trim()) || this.defaultStartDateStories;
      const endDateToUse   = (this.endDateStories && this.endDateStories.trim())   || this.defaultEndDateStories;
      console.log('Story simulation triggered with:', startDateToUse, endDateToUse, count);
      this.runStoriesSimulation(startDateToUse, endDateToUse, count);
    }
  }

  private formatDate(dateStr: string): string {
    const [month, day, year] = dateStr.split('/');
    const mm = month.padStart(2, '0');
    const dd = day.padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }


  /**
   * Führt die Simulation für Features durch und verarbeitet die erhaltenen Daten.
   * @param startDate Das Startdatum der Simulation
   * @param endDate Das Enddatum der Simulation
   * @param iterations Die Anzahl der Durchläufe
   */
  runSimulation(startDate: string, endDate: string, iterations: number) {
    this.appService.runFeaturesSimulation(startDate, endDate, iterations).subscribe({
      next: (response) => {
        console.log('Feature simulation response:', response);
        this.simulationKey = response.simulationKey;
        const parts = this.simulationKey.split('_');
        if (parts.length === 3) {
          this.defaultStartDate = this.formatDate(parts[0]);
          this.defaultEndDate = this.formatDate(parts[1]);
          this.simulationCount = Number(parts[2]);
          if (!this.startDate) { this.startDate = this.defaultStartDate; }
          if (!this.endDate)   { this.endDate = this.defaultEndDate; }
          console.log('Parsed simulation key:', this.defaultStartDate, this.defaultEndDate, this.simulationCount);
        } else {
          console.warn('Unexpected simulation key format:', this.simulationKey);
        }
        this.fetchCountFeatureSimulation();
      },
      error: (err) => console.error('Error running feature simulation:', err),
    });
  }


  /**
   * Führt die Simulation für Stories durch und verarbeitet die erhaltenen Daten.
   * @param startDate Das Startdatum der Simulation
   * @param endDate Das Enddatum der Simulation
   * @param iterations Die Anzahl der Durchläufe
   */
  runStoriesSimulation(startDate: string, endDate: string, iterations: number) {
    this.appService.runStoriesSimulation(startDate, endDate, iterations).subscribe({
      next: (response) => {
        console.log('Story simulation response:', response);
        this.simulationKey = response.simulationKey;
        const parts = this.simulationKey.split('_');
        if (parts.length === 3) {
          // Update the stories-specific default simulation dates:
          this.defaultStartDateStories = this.formatDate(parts[0]);
          this.defaultEndDateStories = this.formatDate(parts[1]);
          this.simulationCount = Number(parts[2]);
          if (!this.startDateStories) { this.startDateStories = this.defaultStartDateStories; }
          if (!this.endDateStories) { this.endDateStories = this.defaultEndDateStories; }
          console.log('Parsed story simulation key:', this.defaultStartDateStories, this.defaultEndDateStories, this.simulationCount);
        } else {
          console.warn('Unexpected simulation key format:', this.simulationKey);
        }
        this.fetchCountStorySimulation();
      },
      error: (err) => console.error('Error running story simulation:', err),
    });
  }

  /**
   * Lädt und verarbeitet die Häufigkeit von Features für die Simulation.
   */
  fetchCountFeatureSimulation() {
    const startDateFeature = this.featureStartDate || this.defaultFeaturesStartDate;
    const endDateFeature = this.featureEndDate || this.defaultFeaturesEndDate;

    // Log current settings
    console.log('Fetching feature simulation with:', {
      startDateFeature,
      endDateFeature,
    });
    // Call the API

    this.appService.SimulateFeatureCount(this.simulationKey, startDateFeature, endDateFeature)
      .subscribe({
        next: (response) => {
          console.log('Feature Count Simulation Data:', response);

          // Dynamically assign values from the response
          this.numberOfWeeks = response.numberOfWeeks;
          this.p50 = response.p50;
          this.p85 = response.p85;
          this.p95 = response.p95;
          this.storiesPerFeature = response.storiesPerFeature;

          this.numberOfStoriesP95 = response.numberOfStoriesP95;
          this.numberOfStoriesP85 = response.numberOfStoriesP85;
          this.numberOfStoriesP50 = response.numberOfStoriesP50;

          this.numberOfRightSizedFeatureP95 = response.numberOfRightSizedFeatureP95;
          this.numberOfRightSizedFeatureP85 = response.numberOfRightSizedFeatureP85;
          this.numberOfRightSizedFeatureP50 = response.numberOfRightSizedFeatureP50;

          // Trigger further processing or UI updates as needed
          this.fetchFeaturesHistogramSprint();
        },
        error: (err) => {
          console.error('Error fetching feature simulation:', err);
        }
      });
  }


  /**
   * Lädt und verarbeitet die Häufigkeit von Stories für die Simulation.
   */
  fetchCountStorySimulation() {
    const startDateStory = this.storyStartDate || this.defaultStoriesStartDate;
    const endDateStory = this.storyEndDate || this.defaultStoriesEndDate;

    // Log current settings
    console.log('Fetching feature simulation with:', {
      startDateStory,
      endDateStory,
    });
    // Call the Story Simulation API
    this.appService.simulateStoryCount(this.simulationKey, startDateStory, endDateStory)
      .subscribe({
        next: (response) => {
          console.log('Story Count Simulation Data:', response);

          // Dynamically assign values from the response
          this.storiesP50 = response.p50;
          this.storiesP85 = response.p85;

          this.totalWeeks = response.totalWeeks;
          this.totalSprints = response.totalSprints;

          this.StoriesnumberOfStoriesP50 = response.numberOfStoriesP50;
          this.StoriesnumberOfStoriesP85 = response.numberOfStoriesP85;

          // Trigger further processing or UI updates as needed
          this.fetchStoriesHistogramSprint();
        },
        error: (err) => {
          console.error('Error fetching story simulation:', err);
        }
      });
  }

  /**
   * Lädt und verarbeitet die Häufigkeit von Features für das Histogramm.
   */
  fetchFeaturesHistogramSprint() {
    this.appService.getFeaturesHistogram(this.simulationKey).subscribe({
      next: (response) => {
        this.featureBins = response['Bins '] ?? [];
        this.featureFrequencies = response['Frequencies '] ?? [];
        this.renderChart();
      },
      error: (err) => console.error('Error fetching features histogram:', err),
    });
  }

  /**
   * Lädt und verarbeitet die Häufigkeit von Stories für das Histogramm.
   */
  fetchStoriesHistogramSprint() {
    this.appService.getStoriesHistogram(this.simulationKey).subscribe({
      next: (response) => {
        this.storyBins = response['Bins '] ?? [];
        this.storyFrequencies = response['Frequencies '] ?? [];
        this.renderChart();
      },
      error: (err) => console.error('Error fetching stories histogram:', err),
    });
  }

  /**
   * Rendert das Diagramm und fügt vertikale Linien für P50, P85 und P95 hinzu.
   */
  renderChart() {
    const ctx = document.getElementById('sprintChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const bins = this.activeButton === 'features' ? this.featureBins : this.storyBins;
    const frequencies = this.activeButton === 'features' ? this.featureFrequencies : this.storyFrequencies;


    const verticalLinePlugin: Plugin = {
      id: 'verticalLines',
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        const xAxis = chart.scales['x'];

        console.log('X-Axis Ticks:', xAxis.ticks);

        const findClosestTickIndex = (value: number, bins: number[]) => {
          let closestIndex = -1;
          let minDiff = Number.MAX_VALUE;
          bins.forEach((bin, index) => {
            const diff = Math.abs(bin - value);
            if (diff < minDiff) {
              minDiff = diff;
              closestIndex = index;
            }
          });
          return closestIndex;
        };

        const drawLine = (value: number, color: string, label: string) => {
          const index = findClosestTickIndex(value, bins);
          if (index === -1) {
            console.warn(`Value ${value} not found in bins`);
            return;
          }

          const position = xAxis.getPixelForTick(index);
          if (position === null || isNaN(position)) {
            console.warn(`Position for value ${value} at index ${index} is invalid`);
            return;
          }

          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.moveTo(position, chart.chartArea.top);
          ctx.lineTo(position, chart.chartArea.bottom);
          ctx.stroke();

          ctx.fillStyle = color;
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(label, position, chart.chartArea.top - 10);
          ctx.restore();
        };

        if (this.activeButton === 'features') {
          drawLine(this.p50, 'orange', '50%');
          drawLine(this.p85, 'green', '85%');
          drawLine(this.p95, 'lightgreen', '95%');
        } else if (this.activeButton === 'stories') {
          drawLine(this.storiesP50, 'orange', '50%');
          drawLine(this.storiesP85, 'green', '85%');
        }
      },
    };

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: bins.map((bin) => `PBI ${bin}`),
        datasets: [
          {
            label: 'PBIs Anzahl',
            data: frequencies,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            title: {display: true, text: 'PBI'},
            ticks: {autoSkip: false}, // Ensure all bins are shown
          },
          y: {
            title: {display: true, text: 'Anzahl'},
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {display: true},
        },
      },
      plugins: [verticalLinePlugin],
    });
  }
}
