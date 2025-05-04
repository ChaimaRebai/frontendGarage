import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceuilComponent } from './pageAcceuil/acceuil/acceuil.component';
import { DashboardClientComponent } from './dashboards/client/dashboard-client/dashboard-client.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {path:'', redirectTo: 'acceuil', pathMatch:'full'},

  {path:'acceuil', component: AcceuilComponent},
  {path:'dashboard-client', component:DashboardClientComponent},
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

  {path:'**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
