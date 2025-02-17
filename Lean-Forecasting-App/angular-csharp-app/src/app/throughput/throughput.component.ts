import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import {CommonModule} from '@angular/common';
import { Plugin } from 'chart.js';


interface ThroughputResponse {
  throughputByFilter: { [key: string]: number };
  percent50: string;
  percent85: string;
}

@Component({
  selector: 'app-throughput',
  standalone: true,
  imports: [FormsModule, CommonModule], // Add CommonModule here
  templateUrl: './throughput.component.html',
  styleUrls: ['./throughput.component.css'],
})
export class ThroughputComponent implements OnInit {
  chart: any;
  activeButton: string = 'features';

  sprintStart: number = 1;
  sprintEnd: number = 4;
  monthStart: number = 1;
  monthEnd: number = 5;

  descriptionLine1: string = '';
  descriptionLine2: string = '';

  constructor(private router: Router, private appService: AppService) {}

  ngOnInit() {
    this.renderChart([], [], 'Filtered Features', 'Month'); // Render empty chart initially
    this.fetchDefaultRanges(); // Fetch ranges and then filter data
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToThroughput(): void {
    this.router.navigate(['/throughput']);
  }

  navigateToCycle(): void {
    this.router.navigate(['/cycle']);
  }

  navigateToPrognosis(): void {
    this.router.navigate(['/prognosis']);
  }

  setActiveButton(button: string) {
    this.activeButton = button;

    // Call the appropriate filter method based on the selected button
    if (this.activeButton === 'stories') {
      this.filterBySprint(); // Fetch and display sprint data
    } else if (this.activeButton === 'features') {
      this.filterByMonth(); // Fetch and display features data
    }
  }


  fetchDefaultRanges() {
    // Fetch both stories and features ranges simultaneously
    this.appService.getStoriesData().subscribe((data: { [key: string]: number }) => {
      const keys = Object.keys(data).map(Number);
      this.sprintStart = Math.min(...keys);
      this.sprintEnd = Math.max(...keys);

      // Filter stories after setting sprint range
      if (this.activeButton === 'stories') {
        this.filterBySprint();
      }
    });

    this.appService.getFeaturesData().subscribe((data: { [key: string]: number }) => {
      const keys = Object.keys(data).map(Number);
      this.monthStart = Math.min(...keys);
      this.monthEnd = Math.max(...keys);

      // Filter features after setting month range
      if (this.activeButton === 'features') {
        this.filterByMonth();
      }
    });
  }


  filterBySprint() {
    this.appService.filterStoriesBySprint(this.sprintStart, this.sprintEnd).subscribe((data: ThroughputResponse) => {
      const labels = Object.keys(data.throughputByFilter);
      const values = Object.values(data.throughputByFilter);
      this.updateChart(labels, values, 'Stories', 'Sprint');
      this.descriptionLine1 = data.percent50;
      this.descriptionLine2 = data.percent85;
    });
  }

  filterByMonth() {
    this.appService.filterFeaturesByMonth(this.monthStart, this.monthEnd).subscribe((data: ThroughputResponse) => {
      const labels = Object.keys(data.throughputByFilter);
      const values = Object.values(data.throughputByFilter);
      this.updateChart(labels, values, 'Features', 'Monat');
      this.descriptionLine1 = data.percent50;
      this.descriptionLine2 = data.percent85;
    });
  }
  renderChart(labels: string[], data: number[], label: string, xAxisTitle: string) {
    const ctx = document.getElementById('throughputChart') as HTMLCanvasElement;

    // Define the plugin for drawing horizontal lines
    const horizontalLinePlugin: Plugin = {
      id: 'horizontalLines',
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        const yAxis = chart.scales['y']; // Access the Y-axis
        const chartArea = chart.chartArea;

        // Helper function to draw a horizontal line
        const drawLine = (value: number, color: string, label: string) => {
          const yPosition = yAxis.getPixelForValue(value);
          if (yPosition === null || isNaN(yPosition)) {
            console.warn(`Y position for value ${value} is invalid`);
            return;
          }

          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.moveTo(chartArea.left, yPosition);
          ctx.lineTo(chartArea.right, yPosition);
          ctx.stroke();

          ctx.fillStyle = color;
          ctx.font = 'bold 15px Arial';
          ctx.textAlign = 'right';
          ctx.fillText(label, chartArea.right - 5, yPosition - 10);
          ctx.restore();
        };

        // Draw horizontal lines for percent50 and percent85
        const percent50 = parseInt(this.descriptionLine1, 10); // Make sure these are numeric
        const percent85 = parseInt(this.descriptionLine2, 10);

        if (!isNaN(percent50)) {
          drawLine(percent50, 'orange', '50%');
        }
        if (!isNaN(percent85)) {
          drawLine(percent85, 'green', '85%');
        }
      },
    };

    // Bind plugin context to `this` (if you rely on component properties)
    const boundPlugin = horizontalLinePlugin.afterDraw!.bind(this);
    horizontalLinePlugin.afterDraw = boundPlugin;

    // Create the chart instance with the plugin applied only to this chart
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              autoSkip: false,
            },
            title: {
              display: true,
              text: xAxisTitle,
              font: {
                size: 18,
              },
              padding: {
                top: 10,
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
              callback: function (value) {
                return value;
              },
            },
          },
        },
      },
      plugins: [horizontalLinePlugin] // <-- Add plugin here
    });
  }



  updateChart(labels: string[], data: number[], label: string, xAxisTitle: string) {
    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.data.datasets[0].label = label;
      this.chart.options.scales.x.title.text = xAxisTitle;
      this.chart.update();
    }
  }
}
