import { Component } from '@angular/core';
import { DashboardClientComponent } from './dashboards/client/dashboard-client/dashboard-client.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontendGarage';
}
