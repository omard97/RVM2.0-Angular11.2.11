import { formatDate } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { tickStep } from 'd3';
import mapboxgl from 'mapbox-gl';
import { Map, Popup, Marker } from 'mapbox-gl';
import { ToastrService } from 'ngx-toastr';
import { coordenadas } from 'src/app/model/Mapa/coordenadas';
import { tipoEstadoHistorial } from 'src/app/model/filtrosHistorial/estadoReclamo';
import { MenuApiService } from 'src/app/service/Menu/menu-api.service';
import { BackenApiService } from 'src/app/service/backen-api.service';
import { LugaresService, MapaService } from 'src/app/service/maps';
import { MarcadoresService } from 'src/app/service/maps/marcadores.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit, OnInit {

  tipoReclamoMapaCtrl = new FormControl('', [Validators.required]);
  estadoReclamoMapaCtrl = new FormControl('', [Validators.required]);
  fechaDesdeMapaCtrl = new FormControl('', [Validators.required]);



  @ViewChild('mapDiv')
  mapDivElement!: ElementRef

  @ViewChild('info')
  coorDivElement!: ElementRef

  rutaURL: any;
  idUsuario: number = 0;
  coordenadas: coordenadas[] = [];
  banderaFiltros: boolean = false; //utilizado para borrar el mapa y recrearlo cuando usamos los filtros
  private mapaMapbox: Map | null = null;;// declara una variable para almacenar la referencia al mapa
  fechaHoy: any; /* Utilizado para establecer el dia y el rango maximo del input date */

  /* objeto usuario - utilizado para obtener el rol */
  usuario = {
    idUsuario: 0,
    nick: '',
    idRol: 0,
    rol: '',
    IDsesion: 0,
  }

  /* Reutilización del componente historial - Tipo de Estado */
  listaEstados: tipoEstadoHistorial[] = []; /* lista de tipos de estados para el primer filtro */
  selectIDTipReclamo = 0; /* Variable para capturar el valor del tipo de reclamo */
  nombreTipoEstado: string = '';

  /* Estado del tipo de estado ya seleccionado */
  selectIDEstadoReclamo = 0; /* Variable para capturar el id del estado del tipo de reclamo */
  estadosReclamoFiltro: any;
  nombreEstado: string = '';

  fecha: string = '';




  constructor(private lugaresService: LugaresService, private mapaService: MapaService, private ubicacionesReclamo: MarcadoresService, private serviceUsuario: MenuApiService, public detalleReclamo: BackenApiService, private titulo: Title, private toastr: ToastrService) {

    titulo.setTitle('Mi Mapa')
    this.rutaURL = window.location.pathname.split('/');
    this.idUsuario = this.rutaURL[2];
    this.fechaHoy = formatDate(new Date(), 'yyyy-MM-dd', 'en-US'); /* fecha del dia */

    this.getRolUsuario();
    this.getEstados();



  }

  ngOnInit(): void {


  }

  ngAfterViewInit(): void {

    //Valido si lugaresService obtiene mi ubicación
    if (!this.lugaresService.userLocation) throw Error('No se puede encontrar su ubicación');
    console.log('posicion del mapbox: ' + this.lugaresService.userLocation);


  }

  private agregarMarcadoresAlMapa(): void {

    //Valido si lugaresService obtiene mi ubicación
    if (!this.lugaresService.userLocation) throw Error('No se puede encontrar su ubicación');

    // si se encuenta la ubicaicon procedo a crear el mapa, luego los marcadores con las coordenadas que obtuve
    //anteriormente
    const map = new Map({

      container: this.mapDivElement.nativeElement, //ID del mapa
      style: 'mapbox://styles/mapbox/streets-v12', // Estilo del mapa
      center: this.lugaresService.userLocation, // centro la vista en mis coordenadas [lng, lat]
      zoom: 14,
    }); // Obtén la instancia existente del mapa

    this.mapaMapbox = map; // guarda la referencia al mapa

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
    new Marker({ color: '#3072F5' })
      .setLngLat(this.lugaresService.userLocation)
      .setPopup(popup)
      .addTo(map);



    var index = 0;
    this.coordenadas.forEach(coordenada => {

      //const popupContent = `<h6>${coordenada.latitud}</h6><p>${coordenada.longitud}</p>`;
      //creación de la tarjeta del marcador
      const popupContent = new Popup({
        closeButton: false, // Si quieres mostrar o no el botón de cerrar en el popup
        closeOnClick: true // Si quieres cerrar el popup al hacer clic en el mapa
      }).setHTML(`
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
                     <p style="margin: 0"><i class="bi bi-123"></i><span class="span-text"> Altura:
                    </span>${coordenada.altura} </p>
                <!-- <p style="margin: 0"><i class="fas fa-sort-numeric-up-alt"></i> <span class="span-text"> Altura: </span>${coordenada.altura}</p> -->
            </div> <!-- .tarjeta--informacion -->
            
           `);
      debugger
      if (this.coordenadas[index].nombre == 'Pendiente') {
        new Marker({ color: 'rgb(219, 106, 0)' })
          .setLngLat([coordenada.longitud, coordenada.latitud])
          .setPopup(popupContent)
          .addTo(map);
      } else if (this.coordenadas[index].nombre == 'En Revisión') {
        debugger
        new Marker({ color: 'rgb(164, 198, 13)' })
          .setLngLat([coordenada.longitud, coordenada.latitud])
          .setPopup(popupContent)
          .addTo(map);
      } else if (this.coordenadas[index].nombre == 'Solucionado') {
        new Marker({ color: '#09AA74' })
          .setLngLat([coordenada.longitud, coordenada.latitud])
          .setPopup(popupContent)
          .addTo(map);
      } else {
        //Descartado
        new Marker({ color: '#EB252A' })
          .setLngLat([coordenada.longitud, coordenada.latitud])
          .setPopup(popupContent)
          .addTo(map);
      }

      index++;

      // Create a popup, but don't add it to the map yet.

    });

  }
  //borro el mapa para luego crear uno nuevo con los nuevos marcadores
  private borrarMapa(): void {
    if (this.mapaMapbox) {
      this.mapaMapbox.remove(); // borra el mapa
      this.mapaMapbox = null; // limpia la referencia al mapa
    }
  }


  //Obtengo el rol del usuario logueado y luego cargo los marcadores en el mapa de ese usuario
  getRolUsuario() {
    debugger
    this.serviceUsuario.getRolUsuario(this.idUsuario).subscribe(
      (data) => {
        debugger
        console.log(data)

        this.usuario.idUsuario = data[0].idUsuario,
          this.usuario.nick = data[0].nick,
          this.usuario.idRol = data[0].idRol,
          this.usuario.rol = data[0].rol
        debugger
        //busco todos los recamos del usuario para luego mostrarlo en el mapa
        this.ubicacionesReclamo.obtenerLugares(this.idUsuario, this.usuario.idRol).subscribe(
          (data) => {
            //si no hay reclamos entonces no cargo el mapa
            debugger
            if (data.length == 0) {
              this.toastr.info(
                'No posee reclamos registrados', 'Atención',
                {
                  timeOut: 2000,
                  positionClass: 'toast-top-right',
                }
              );
              //por precaución borro el mapa
              this.borrarMapa();
              //al no tener registros entonces se crea un mapa por defecto en el cual solo se muestra su ubicación
              this.mapaSinRegistro();
            } else {
              //En este caso si tiene reclamos registrados, entonces se carga el mapa con los reclamos
              console.log(data)
              this.coordenadas = data;
              this.agregarMarcadoresAlMapa();
            }
          }
        )
      },
      (error) => {
        this.toastr.error(
          'Actualmente, el servidor no está en funcionamiento. Se recomienda esperar y volver a intentar más tarde. ','Atención',
          {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          }
        );
      }
    )

  }

  mapaSinRegistro() {
    //Valido si lugaresService obtiene mi ubicación
    if (!this.lugaresService.userLocation) throw Error('No se puede encontrar su ubicación');

    // si se encuenta la ubicaicon procedo a crear el mapa, luego los marcadores con las coordenadas que obtuve
    //anteriormente
    const map = new Map({

      container: this.mapDivElement.nativeElement, //ID del mapa
      style: 'mapbox://styles/mapbox/streets-v12', // Estilo del mapa
      center: this.lugaresService.userLocation, // centro la vista en mis coordenadas [lng, lat]
      zoom: 14,
    }); // Obtén la instancia existente del mapa

    this.mapaMapbox = map; // guarda la referencia al mapa

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
    new Marker({ color: '#3072F5' })
      .setLngLat(this.lugaresService.userLocation)
      .setPopup(popup)
      .addTo(map);

  }

  /*---------- Select Tipo de Estado /*---------- */
  getEstados() {
    //lista de estados utilizados en el primer select, anteriormente era tipos de reclamos pero para que tenga relacion segun los estados es mejor
    //usar la lista de estados - ambienta y vial -
    this.detalleReclamo.getEstadosHistorial().subscribe(
      (data) => {
        this.listaEstados = data;
        console.log(this.listaEstados)
      }
    )
  }
  obtenerIDTipoReclamo(ev: any) {

    this.selectIDTipReclamo = ev.target.value;
    this.nombreTipoEstado = ev.target[this.selectIDTipReclamo].innerText;
    console.log(this.selectIDTipReclamo);
    this.getEstadoReclamo(this.selectIDTipReclamo);
  }

  /*---------- Select Estado ---------- */

  getEstadoReclamo(idTipoReclamo: number) {
    //busco los estados del tipo de estado seleccionado
    this.detalleReclamo.getFiltroEstadoHistorial(idTipoReclamo).subscribe(
      (res) => {
        this.estadosReclamoFiltro = res;


        console.log('Estados Reclamos', this.estadosReclamoFiltro);
      },
      (err) => console.error(err)
    );
  }

  obtenerIDEstadoReclamo(ev: any) {

    this.selectIDEstadoReclamo = ev.target.value;
    this.nombreEstado = ev.target[this.selectIDEstadoReclamo].innerText;
    console.log('IDEstadoReclamo: ', this.selectIDEstadoReclamo);
  }

  /* ---------- Calendario ---------- */

  obtenerFechaSelect(ev: any) {

    this.fecha = ev.target.value;

  }


  /* Buscar los marcadores con respecto a cada reclamo del usuario */
  buscarMarcadores() {


    //1 -  solamente ingresa el TIPO DE ESTADO y su ESTADO
    if ((this.nombreTipoEstado != '' && this.selectIDEstadoReclamo != 0) && this.fecha == '') {
      debugger
      this.ubicacionesReclamo.getMarcadoresporEstados(this.idUsuario, this.usuario.idRol, this.selectIDTipReclamo, this.selectIDEstadoReclamo, '-').subscribe(
        (data) => {
          debugger
          if (data.length == 0) {
            this.mensajeSinRegistro();
          } else {
            this.coordenadas = [];
            this.coordenadas = data;
            this.borrarMapa();
            this.agregarMarcadoresAlMapa();
          }
        },
        (err) => {
          debugger
          this.notificacionErrorRegistros();
        }
      )

    } else if (this.nombreTipoEstado != '' && this.selectIDEstadoReclamo != 0 && this.fecha != '') {
      //Usuario busqueda por tipo estado, estado y fecha
      this.ubicacionesReclamo.getMarcadoresporEstados(this.idUsuario, this.usuario.idRol, this.selectIDTipReclamo, this.selectIDEstadoReclamo, this.fecha).subscribe(
        (data) => {
          if (data.length == 0) {
            this.mensajeSinRegistro();
          } else {
            this.coordenadas = [];
            this.coordenadas = data;
            this.borrarMapa();
            this.agregarMarcadoresAlMapa();
          }
        },
        (err) => {
          this.notificacionErrorRegistros();
        }
      )

    } else if (this.nombreTipoEstado == '' && this.selectIDEstadoReclamo == 0 && this.fecha != '') {
      //busco solamente por fecha
      this.ubicacionesReclamo.getMarcadoresporEstados(this.idUsuario, this.usuario.idRol, 0, 0, this.fecha).subscribe(
        (data) => {

          if (data.length == 0) {
            this.mensajeSinRegistro();
          } else {
            this.coordenadas = [];
            this.coordenadas = data;
            this.borrarMapa();
            this.agregarMarcadoresAlMapa();
          }
        },
        (err) => {
          this.notificacionErrorRegistros();
        }
      )
    } else {
      this.toastr.error(
        'La información requerida para el filtro no ha sido proporcionada. Por favor, complete los campos correspondientes. ', '',
        {
          timeOut: 4000,
          positionClass: 'toast-top-right',
        }
      );
    }
  }

  mensajeSinRegistro() {
    this.toastr.info(
      'No se encontraron registros para los marcadores por estados.', '',
      {
        timeOut: 4000,
        positionClass: 'toast-top-right',
      }
    );
  }
  notificacionErrorRegistros() {
    this.toastr.error(
      'La petición para obtener marcadores ha generado un error. Revise la conexión y vuelva a intentarlo.', '',
      {
        timeOut: 4000,
        positionClass: 'toast-top-right',
      }
    );
  }



}
