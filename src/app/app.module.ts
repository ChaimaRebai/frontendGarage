import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceuilComponent } from './pageAcceuil/acceuil/acceuil.component';
import { DashboardAdminComponent } from './dashboards/admin/dashboard-admin/dashboard-admin.component';
import { DashboardProfessionalComponent } from './dashboards/professional/dashboard-professional/dashboard-professional.component';
import { DashboardClientComponent } from './dashboards/client/dashboard-client/dashboard-client.component';
import { MainComponent } from './pageAcceuil/main/main.component';
import { AboutComponent } from './pageAcceuil/about/about.component';
import { ServicesComponent } from './pageAcceuil/services/services.component';
import { FooterComponent } from './pageAcceuil/footer/footer.component';
import { NavbarComponent } from './dashboards/client/navbar/navbar.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AcceuilComponent,
    DashboardClientComponent,
    DashboardAdminComponent,
    DashboardProfessionalComponent,
    MainComponent,
    AboutComponent,
    ServicesComponent,
    FooterComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
