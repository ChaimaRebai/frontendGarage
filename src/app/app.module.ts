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
import { CalendarModule, DateAdapter  } from 'angular-calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NotFoundComponent } from './not-found/not-found.component';
import { EditAppointmentDialogComponent } from './dashboards/client/edit-appointment-dialog/edit-appointment-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';






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
    NotFoundComponent,
    EditAppointmentDialogComponent,
  ],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({provide: DateAdapter,
      useFactory: adapterFactory,}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
