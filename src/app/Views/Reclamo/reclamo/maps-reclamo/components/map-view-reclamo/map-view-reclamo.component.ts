import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MapReclamoService, PlacesReclamoService } from '../../services';
import { Popup, Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-view-reclamo',
  templateUrl: './map-view-reclamo.component.html',
  styleUrls: ['./map-view-reclamo.component.css']
})
export class MapViewReclamoComponent implements AfterViewInit {

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef

  constructor( private placesReclamoServices: PlacesReclamoService,
    private mapaReclamoService:MapReclamoService) { }

  /* ngOnInit(): void {
    console.log('ubicacion ',this.placesReclamoServices.userLocation)
  } */
  ngAfterViewInit(): void {
    

    if (!this.placesReclamoServices.userLocation) throw Error('No se puede encontrar su uicacion')
    console.log('posicion del mapbox: ' + this.placesReclamoServices.userLocation)

    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesReclamoServices.userLocation, // starting position [lng, lat]
      zoom: 16, // starting zoom
    });

    /* Popup */
    const popup = new Popup()
      .setHTML(`
        <div style="text-align: center;">
          <h6 style>Aquí estoy</h6>
          
        </div>
        `);

    /* Market - Marcador */
    new Marker({ color: 'red' })
      .setLngLat(this.placesReclamoServices.userLocation)
      .setPopup(popup)
      .addTo(map);

    /* se inicializa el mapa, se establece en el servicio y tenemos acceso global al mapa */
    
    this.mapaReclamoService.setMap( map );
    /* la posicion de mi casa real  [-62.849444,-33.157478] */





  }

}
