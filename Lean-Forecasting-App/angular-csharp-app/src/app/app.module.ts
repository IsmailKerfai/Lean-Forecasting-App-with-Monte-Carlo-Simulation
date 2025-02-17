import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';



/**
 * In diesem Modul wird die zentrale Konfiguration für das Angular-Projekt bereitgestellt.
 *
 * Das `AppModule` ist das erste Modul, das beim Starten der Anwendung geladen wird.
 * Es definiert alle Komponenten, die in der Anwendung verwendet werden, und welche externen Module erforderlich sind.
 */
@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [],
})
export class AppModule {}
