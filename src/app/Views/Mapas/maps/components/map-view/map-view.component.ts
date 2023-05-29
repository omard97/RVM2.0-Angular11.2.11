import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { Map, Popup, Marker } from 'mapbox-gl';
import { LugaresService, MapaService } from 'src/app/service/maps';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {


  @ViewChild('mapDiv')
  mapDivElement!: ElementRef

  @ViewChild('info')
  coorDivElement!: ElementRef

  constructor(private lugaresService: LugaresService, private mapaService: MapaService) { }

  ngOnInit(): void {
    console.table(this.lugaresService.userLocation);
  }

  ngAfterViewInit(): void {

    if (!this.lugaresService.userLocation) throw Error('No se puede encontrar su uicacion')
    console.log('posicion del mapbox: ' + this.lugaresService.userLocation)

    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lugaresService.userLocation, // starting position [lng, lat]
      zoom: 15, // starting zoom
    });

    /* Popup */
    const popup = new Popup()
      .setHTML(`
        <div style="text-align: center;">
          <h6 style>Aquí estoy</h6>
          <span>Estoy en este lugar del mundo</span>
        </div>
        `);

    /* Market - Marcador */
    new Marker({ color: 'red' })
      .setLngLat(this.lugaresService.userLocation)
      .setPopup(popup)
      .addTo(map);

    /* se inicializa el mapa, se establece en el servicio y tenemos acceso global al mapa */
    this.mapaService.setMap(map);
    /* la posicion de mi casa real  [-62.849444,-33.157478] */


  }



}
