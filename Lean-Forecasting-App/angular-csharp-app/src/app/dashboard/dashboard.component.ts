import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import * as Papa from 'papaparse'; // For CSV parsing
import { CommonModule } from '@angular/common';

/**
 * DashboardComponent
 * 
 * Diese Komponente zeigt das Dashboard der Anwendung und enthält Funktionen
 * zum Navigieren zwischen verschiedenen Seiten und das Hochladen und Verarbeiten von Dateien.
 * 
 * Autor: Wael Laatiri und Jeanette Maziossek
 * Version: 21.01.2025
 */

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule],
})
export class DashboardComponent {
  title = 'angular-docker';



  // Routing and API service injection
  constructor(
    private router: Router,
    private fileUploadService: AppService
  ) {}

  /**
   * Navigiert zum Dashboard
   */
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Navigiert zum Throughput-Bereich
   */
  navigateToThroughput(): void {
    this.router.navigate(['/throughput']);
  }

  /**
   * Navigiert zum Cycle-Time-Bereich
   */
  navigateToCycle(): void {
    this.router.navigate(['/cycle']);
  }

  /**
   * Navigiert zum Prognose-Bereich
   */
  navigateToPrognosis(): void {
    this.router.navigate(['/prognosis']);
  }

  // File handling & response properties
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  message: string | null = null;
  totalFeatures: number | null = null;
  totalStories: number | null = null;

  // CSV preview data (only to be shown on a valid file)
  csvHeaders: string[] = [];
  csvData: string[][] = [];

  // New property to control whether CSV preview is visible
  showPreview: boolean = false;

  /**
   * Wird ausgelöst, wenn der Benutzer eine Datei auswählt
   * @param event - Das Event, das beim Datei-Upload ausgelöst wird
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;

      // Clear any previous preview and API response data
      this.csvHeaders = [];
      this.csvData = [];
      this.message = null;
      this.totalFeatures = null;
      this.totalStories = null;
      this.showPreview = false;

      // Upload the file to the API and then handle response
      this.onUpload(this.selectedFile);

      // Reset file input so that the same file can be re-selected if needed.
      input.value = '';
    } else {
      this.message = 'Keine Datei ausgewählt.';
      this.selectedFileName = null;
    }
  }

  /**
   * Lädt die ausgewählte Datei und verarbeitet die Antwort
   * @param file - Die Datei, die hochgeladen werden soll
   */
  onUpload(file: File): void {
    this.fileUploadService.uploadFile(file).subscribe({
      next: (response: { message: string; totalFeatures: number; totalStories: number }) => {
        // If the API returns success, update the response values
        this.message = response.message || 'Datei erfolgreich hochgeladen!';
        this.totalFeatures = response.totalFeatures || null;
        this.totalStories = response.totalStories || null;

        // Parse and show the CSV preview only if the file is valid
        this.parseCSV(file);
      },
      error: (error) => {
        // For an invalid file, update the message with the error. No CSV preview is shown.
        this.message = error.error?.Message || 'Fehler beim Hochladen der Datei.';
        console.error('Upload error:', error);
      },
    });
  }

  /**
   * Parst den Inhalt der CSV-Datei und zeigt eine Vorschau an
   * @param file - Die zu parsende CSV-Datei
   */
  parseCSV(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      Papa.parse(content, {
        complete: (result) => {
          // Check if there is more than just an empty row.
          if (result.data && result.data.length > 1) {
            this.csvHeaders = result.data[0] as string[];
            this.csvData = result.data.slice(1) as string[][];
          } else {
            // If parsing fails locally, update the message.
            this.message = 'The uploaded file is empty or invalid.';
          }
        },
        header: false,
        skipEmptyLines: true,
      });
    };
    reader.readAsText(file);
  }

  /**
   * Schaltet die Sichtbarkeit der CSV-Vorschau um
   */
  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  /**
   * Lädt eine neue Datei hoch, indem der Benutzer die Datei manuell auswählt
   */
  uploadNewFile(): void {
    // Clear previous preview and response data before uploading a new file
    this.csvHeaders = [];
    this.csvData = [];
    this.selectedFileName = null;
    this.message = null;
    this.totalFeatures = null;
    this.totalStories = null;
    this.showPreview = false;

    // Programmatically trigger the file input click
    document.getElementById('file-upload')?.click();
  }
}
