import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/*
Die Klasse ApiService beinhaltet Getter für Daten der Graphen in Features und kommuniziert mit der API im Controller.
@Author Cihan Miro Mueller
@version 19.01.2025
*/

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api'; // Die URL deiner C#-API
  
  constructor(private http: HttpClient) {}
  	/*
	Sendet den angegebenen Zeitraum, um neue Graphen anzufordern.
	@param Start:string der Beginn des Zeitraums
	@param End:string das Ende des Zeitraums
	@return Observable<number> Ein Integer, der angibt, ob der Zeitraum gültig ist
	*/
	getSendDate_Features(Start: string, End: string): Observable<number> {
		const url = `${this.apiUrl}/Cycle/SendDate_Features`;
		const params = new HttpParams().set('Start', Start).set('End', End);
		return this.http.get<number>(url, { params });
	}
	/*
	Gibt das Startdatum der Stories zurück.
	@return Observable<string[]> Eine Liste der Startdaten als Strings
	*/
	getstartDate_Features(): Observable<string[]>{
		return this.http.get<string[]>(`${this.apiUrl}/Cycle/getstartDate_Features`);
	}
	/*
	Gibt das Enddatum der Stories zurück.
	@return Observable<string[]> Eine Liste der Enddaten als Strings
	*/
	getendDate_Features(): Observable<string[]>{
		return this.http.get<string[]>(`${this.apiUrl}/Cycle/getendDate_Features`);
	}
  
	//Cycle Day - Features
	/*
	Gibt die x-Koordinaten für Cycle Day in Form von Datumswerten zurück.
	@return Observable<string[]> Eine Liste von Datumswerten als Strings
	*/
	getxAchse_Cycle_Day(): Observable<string[]>{
		return this.http.get<string[]>(`${this.apiUrl}/Cycle/SetxAchse_Cycle_Day_Features`);
	}
	/*
	Gibt die y-Koordinaten für Cycle Day in Form von Zahlen zurück.
	@return Observable<number[]> Eine Liste von Zahlen
	*/
	getyAchse_Cycle_Day(): Observable<number[]>{
		return this.http.get<number[]>(`${this.apiUrl}/Cycle/SetyAchse_Cycle_Day_Features`);
	}
	/*
	Gibt den Wert der 85%-Linie für Cycle Day zurück.
	@return Observable<number> Der Wert der 85%-Linie
	*/
	get_Cycle_Day_85(): Observable<number>{
		return this.http.get<number>(`${this.apiUrl}/Cycle/Cycle_Day_85_Features`);
	}
	/*
	Gibt den Wert der 50%-Linie für Cycle Day zurück.
	@return Observable<number> Der Wert der 50%-Linie
	*/
	get_Cycle_Day_50(): Observable<number>{
		return this.http.get<number>(`${this.apiUrl}/Cycle/Cycle_Day_50_Features`);
	}
	  
	//Lead Day - Features
	
	/*
	Gibt die x-Koordinaten für Lead Day in Form von Datumswerten zurück.
	@return Observable<string[]> Eine Liste von Datumswerten als Strings
	*/
	getxAchse_Lead_Day(): Observable<string[]>{
		return this.http.get<string[]>(`${this.apiUrl}/Cycle/SetxAchse_Lead_Day_Features`);
	}
	/*
	Gibt die y-Koordinaten für Lead Day in Form von Zahlen zurück.
	@return Observable<number[]> Eine Liste von Zahlen
	*/ 
	getyAchse_Lead_Day(): Observable<number[]>{
		return this.http.get<number[]>(`${this.apiUrl}/Cycle/SetyAchse_Lead_Day_Features`);
	}
	/*
	Gibt den Wert der 85%-Linie für Lead Day zurück.
	@return Observable<number> Der Wert der 85%-Linie
	*/
	get_Lead_Day_85(): Observable<number>{
		return this.http.get<number>(`${this.apiUrl}/Cycle/Lead_Day_85_Features`);
	}
	/*
	Gibt den Wert der 50%-Linie für Lead Day zurück.
	@return Observable<number> Der Wert der 50%-Linie
	*/
	get_Lead_Day_50(): Observable<number>{
		return this.http.get<number>(`${this.apiUrl}/Cycle/Lead_Day_50_Features`);
	}
	
	//Cycle Efficiency - Features
	
	/*
	Gibt die x-Koordinaten für Cycle Efficiency in Form von Datumswerten zurück.
	@return Observable<string[]> Eine Liste von Datumswerten als Strings
	*/
	getxAchse_Cycle_Efficiency(): Observable<string[]>{
		return this.http.get<string[]>(`${this.apiUrl}/Cycle/SetxAchse_Cycle_Efficiency_Features`);
	}
	/*
	Gibt die y-Koordinaten für Cycle Efficiency in Form von Zahlen zurück.
	@return Observable<number[]> Eine Liste von Zahlen
	*/
	getyAchse_Cycle_Efficiency(): Observable<number[]>{
		return this.http.get<number[]>(`${this.apiUrl}/Cycle/SetyAchse_Cycle_Efficiency_Features`);
	}
	/*
	Gibt den Wert der 85%-Linie für Cycle Efficiency zurück.
	@return Observable<number> Der Wert der 85%-Linie
	*/
	get_Cycle_Efficiency_85(): Observable<number>{
		return this.http.get<number>(`${this.apiUrl}/Cycle/Cycle_Efficiency_85_Features`);
	}
	/*
	Gibt den Wert der 50%-Linie für Cycle Efficiency zurück.
	@return Observable<number> Der Wert der 50%-Linie
	*/
	get_Cycle_Efficiency_50(): Observable<number>{
		return this.http.get<number>(`${this.apiUrl}/Cycle/Cycle_Efficiency_50_Features`);
	}
}
