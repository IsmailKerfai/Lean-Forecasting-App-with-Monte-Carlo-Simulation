import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


/**
 * Die Klasse AppComponent enthält den `<router-outlet>`-Tag, der dafür sorgt, dass gerenderte
 * Komponenten basierend auf der aktiven Route angezeigt werden.
 */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  template: `<router-outlet></router-outlet>`, // This is where routed components will load
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
