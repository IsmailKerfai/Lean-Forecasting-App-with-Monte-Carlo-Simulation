import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api';
import { Chart, ScatterDataPoint } from 'chart.js/auto';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import 'chartjs-adapter-date-fns';
import { concatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cycle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.css'],
})

/*
Die Klasse CycleComponent beinhaltet alle Graphen für die Stories und EingabeFunktionen
@Author Cihan Miro Mueller
@version 19.01.2025
*/
export class CycleComponent implements OnInit{
	//Graph1 Cycle Day - Stories
	xAchse_Cycle_Day: string[] = [];
	yAchse_Cycle_Day: number[] = [];
	Cycle_Day_85: number = 0;
	Cycle_Day_50: number = 0;
	//Graph2 Lead Day - Stories
	xAchse_Lead_Day: string[] = [];
	yAchse_Lead_Day: number[] = [];
	Lead_Day_85: number = 0;
	Lead_Day_50: number = 0;
	//Graph3 Cycle Efficiency - Stories
	xAchse_Cycle_Efficiency: string[] = [];
	yAchse_Cycle_Efficiency: number[] = [];
	Cycle_Efficiency_85: number = 0;
	Cycle_Efficiency_50: number = 0;
	
	//Filterwerte
	startDate: Date | null = null;
	endDate: Date | null = null;
	
	//Variable für API-Antwort
	responseMessage: number = 0;
	responseText: string = '';
	
	//Feature und Story Button
	selectedButton: string = 'stories';
	
	selectButton(button: string): void {
		this.selectedButton = button;
	}
	
