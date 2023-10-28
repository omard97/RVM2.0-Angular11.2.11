import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { Map, Popup, Marker } from 'mapbox-gl';
import { coordenadas } from 'src/app/model/Mapa/coordenadas';
import { LugaresService, MapaService } from 'src/app/service/maps';
import { MarcadoresService } from 'src/app/service/maps/marcadores.service';

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

  rutaURL: any;
  idUsuario: number = 0;
  coordenadas: coordenadas[] = [];
  constructor(private lugaresService: LugaresService, private mapaService: MapaService, private ubicacionesReclamo: MarcadoresService) {

    this.rutaURL = window.location.pathname.split('/');
    this.idUsuario = this.rutaURL[2];

    //despues

    /* this.ubicacionesReclamo.obtenerLugares(this.idUsuario).subscribe(
      (data) => {
        debugger

        console.log(data)
        this.coordenadas = data;
        const map = new Map({
          container: this.mapDivElement.nativeElement, // container ID
          style: 'mapbox://styles/mapbox/streets-v12', // style URL
          center: this.lugaresService.userLocation, // starting position [lng, lat]
          zoom: 10, // starting zoom
        });
        

        this.coordenadas.forEach(coordenada => {
          // Puedes personalizar el contenido del popup según tus necesidades
          const popupContent = `<h6>${coordenada.latitud}</h6><p>${coordenada.longitud}</p>`;
      
          // Crea un nuevo marcador para cada coordenada
           new Marker({ color: 'green' })
            .setLngLat([coordenada.longitud, coordenada.latitud])
            .setPopup(new Popup().setHTML(popupContent))
            .addTo(map);
        });

      }
    ) */

  }

  ngOnInit(): void {
    console.log('asfasfa');
    //busco todos los recamos del usuario para luego mostrarlo en el mapa
    this.ubicacionesReclamo.obtenerLugares(this.idUsuario).subscribe(
      (data) => {
        debugger
        console.log(data)
        this.coordenadas = data;
        this.agregarMarcadoresAlMapa();
      }
    )
  }

  ngAfterViewInit(): void {

    if (!this.lugaresService.userLocation) throw Error('No se puede encontrar su ubicación');
    console.log('posicion del mapbox: ' + this.lugaresService.userLocation);

    /*  const map = new Map({
       container: this.mapDivElement.nativeElement,
       style: 'mapbox://styles/mapbox/streets-v12',
       center: this.lugaresService.userLocation,
       zoom: 15, 
     }); */

    /* Popup */
    /* const popup = new Popup()
      .setHTML(`
      <div style="  width: 50px; 
      height: 50px; 
      background-color: red!important; 
      border-radius: 50%;
      border: 2px solid #fff; 
      cursor: pointer;">
        <h6 style>Aquí estoy</h6>
      </div>
    `); */



    /* Market - Marcador */
    /*  new Marker({ color: 'red' })
       .setLngLat(this.lugaresService.userLocation)
       .setPopup(popup)
       .addTo(map); */


    /* se inicializa el mapa, se establece en el servicio y tenemos acceso global al mapa */
    /*   this.mapaService.setMap(map); */
    /* la posición de mi casa real  [-62.849444,-33.157478] */


  }

  private agregarMarcadoresAlMapa(): void {
    if (!this.lugaresService.userLocation) throw Error('No se puede encontrar su ubicación');

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.lugaresService.userLocation,
      zoom: 15,
    }); // Obtén la instancia existente del mapa

    /* Popup */
    //creo el marcador
    const popup = new Popup()
      .setHTML(`
        <div style="text-align: center;">
          <h6 style>Aquí estoy</h6>
          <span>${this.lugaresService.userLocation}</span>
        </div>
        `);
    //a este nuevo marcador lo incorporo al mapa
    new Marker({ color: 'red' })
      .setLngLat(this.lugaresService.userLocation)
      .setPopup(popup)
      .addTo(map);


    this.coordenadas.forEach(coordenada => {

      //const popupContent = `<h6>${coordenada.latitud}</h6><p>${coordenada.longitud}</p>`;
      //creación de la tarjeta del marcador
      const popupContent = new Popup().setHTML(`
                  <style>
                     @font-face {
                    font-family: OpenSans-Regular;
                    src: url(./assets/fonts/OpenSans-Regular.ttf)
                    }
                  </style>

            <div onLoad="inicio()" class="" style="height: 150px; width: 100%;">
                <img id="foto"  loading="lazy" class="card-img-top rounded  "
                    style="height: 150px; width: 100%;" alt="Foto Reclamo" src="${coordenada.foto}">
                

            </div>

            <div class="card-body ">

                <p style="margin: 20px 0px 0px 0px;"><i class="far fa-user"></i><span class="span-text"> Usuario:
                    </span>${coordenada.nick}</p>
                <p style="margin: 0"><i class="far fa-bookmark"></i><span class="span-text"> Nrº Reclamo:
                    </span>${coordenada.iD_Reclamo}</p>
                <p style="margin: 0"><i class="far fa-bookmark"> </i><span class="span-text"> Estado:</span> <span class="span-text"
                        [ngClass]="{
                                    'text-Pendiente':  ${coordenada.nombre} === 'Pendiente',
                                    'text-EnRevision':  ${coordenada.nombre} ==='En Revisión',
                                    'text-Solucionado':  ${coordenada.nombre} === 'Solucionado',
                                    'text-Descartado':  ${coordenada.nombre} === 'Descartado'}"> ${coordenada.nombre}</span></p>
                <p style="margin: 0"><i class="far fa-bookmark"></i><span class="span-text"> Reclamo:
                    </span>${coordenada.nombreRecAmbiental}</p>
                <p style="margin: 0"><i class="far fa-bookmark"></i><span class="span-text"> Tipo: </span>${coordenada.nombreTRec}
                </p>
                <p style="margin: 0"><i class="far fa-comment-dots"></i><span class="span-text"> Descripción:
                    </span>${coordenada.descripcion}
                </p>
                <p style="margin: 0"><i class="far fa-calendar-alt"></i><span class="span-text"> Fecha: </span>${coordenada.fecha}
                </p>
                <p style="margin: 0"><i class="far fa-clock"></i><span class="span-text"> Hora: </span>${coordenada.hora}</p>
                <p style="margin: 0" *ngIf="(${coordenada.dominio}!='-' || ${coordenada.dominio}=='')" class="card-text"><i
                        class="fas fa-car"></i> <span class="span-text"> Dominio: </span>${coordenada.dominio}</p>
                <p style="margin: 0"><i class="fas fa-map-signs"></i><span class="span-text"> Dirección:
                    </span>${coordenada.direccion} </p>
                <!-- <p style="margin: 0"><i class="fas fa-sort-numeric-up-alt"></i> <span class="span-text"> Altura: </span>${coordenada.altura}</p> -->
            </div> <!-- .tarjeta--informacion -->
            
           `);
      //incorporo el marcador en el mapa, seria una lista de marcadores en el mapa
      new Marker({ color: 'rgb(13, 123, 227)' })
        .setLngLat([coordenada.longitud, coordenada.latitud])
        .setPopup(popupContent)
        .addTo(map);
    });

  }


}
