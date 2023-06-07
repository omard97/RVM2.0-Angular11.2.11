import { Injectable } from '@angular/core';
import { Map, LngLatLike, Marker, Popup } from 'mapbox-gl';
import { Feature } from 'src/app/Views/Mapas/maps/interfaces/lugares';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  private map: Map | undefined;

  /* video 14 */
  public marca:Marker[] =[];
 



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

  /* crear markadores para lugares */
  createMarkersFromPlaces(places: Feature[]) {

    if (!this.map) throw Error('Mapa no inicializado');

    /* borrar los marcadores del mapa pero no del arreglo */
    this.marca.forEach(marker => marker.remove());

    /* lista nuevos marcadores */
    const newMarkers: any[]=[];


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
