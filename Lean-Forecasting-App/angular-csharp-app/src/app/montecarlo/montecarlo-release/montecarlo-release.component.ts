import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { Chart } from 'chart.js/auto';
import { Plugin } from 'chart.js';
import {CommonModule} from '@angular/common';

/**
 * ForecastReleaseComponent - Diese Komponente ist für das Monte Carlo Simulation und die Visualisierung der Simulationsergebnisse verantwortlich.
 * Sie ermöglicht die Simulation von Release-Daten basierend auf Features oder Stories, berechnet die Enddaten für beide Szenarien und stellt
 * die Ergebnisse als Histogramme dar.
 * 
 * Autor: Wael Laatiri und Jeanette Maziossek
 * Version: 21.01.2025
 */

@Component({
  selector: 'app-montecarlo-release',
  standalone: true,
  templateUrl: './montecarlo-release.component.html',
  styleUrls: ['./montecarlo-release.component.css'],
  imports: [CommonModule],
})
export class ForecastReleaseComponent implements OnInit {
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
  numberOfStories: number = 0;
  storiesPerFeature: number = 0;
  numberOfWeeksP50: number = 0;
  numberOfWeeksP85: number = 0;
  numberOfWeeksP95: number = 0;
  endDateP50: string = '';
  endDateP85: string = '';
  endDateP95: string = '';

  // Stories Data
  storiesP50: number = 0;    // 50% for Stories
  storiesP85: number = 0;    // 85% for Stories
  totalWeeksP50Stories: number = 0;
  totalWeeksP85Stories: number = 0;
  totalSprintsP50Stories: number = 0;
  totalSprintsP85Stories: number = 0;
  endDateP50Stories: string = '';
  endDateP85Stories: string = '';

  //Inputs for the Time Range and numbers of Simulations container
  // default inputs
  defaultSimulationCount: number = 5000;
  defaultStartDate: string = '';
  defaultEndDate: string = '';
  defaultStartDateStories: string = ''; // will be set from stories simulation key
  defaultEndDateStories: string = '';   // will be set from stories simulation key
  defaultFeaturesTarget: number = 6;
  defaultFeaturesStartDate: string = '2025-01-01';
  defaultStoriesStartDate: string = '2024-11-22'
  defaultStoryTarget: number = 42;


  // dynamic values
  startDate: string = this.defaultStartDate;
  endDate: string = this.defaultEndDate;
  startDateStories: string = this.defaultStartDateStories;
  endDateStories: string = this.defaultEndDateStories;
  simulationCount: number = this.defaultSimulationCount;



// End Date Input
  featureTarget: number = this.defaultFeaturesTarget;
  startDateFeature: string = this.defaultFeaturesStartDate;
  storyTarget: number = this.defaultStoryTarget;
  startDateStory: string = this.defaultStoriesStartDate;



  // Navigation Methods

  /**
   * Navigiert zum Dashboard
   */
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Navigiert zur Seite für den Throughput
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
   * Initialisiert die Simulation beim Laden der Komponente
   */
  ngOnInit() {
    this.runSimulation(this.startDate, this.endDate, this.defaultSimulationCount);
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
   * Behandelt die Eingabe des Startdatums und validiert das Format.
   * @param event Das Event mit der Eingabe des Benutzers
   */
  onDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Extract the current value
    const parts = input.value.split("-");

    if (parts.length === 3) {
      const year = parts[0];

      // Restrict year length to 4 characters
      if (year.length > 4) {
        parts[0] = year.substring(0, 4); // Trim to 4 characters
        input.value = parts.join("-");
      }
    }
  }


