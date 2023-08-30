import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Views/home/home.component';
import { LoginComponent } from './Views/Sesion/login/login.component';

import { MenuComponent } from './Views/Estructura/menu/menu.component';
import { PerfilComponent } from './Views/Usuario/perfil/perfil.component';
import { DashboardComponent } from './Views/Dashboard/dashboard/dashboard.component';
import { ReclamoComponent } from './Views/Reclamo/reclamo/reclamo.component';
import { HistorialComponent } from './Views/Reclamo/historial/historial.component';
import { ConfiguracionComponent } from './Views/Configuracion/configuracion/configuracion.component';
import { MapasComponent } from './Views/Mapas/mapas/mapas.component';
import { NosotrosComponent } from './Views/nosotros/nosotros.component';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './Views/page-not-found/page-not-found.component';
import { ExitGuard } from './guards/exit.guard';




const routes: Routes = [
  {path: 'home', component:HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'nosotros', component: NosotrosComponent },
  /*estando en el meu luego de iniciar sesion  */
  {
    path: 'menu/:id', component: MenuComponent, canActivate: [AuthGuard],
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reclamo', canDeactivate:[ExitGuard], component: ReclamoComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'mapa', component: MapasComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
    ]
  },

  {
    path: 'menu/:id/historial', component: MenuComponent, canActivate: [AuthGuard],
    children: [
      { path: 'reclamo/:id', component: ReclamoComponent },
      /* { path: '**', component: PageNotFoundComponent }, */
    ]
  },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
