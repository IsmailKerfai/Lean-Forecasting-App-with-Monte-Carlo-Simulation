import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withFetch  } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Die ApplicationConfig-Konfiguration ist eine zentrale Stelle, um globale Provider,
 * Routen und HTTP-Konfigurationen zu definieren.
 * 
 * Diese Konfiguration stellt sicher, dass die Anwendung korrekt funktioniert, indem wichtige Services und
 * Einstellungen, wie etwa der Router und die HTTP-Clients, bereitgestellt werden.
 */

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withFetch(),withInterceptorsFromDi()),
  ]
};