  /**
   * Validiert und setzt das Startdatum entsprechend der aktiven Simulation
   * @param event Das Change-Event des Inputs
   */
  handleStartDateChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    // Validate the date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input)) {
      console.error("Invalid date format. Please use YYYY-MM-DD.");
      if (this.activeButton === 'features') {
        this.startDateFeature = this.defaultFeaturesStartDate;
      } else if (this.activeButton === 'stories') {
        this.startDateStory = this.defaultStoriesStartDate;
      }
    } else {
      if (this.activeButton === 'features') {
        this.startDateFeature = input;
      } else if (this.activeButton === 'stories') {
        this.startDateStory = input;
      }
    }
  }


  /**
   * Behandelt Änderungen der Feature-Anzahl
   * @param event Das Change-Event des Inputs
   */
  onFeatureCountChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    this.featureTarget = value > 0 ? value : this.defaultFeaturesTarget;
  }

  /**
   * Behandelt Änderungen der Story-Anzahl
   * @param event Das Change-Event des Inputs
   */
  onStoryCountChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    this.storyTarget = value > 0 ? value : this.defaultStoryTarget;
  }

  /**
   * Setzt den aktiven Button auf 'features' oder 'stories'
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
   * Auslösen der Simulation mit den angegebenen Werten
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
   * Führt die Feature-Simulation durch und holt die Enddaten
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
        this.fetchEndDateFeatureSimulation();
      },
      error: (err) => console.error('Error running feature simulation:', err),
    });
  }


  /**
   * Führt die Story-Simulation durch und holt die Enddaten
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
        this.fetchStoryEndDateSimulation();
      },
      error: (err) => console.error('Error running story simulation:', err),
    });
  }

  /**
   * Holt die Enddaten für die Feature-Simulation und stellt das Histogramm dar
   */
  fetchEndDateFeatureSimulation() {
    // Use the provided inputs or fallback to defaults
    const featureCount = this.featureTarget > 0 ? this.featureTarget : this.defaultFeaturesTarget;
    const startDateFeature = this.startDateFeature || this.defaultFeaturesStartDate;

    // Log current settings
    console.log('Fetching feature simulation with:', {
      startDateFeature,
      featureCount,
    });

    this.appService
      .simulateFeatureEndDate(this.simulationKey, startDateFeature, featureCount)
      .subscribe({
        next: (response) => {
          console.log('End Date Simulation Data:', response);

          // Assign values dynamically
          this.p50 = response.p50;
          this.p85 = response.p85;
          this.p95 = response.p95;
          this.numberOfStories = response.numberOfStories;
          this.storiesPerFeature = response.storiesPerFeature;
          this.numberOfWeeksP50 = response.numberOfWeeksP50;
          this.numberOfWeeksP85 = response.numberOfWeeksP85;
          this.numberOfWeeksP95 = response.numberOfWeeksP95;
          this.endDateP50 = response.endDateP50;
          this.endDateP85 = response.endDateP85;
          this.endDateP95 = response.endDateP95;

          this.fetchFeaturesHistogram();
        },
        error: (err) => console.error('Error fetching end date simulation:', err),
      });
  }

/**
   * Holt die Enddaten für die Story-Simulation und stellt das Histogramm dar
   */
  fetchStoryEndDateSimulation() {
    // Use the provided inputs or fallback to defaults
    const storyCount = this.storyTarget > 0 ? this.storyTarget : this.defaultStoryTarget;
    const startDateStory = this.startDateStory || this.defaultStoriesStartDate;

    // Log current settings
    console.log('Fetching feature simulation with:', {
      startDateStory,
      storyCount,
    });


    this.appService
      .simulateStoryEndDate(this.simulationKey, startDateStory, storyCount)
      .subscribe({
        next: (response) => {
          console.log('Story End Date Simulation Data:', response);

          // Update Stories Data
          this.storiesP50 = response.p50;
          this.storiesP85 = response.p85;
          this.totalWeeksP50Stories = response.totalWeeksP50;
          this.totalWeeksP85Stories = response.totalWeeksP85;
          this.totalSprintsP50Stories = response.totalSprintsP50;
          this.totalSprintsP85Stories = response.totalSprintsP85;
          this.endDateP50Stories = response.endDateP50;
          this.endDateP85Stories = response.endDateP85;

          this.fetchStoriesHistogram();

        },
        error: (err) => console.error('Error fetching story end date simulation:', err),
      });
  }

  /**
   * Holt das Histogramm für Features
   */
  fetchFeaturesHistogram() {
    this.appService.getFeaturesHistogram(this.simulationKey).subscribe({
      next: (response) => {
        console.log('API Response for Features Histogram:', response); // Log API data
        this.featureBins = response['Bins '] ?? [];
        this.featureFrequencies = response['Frequencies '] ?? [];
        this.renderChart();
      },
      error: (err) => console.error('Error fetching features histogram:', err),
    });
  }

  /**
   * Holt das Histogramm für Stories
   */
  fetchStoriesHistogram() {
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
   * Rendert das Histogramm basierend auf den aktiven Daten
   */
  renderChart() {
    const ctx = document.getElementById('releaseChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const bins = this.activeButton === 'features' ? this.featureBins : this.storyBins;
    const frequencies = this.activeButton === 'features' ? this.featureFrequencies : this.storyFrequencies;

    console.log('Active Button:', this.activeButton);
    console.log('Bins:', bins);
    console.log('Frequencies:', frequencies);

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
