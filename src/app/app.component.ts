import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { registerIcons } from '../shared/icons-library';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
  ],
})
export class AppComponent {
    constructor(private library: FaIconLibrary) {
      registerIcons(this.library);
    }
}
