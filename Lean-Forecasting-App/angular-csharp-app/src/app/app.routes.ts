import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ThroughputComponent } from './throughput/throughput.component';
import {CycleComponent} from './cycle/cycle.component';
import {MontecarloComponent} from './montecarlo/montecarlo.component';
import {ForecastReleaseComponent} from './montecarlo/montecarlo-release/montecarlo-release.component';
import {forecastStoriesComponent} from './montecarlo/montecarlo-sprint/montecarlo-sprint.component';
import { CycleFeatureComponent } from './cycle/cycle-feature/cycle-feature.component';

/**
 * Diese `routes` definieren, wie Angular die Navigation und das Routing innerhalb der Anwendung handhabt.
 * Jede Route besteht aus einem Pfad und der zugehörigen Komponente, die beim Aufrufen dieses Pfads gerendert wird.
 */

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirect root to /dashboard
  { path: 'dashboard', component: DashboardComponent },    // Dashboard route
  { path: 'throughput', component: ThroughputComponent }, // Throughput route
  { path: 'cycle', component: CycleComponent },
  { path: 'prognosis' , component: MontecarloComponent},
  { path: 'prognosis/forecast-Release' , component: ForecastReleaseComponent},
  { path: 'prognosis/forecast-Sprint' , component: forecastStoriesComponent},
  { path: 'cycle-feature', component: CycleFeatureComponent }
];

