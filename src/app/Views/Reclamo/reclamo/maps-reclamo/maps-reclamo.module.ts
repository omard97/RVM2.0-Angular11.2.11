import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapScreenReclamoComponent } from './screens/map-screen-reclamo/map-screen-reclamo.component';
import { MapViewReclamoComponent } from './components/map-view-reclamo/map-view-reclamo.component';
import { LoadingReclamoComponent } from './components/loading-reclamo/loading-reclamo.component';
import { BtnUbicacionReclamoComponent } from './components/btn-ubicacion-reclamo/btn-ubicacion-reclamo.component';
import { ResultadosLugaresReclamoComponent } from './components/resultados-lugares-reclamo/resultados-lugares-reclamo.component';
import { BusquedaLugaresReclamoComponent } from './components/busqueda-lugares-reclamo/busqueda-lugares-reclamo.component';




@NgModule({
  declarations: [


    MapScreenReclamoComponent,
    MapViewReclamoComponent,
    LoadingReclamoComponent,
    BtnUbicacionReclamoComponent,
    ResultadosLugaresReclamoComponent,
    BusquedaLugaresReclamoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MapScreenReclamoComponent,
    LoadingReclamoComponent,
    MapViewReclamoComponent,
    BusquedaLugaresReclamoComponent,
    ResultadosLugaresReclamoComponent
  ]
})
export class MapsReclamoModule { }