	constructor(private router: Router, private apiService: ApiService) {}
	/**
	 * Navigiert zum Dashboard.
	 */
	navigateToDashboard(): void{
		this.router.navigate(['/dashboard']);
	}
	/**
	 * Navigiert zum Throughput-Bereich.
	 */
	navigateToThroughput(): void{
		this.router.navigate(['/throughput']);
	}
	/**
	 * Navigiert zur Prognose-Seite.
	 */
	navigateToPrognosis(): void{
		this.router.navigate(['/prognosis']);
	}
	/**
	 * Navigiert zum Cycle-Bereich.
	 */
	navigateToCycle(): void{
		this.router.navigate(['/cycle']);
	}
	/**
	 * Navigiert zum Feature-Bereich.
	 */
	navigateToFeature() {
		this.router.navigate(['/cycle-feature']);
	}
	/**
	 * Verarbeitet das Startdatum aus einem Eingabefeld.
	 * @param target - Das Eventziel, typischerweise ein Input-Element.
	 * @returns Ein Datum oder null, falls das Datum ungültig ist.
	 */
	handleDateChangestart(target: EventTarget | null): Date | null {
		if (target && target instanceof HTMLInputElement && target.value) {
			return new Date(target.value);
		}
			return null;
	}
	/**
	 * Verarbeitet das Enddatum aus einem Eingabefeld.
	 * @param target - Das Eventziel, typischerweise ein Input-Element.
	 * @returns Ein Datum oder null, falls das Datum ungültig ist.
	 */
	handleDateChangeend(target: EventTarget | null): Date | null {
		if (target && target instanceof HTMLInputElement && target.value) {
			return new Date(target.value);
		}
			return null;
	}
	/**
	 * Sendet das ausgewählte Datum an die API und lädt die zugehörigen Graph-Daten.
	 */
	SendDate(): void{
		if(this.startDate && this.endDate){
			console.log('Start Date:', this.startDate, 'End Date:', this.endDate);
			
			// Formatierung der Daten für die API (yyyy-MM-dd)
       		const formattedStartDate = this.startDate.toISOString().split('T')[0]; // yyyy-MM-dd
        	const formattedEndDate = this.endDate.toISOString().split('T')[0]; // yyyy-MM-dd
			
			this.apiService.getSendDate_Stories(formattedStartDate, formattedEndDate).subscribe(
				(response: number) => {
					console.log('API Response:', response);
					this.loadGraphData();
					this.responseText = response === 1 ? 'Berechnet' : 'Ungültiges Datum';
				},
				(error: any) => {
					console.log('Error:', error);
					this.responseMessage = -1;
					this.responseText = 'Fehler beim Senden der Daten.';
				}
			);
		}else{
			console.warn('Bitte wählen Sie sowohl ein Start- als auch ein Enddatum.');
		}
	}
	/**
	 * Lädt die Daten für die Graphen über die API und verarbeitet diese.
	 */
	private loadGraphData(): void{
			this.apiService.getxAchse_Cycle_Day().pipe(
			// Cycle Day - Stories
			concatMap((xAchse_Cycle_Day) => {
				this.xAchse_Cycle_Day = xAchse_Cycle_Day;
				return this.apiService.getyAchse_Cycle_Day();
			}),
			concatMap((yAchse_Cycle_Day) => {
				this.yAchse_Cycle_Day = yAchse_Cycle_Day;
				return this.apiService.get_Cycle_Day_85();
			}),
			concatMap((Cycle_Day_85) => {
				this.Cycle_Day_85 = Cycle_Day_85;
				return this.apiService.get_Cycle_Day_50();
			}),
			concatMap((Cycle_Day_50) => {
				this.Cycle_Day_50 = Cycle_Day_50;
				return this.apiService.getxAchse_Lead_Day();
			}),
			// Lead Day - Stories
			concatMap((xAchse_Lead_Day) => {
				this.xAchse_Lead_Day = xAchse_Lead_Day;
				return this.apiService.getyAchse_Lead_Day();
			}),
			concatMap((yAchse_Lead_Day) => {
				this.yAchse_Lead_Day = yAchse_Lead_Day;
				return this.apiService.get_Lead_Day_85();
			}),
			concatMap((Lead_Day_85) => {
				this.Lead_Day_85 = Lead_Day_85;
				return this.apiService.get_Lead_Day_50();
			}),
			concatMap((Lead_Day_50) => {
				this.Lead_Day_50 = Lead_Day_50;
				return this.apiService.getxAchse_Cycle_Efficiency();
			}),
			// Cycle Efficiency - Stories
			concatMap((xAchse_Cycle_Efficiency) => {
				this.xAchse_Cycle_Efficiency = xAchse_Cycle_Efficiency;
				return this.apiService.getyAchse_Cycle_Efficiency();
			}),
			concatMap((yAchse_Cycle_Efficiency) => {
				this.yAchse_Cycle_Efficiency = yAchse_Cycle_Efficiency;
				return this.apiService.get_Cycle_Efficiency_85();
			}),
			concatMap((Cycle_Efficiency_85) => {
				this.Cycle_Efficiency_85 = Cycle_Efficiency_85;
				return this.apiService.get_Cycle_Efficiency_50();
			}),
			concatMap((Cycle_Efficiency_50) => {
				this.Cycle_Efficiency_50 = Cycle_Efficiency_50;
				return new Observable((observer) => {
					// Signalisiert das Ende der Verarbeitung
					this.initializeCharts(); // Charts initialisieren
					observer.next();
					observer.complete();
				});
			})
		).subscribe({
			next: () => {
				console.log('Alle Daten erfolgreich geladen und verarbeitet.');
			},
			error: (err) => {
				console.error('Fehler beim Abrufen der Daten:', err);
			}
		});
	}
	/*
	Initialiesiert die Gesamte Seite
	*/
	ngOnInit(): void {
		this.loadGraphData();
		this.apiService.getstartDate_Stories().subscribe(
        (date: string[]) => {
            if (date && date.length > 0) {
                this.startDate = new Date(date[0]); // Falls Datum da ist, umwandeln
                console.log('Server Date:', this.startDate);
            } else {
                console.log('No start date set.');
            }
        },
        (error) => {
            console.error('Error fetching start date:', error);
        }
    	);
    	
    	this.apiService.getendDate_Stories().subscribe(
        (date: string[]) => {
            if (date && date.length > 0) {
                this.endDate = new Date(date[0]); // Falls Datum da ist, umwandeln
                console.log('Server Date:', this.endDate);
            } else {
                console.log('No start date set.');
            }
        },
        (error) => {
            console.error('Error fetching start date:', error);
        }
    	);
	}
	/**
	* Initialisiert alle Diagramme (Cycle Day, Lead Day, Cycle Efficiency).
	* Erstellt jedes Diagramm mithilfe der `createChart`-Methode.
	*/
	private initializeCharts(): void{
		this.createChart('Cycle_Day', this.xAchse_Cycle_Day, this.yAchse_Cycle_Day,'Stories', this.Cycle_Day_85, this.Cycle_Day_50, 'Cycle Day - Stories', false);
		this.createChart('Lead_Day', this.xAchse_Lead_Day, this.yAchse_Lead_Day,'Stories', this.Lead_Day_85, this.Lead_Day_50, 'Lead Day - Stories', false);
		this.createChart('Cycle_Efficiency', this.xAchse_Cycle_Efficiency, this.yAchse_Cycle_Efficiency,'Stories', this.Cycle_Efficiency_85, this.Cycle_Efficiency_50, 'Cycle Efficiency - Stories', true);
	}
	/**
	* Map zur Verwaltung aller aktuell erstellten Diagramme.
	*/
	private charts: Map<string, Chart> = new Map();
	
