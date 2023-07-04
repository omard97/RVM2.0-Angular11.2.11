import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapasComponent } from './Views/Mapas/mapas/mapas.component';
import { HistorialComponent } from './Views/Reclamo/historial/historial.component';
import { ReclamoComponent } from './Views/Reclamo/reclamo/reclamo.component';
import { LoginComponent } from './Views/Sesion/login/login.component';
import { DashboardComponent } from './Views/Dashboard/dashboard/dashboard.component';
import { PerfilComponent } from './Views/Usuario/perfil/perfil.component';
import { MenuComponent } from './Views/Estructura/menu/menu.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { HomeComponent } from './Views/home/home.component';
import { NgxChartsModule} from '@swimlane/ngx-charts';
import { CamaraService } from './service/camara/camara.service';
import { ToastrModule } from 'ngx-toastr';
import { ConfiguracionComponent } from './Views/Configuracion/configuracion/configuracion.component';
import { MapsModule } from './Views/Mapas/maps/maps.module';
import { MapsReclamoModule } from './Views/Reclamo/reclamo/maps-reclamo/maps-reclamo.module';
import { CamaraComponent } from './Views/Component/camara/camara.component';





@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MenuComponent,
    PerfilComponent,
    DashboardComponent,
    ReclamoComponent,
    HistorialComponent,
    MapasComponent,
    ConfiguracionComponent,
    CamaraComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule, /* agregado */
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    NgxChartsModule,
    MapsModule,
    MapsReclamoModule
  ],
  providers: [CamaraService],
  bootstrap: [AppComponent]
})
export class AppModule { }
