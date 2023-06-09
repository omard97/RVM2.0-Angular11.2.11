import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapView2Component } from './components/map-view2/map-view2.component';
import { Loading2Component } from './components/loading2/loading2.component';
import { LoadingReclamoComponent } from './components/loading-reclamo/loading-reclamo.component';
import { MapviewReclamoComponent } from './components/mapview-reclamo/mapview-reclamo.component';
import { MapScreenReclamoComponent } from './screens/map-screen-reclamo/map-screen-reclamo.component';




@NgModule({
  declarations: [
    MapView2Component,
    Loading2Component,
    LoadingReclamoComponent,
    MapviewReclamoComponent,
    MapScreenReclamoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MapsReclamoModule { }
