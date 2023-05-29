import { Injectable } from '@angular/core';
import { Map, LngLatLike } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  private map: Map | undefined;
  get mapaEstaListo() {
    return !!this.map;
  }

  constructor() { }


  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.mapaEstaListo) throw Error("El mapa no esta inicializado");

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  }


}
