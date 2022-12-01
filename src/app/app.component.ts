import { Component } from '@angular/core';
import { SAMPLE } from 'src/models/sample';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'd3js';

  S = SAMPLE;
}