	/**
	* Erstellt ein Scatter-Diagramm und fügt es zur `charts`-Map hinzu.
	* Wenn ein Diagramm mit derselben Canvas-ID existiert, wird es zuerst zerstört.
	* 
	* @param canvasId - Die ID des Canvas-Elements im DOM.
	* @param xLabels - Array von X-Achsen-Beschriftungen (Datumswerte im Format MM/DD/YYYY).
	* @param yLabels - Array von Y-Achsen-Werten.
	* @param label - Bezeichnung für die Haupt-Datensätze.
	* @param line1 - Wert für die 85%-Linie.
	* @param line2 - Wert für die 50%-Linie.
	* @param titel - Titel des Diagramms.
	* @param percentage - Gibt an, ob die Y-Achse in Prozentwerten dargestellt wird.
	*/
	private createChart(canvasId: string, xLabels: string[], yLabels: number[], label: string, line1: number, line2: number, titel: string, percentage: boolean): void {
		const ctx = document.getElementById(canvasId) as HTMLCanvasElement;

		if (ctx) {
			// Existierenden Chart löschen, falls vorhanden
			if (this.charts.has(canvasId)) {
				this.charts.get(canvasId)?.destroy();
				this.charts.delete(canvasId);
			}

			//console.log('xLabels:', xLabels);

			// Konvertiere xLabels (Dates) in Timestamps
			const xDates: Date[] = xLabels.map((label) => {
				const [month, day, year] = label.split('/').map(Number);
				return new Date(year, month - 1, day); // JavaScript Date: Month is zero-based
			});

			const data: ScatterDataPoint[] = xDates.map((date, index) => ({
				x: date.getTime(),
				y: yLabels[index],
			}));

			// Neue Chart-Instanz erstellen
			const newChart = new Chart(ctx, {
				type: 'scatter',
				data: {
					datasets: [
						{
							label: label,
							data: data, // Verwendung der konvertierten Daten
							backgroundColor: 'rgba(0, 0, 255, 0.5)',
							borderColor: 'black',
							borderWidth: 1,
							tension: 0.4,
						},
						{
							label: percentage ? `85%` : `85% weniger als ${line1} Tage`,
							data: [
								{ x: Math.min(...xDates.map((date) => date.getTime())), y: line1 },
								{ x: Math.max(...xDates.map((date) => date.getTime())), y: line1 }
							],
							type: 'line',
							borderColor: 'green',
							backgroundColor: 'green',
							borderWidth: 2.3,
							fill: false,
							pointRadius: 0,
							order: 2, //Linie liegt über den punkten
						},
						{
							label: percentage ? `50%` : `50% weniger als ${line2} Tage`,
							data: [
								{ x: Math.min(...xDates.map((date) => date.getTime())), y: line2 },
								{ x: Math.max(...xDates.map((date) => date.getTime())), y: line2 }
							],
							borderColor: 'red',
							backgroundColor: 'red',
							borderWidth: 2.3,
							fill: false,
							type: 'line',
							pointRadius: 0,
							order: 1, //Linie liegt über den Punkten
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: true,
							position: 'top',
							labels: {
								color: '#041B2B',
								font: {
									family: 'Arial',
								},
							},
						},
						title: {
							display: true,
							text: `${titel}`,
							font: {
								size: 18,
								weight: 'bold',
								family: 'Arial',
							},
							color: '#041B2B',
						},
					},
					scales: {
						x: {
							type: 'time',
							time: {
								unit: 'day',
							},
							title: {
								display: false,
								text: 'Date',
							},
							ticks: {
								callback: function (value: any) {
									const date = new Date(value);
									const day = String(date.getDate()).padStart(2, '0');
									const month = String(date.getMonth() + 1).padStart(2, '0');
									const year = date.getFullYear();
									return `${day} ${month} ${year}`;
								},
							},
						},
						y: {
							title: {
								display: true,
								text: '',
							},
							ticks: {
								callback: function (tickValue: string | number) {
									if (percentage && typeof tickValue === 'number') {
										return `${tickValue}%`; // Prozentzeichen anhängen
									}
									return tickValue;
								},
							},
						},
					},
				},
			});
			// Neue Chart-Instanz in Map speichern
			this.charts.set(canvasId, newChart);
		}
	}
}
