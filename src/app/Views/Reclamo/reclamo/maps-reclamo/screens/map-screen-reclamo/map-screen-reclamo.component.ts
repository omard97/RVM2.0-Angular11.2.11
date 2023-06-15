import { Component, OnInit } from '@angular/core';
import { MapReclamoService, PlacesReclamoService } from '../../services';

@Component({
  selector: 'app-map-screen-reclamo',
  templateUrl: './map-screen-reclamo.component.html',
  styleUrls: ['./map-screen-reclamo.component.css']
})
export class MapScreenReclamoComponent {

  private debounceTimer?: NodeJS.Timeout;
  
  constructor(private placesReclamoServices: PlacesReclamoService,
    private mapaReclamoService: MapReclamoService
    ) { }

    /* se utiliza para visualizar */
  get isUserLocationReady() {
    return this.placesReclamoServices.isUserLocationReady;
  }

  /* miUbicacion() {
    if (!this.placesReclamoServices.isUserLocationReady) throw Error('No hay ubicacion del usuario');
    if (!this.mapaReclamoService.isMapReady) throw Error('No hay mapa disponible para el usuario')

    this.mapaReclamoService.flyTo(this.placesReclamoServices.userLocation!);
  } */


/* Barra */
/*   onQueryChanged(query: string = '') {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {

      this.placesReclamoServices.getPlacesByQuery( query );
      
      console.log('Enviar este query: ', query)

    }, 1000)
  } */


}
