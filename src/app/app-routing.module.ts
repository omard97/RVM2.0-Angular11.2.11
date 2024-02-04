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
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { EstadisticasComponent } from './Views/estadisticas/estadisticas.component';




const routes: Routes = [

  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'nosotros', component: NosotrosComponent },
  {
    path: 'menu/:id', component: MenuComponent, canActivate: [AuthGuard], /* guard para que no ingrese si no tiene permiso */
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reclamo', canDeactivate: [ExitGuard], component: ReclamoComponent }, /* guard para evitar que salga del reclamo teniendo el formulario para editar */
      { path: 'historial', component: HistorialComponent },
      { path: 'historial/:id', component: ReclamoComponent, canDeactivate: [CanDeactivateGuard] }, /* editar reclamo desde el comp. reclamo */
      { path: 'mapa', component: MapasComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'estadisticas', component: EstadisticasComponent},
    ]
  },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
