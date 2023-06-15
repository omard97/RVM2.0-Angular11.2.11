import { Injectable } from '@angular/core';
import { LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})
export class MapReclamoService {

  private map?: Map;

  /* video 14 */
  public marca: Marker[] = [];

  get isMapReady() {
    return !!this.map;
  }

  constructor() { }

  setMap(map: Map) {

    this.map = map;
  }

  /* Metodo que para apretar el boton el mapa regresa a la posicion inicial */
  flyTo(coords: LngLatLike) {

    if (!this.isMapReady) throw Error('El mapa no esta inicializado');

    this.map?.flyTo({
      zoom: 16,
      center: coords
    });

  }

  /* crear markadores para lugares */
  createMarkersFromPlaces(places: Feature[]) {

    if (!this.map) throw Error('Mapa no inicializado');

    /* borrar los marcadores del mapa pero no del arreglo */
    this.marca.forEach(marker => marker.remove());

    /* lista nuevos marcadores */
    const newMarkers: any[] = [];

    for (const lugar of places) {
      const [lng, lat] = lugar.center;

      const popup = new Popup()
        .setHTML(`
        <h6>${lugar.text}</h6>
        <span>${lugar.place_name}</h6>`);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);

      newMarkers.push(newMarker)

    };

    this.marca = newMarkers
  }


  


}
