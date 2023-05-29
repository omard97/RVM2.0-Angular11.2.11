import { Component, OnInit } from '@angular/core';
import { LugaresService, MapaService } from 'src/app/service/maps';

@Component({
  selector: 'app-btn-ubicacion',
  templateUrl: './btn-ubicacion.component.html',
  styleUrls: ['./btn-ubicacion.component.css']
})
export class BtnUbicacionComponent implements OnInit {

  constructor(
    private mapService: MapaService,
    private lugaresService: LugaresService,

  ) { }

  ngOnInit(): void {
  }
  miUbicacion() {

    if (!this.lugaresService.isUserLocationReady) throw Error('No hay ubicacion de usuario')
    if (!this.mapService.mapaEstaListo) throw Error('No hay mapa disponible')
    this.mapService.flyTo(this.lugaresService.userLocation!)

  }
}
