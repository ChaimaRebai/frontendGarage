import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceuilComponent } from './pageAcceuil/acceuil/acceuil.component';
import { DashboardClientComponent } from './dashboards/client/dashboard-client/dashboard-client.component';

const routes: Routes = [
  {path:'acceuil', component: AcceuilComponent},
  {path:'dashboard-client', component:DashboardClientComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
