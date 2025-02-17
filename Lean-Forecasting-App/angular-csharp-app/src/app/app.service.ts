import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Der `AppService` stellt Methoden zur Verfügung, die HTTP-Anfragen an eine externe API senden.
 * Dieser Service wird verwendet, um verschiedene Daten zu laden, Simulationen zu starten und zu verwalten
 * sowie Dateien hochzuladen.
 *
 * @remarks
 * Der Service verwendet Angular's `HttpClient` für alle HTTP-Anfragen.
 */

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private apiUrl = 'http://localhost:5239/api'; // Die URL deiner C#-API

  /**
   * Der Konstruktor injiziert den `HttpClient`, um HTTP-Anfragen zu ermöglichen.
   * 
   * @param http Der `HttpClient` zum Senden von HTTP-Anfragen.
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Mithilfe der Funktion wird eine Datei auf den Server hochgeladen.
   * 
   * @param file Die Datei, die hochgeladen werden soll.
   * @returns Ein Observable, das die Antwort des Servers enthält.
   */
  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders();

    return this.http.post(`${this.apiUrl}/FileUpload/upload`, formData, {
      headers: headers
    });
  }


  /**
   * Führt eine Features-Simulation mit angegebenen Parametern aus.
   * 
   * @param startDate Das Startdatum der Simulation.
   * @param endDate Das Enddatum der Simulation.
   * @param iterations Die Anzahl der Iterationen, die durchgeführt werden sollen.
   * @returns Ein Observable, das das Ergebnis der Simulation enthält.
   */
  runFeaturesSimulation(
    startDate: string,
    endDate: string,
    iterations: number
  ): Observable<any> {
    let params = new HttpParams().set('iterations', iterations);

    // Only include startDateData if startDate is non-empty.
    if(startDate && startDate.trim() !== '') {
      params = params.set('startDateData', startDate);
    }
    if(endDate && endDate.trim() !== '') {
      params = params.set('endDateData', endDate);
    }

    return this.http.get(`${this.apiUrl}/MonteCarlo/RunFeaturesSimulation`, {params});
  }

  /**
   * Ruft das Histogramm für die Features-Simulation ab.
   * 
   * @param simulationKey Der Schlüssel der Simulation.
   * @returns Ein Observable, das die Histogrammdaten enthält.
   */
  getFeaturesHistogram(simulationKey: string): Observable<any> {
    const params = new HttpParams().set('simulationKey', simulationKey);

    return this.http.get(`${this.apiUrl}/MonteCarlo/GetFeaturesHistogram`, {params});
  }

  /**
   * Simuliert das Enddatum für ein bestimmtes Feature basierend auf den Eingabedaten.
   * 
   * @param simulationKey Der Schlüssel der Simulation.
   * @param startDate Das Startdatum für die Simulation.
   * @param featureTarget Das Ziel für das Feature.
   * @returns Ein Observable, das das Ergebnis der Simulation enthält.
   */
  simulateFeatureEndDate(
    simulationKey: string,
    startDate: string,
    featureTarget: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('simulationKey', simulationKey)
      .set('startDate', startDate)
      .set('FeatureTarget', featureTarget);

    return this.http.get(`${this.apiUrl}/MonteCarlo/SimulateFeatureEndDate`, {params});
  }

  /**
   * Simuliert die Anzahl der Features für eine gegebene Simulation.
   * 
   * @param simulationKey Der Schlüssel der Simulation.
   * @param startDate Das Startdatum der Simulation.
   * @param endDate Das Enddatum der Simulation.
   * @returns Ein Observable, das das Ergebnis der Simulation enthält.
   */
  SimulateFeatureCount(
    simulationKey: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('simulationKey', simulationKey)
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get(`${this.apiUrl}/MonteCarlo/SimulateFeatureCount`, {params});
  }

  /**
   * Führt eine Stories-Simulation aus, um eine Simulation mit den angegebenen Parametern zu starten.
   * 
   * @param startDate Das Startdatum der Simulation.
   * @param endDate Das Enddatum der Simulation.
   * @param iterations Die Anzahl der Iterationen, die durchgeführt werden sollen.
   * @returns Ein Observable, das das Ergebnis der Simulation enthält.
   */
  runStoriesSimulation(
    startDate: string,
    endDate: string,
    iterations: number
  ): Observable<any> {
    let params = new HttpParams().set('iterations', iterations);

    // Only include startDateData if startDate is non-empty.
    if(startDate && startDate.trim() !== '') {
      params = params.set('startDateData', startDate);
    }
    if(endDate && endDate.trim() !== '') {
      params = params.set('endDateData', endDate);
    }

    return this.http.get(`${this.apiUrl}/MonteCarlo/RunStoriesSimulation`, {params});
  }

  /**
   * Ruft das Histogramm für die Stories-Simulation auf.
   * 
   * @param simulationKey Der Schlüssel der Simulation.
   * @returns Ein Observable, das die Histogrammdaten enthält.
   */
  getStoriesHistogram(simulationKey: string): Observable<any> {
    const params = new HttpParams().set('simulationKey', simulationKey);
    return this.http.get(`${this.apiUrl}/MonteCarlo/GetStoriesHistogram`, {params});
  }

  /**
   * Simuliert das Enddatum für eine bestimmte Story basierend auf den Eingabedaten.
   * 
   * @param simulationKey Der Schlüssel der Simulation.
   * @param startDate Das Startdatum für die Simulation.
   * @param storyTarget Das Ziel für die Story.
   * @returns Ein Observable, das das Ergebnis der Simulation enthält.
   */
  simulateStoryEndDate(simulationKey: string,
                       startDate: string,
                       storyTarget: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('simulationKey', simulationKey)
      .set('startDate', startDate)
      .set('storyTarget', storyTarget);

    return this.http.get(`${this.apiUrl}/MonteCarlo/SimulateStoryEndDate`, {params});
  }

  /**
   * Simuliert die Anzahl der Stories für eine gegebene Simulation.
   * 
   * @param simulationKey Der Schlüssel der Simulation.
   * @param startDate Das Startdatum der Simulation.
   * @param endDate Das Enddatum der Simulation.
   * @returns Ein Observable, das das Ergebnis der Simulation enthält.
   */
  simulateStoryCount(
    simulationKey: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('simulationKey', simulationKey)
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get(`${this.apiUrl}/MonteCarlo/SimulateStoryCount`, {params});
  }

  /**
   * Ruft alle Stories-Daten ab.
   * 
   * @returns Ein Observable, das die Stories-Daten enthält.
   */
  getStoriesData(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/Throughput/Stories_AllSprints`);
  }

  /**
   * Ruft alle Features-Daten ab.
   * 
   * @returns Ein Observable, das die Features-Daten enthält.
   */
  getFeaturesData(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/Throughput/Features_AllMonths`);
  }

  /**
   * Filtert die Stories-Daten nach dem angegebenen Zeitraum der Sprints.
   * 
   * @param start Der Start-Sprint.
   * @param end Der End-Sprint.
   * @returns Ein Observable, das die gefilterten Stories-Daten enthält.
   */
  filterStoriesBySprint(start: number, end: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Throughput/filtering_Stories_Sprint`, {
      params: { start: start.toString(), end: end.toString() },
    });
  }

  /**
   * Filtert die Features-Daten nach dem angegebenen Zeitraum in Monaten.
   * 
   * @param start Der Start-Monat.
   * @param end Der End-Monat.
   * @returns Ein Observable, das die gefilterten Features-Daten enthält.
   */
  filterFeaturesByMonth(start: number, end: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Throughput/filtering_Features_Month`, {
      params: { start: start.toString(), end: end.toString() },
    });
  }


}
