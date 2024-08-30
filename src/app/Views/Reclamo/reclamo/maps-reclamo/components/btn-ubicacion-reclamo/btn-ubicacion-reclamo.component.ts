import { Component, HostListener, OnInit } from '@angular/core';
import { MapReclamoService, PlacesReclamoService } from '../../services';

@Component({
  selector: 'app-btn-ubicacion-reclamo',
  templateUrl: './btn-ubicacion-reclamo.component.html',
  styleUrls: ['./btn-ubicacion-reclamo.component.css']
})
export class BtnUbicacionReclamoComponent {
  isSmallScreen!: boolean;
  constructor(private placesReclamoServices: PlacesReclamoService,private mapaReclamoService: MapReclamoService) { 
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 576;
  }
miUbicacion() {
    if (!this.placesReclamoServices.isUserLocationReady) throw Error('No hay ubicacion del usuario');
    if (!this.mapaReclamoService.isMapReady) throw Error('No hay mapa disponible para el usuario')

    this.mapaReclamoService.flyTo(this.placesReclamoServices.userLocation!);
  }
}
