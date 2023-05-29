import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapScreenComponent } from './screens/map-screen/map-screen.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { LoadingComponent } from './components/loading/loading.component';
import { BtnMenuComponent } from './components/btn-menu/btn-menu.component';
import { BtnUbicacionComponent } from './components/btn-ubicacion/btn-ubicacion.component';
import { LogoComponent } from './components/logo/logo.component';
import { BarraDeBusquedaComponent } from './components/barra-de-busqueda/barra-de-busqueda.component';
import { ResultadosDeBusquedaComponent } from './components/resultados-de-busqueda/resultados-de-busqueda.component';



@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  declarations: [
    MapScreenComponent,
    MapViewComponent,
    LoadingComponent,
    BtnMenuComponent,
    BtnUbicacionComponent,
    LogoComponent,
    BarraDeBusquedaComponent,
    ResultadosDeBusquedaComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    MapScreenComponent
  ]
})
export class MapsModule { }
