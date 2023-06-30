import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DetalleReclamo, vehiculoXDetalle } from 'src/app/model/detalleReclamo';
import { marca } from 'src/app/model/marca';
import { modelo } from 'src/app/model/modelo';
import { Reclamo } from 'src/app/model/reclamo';
import { ReclamoAmbiental } from 'src/app/model/reclamoAmbiental';
import { Vehiculo } from 'src/app/model/vehiculo';
import { TipoReclamo } from 'src/app/model/tipoReclamo';
import { LoginApiService } from 'src/app/service/Login/login-api.service';
import { MenuApiService } from 'src/app/service/Menu/menu-api.service';
import { BackenApiService } from 'src/app/service/backen-api.service';
import { ToastrService } from 'ngx-toastr';
import { LugaresService } from 'src/app/service/maps';
import { MapReclamoService, PlacesReclamoService } from './maps-reclamo/services';
import { Popup, Map, Marker } from 'mapbox-gl';





@Component({
  selector: 'app-reclamo',
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.css']
})
export class ReclamoComponent implements OnInit {

  private debounceTimer?: NodeJS.Timeout;

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef

  tipoReclamoCtrl = new FormControl('', [Validators.required]);
  reclamoAmbientalCtrl = new FormControl('', [Validators.required]);
  marcaAutoCtrl = new FormControl('', [Validators.required]);
  modeloAutoCtrl = new FormControl('', [Validators.required]);
  colorAutoCtrl = new FormControl('', [Validators.required]);
  fechaCtrl = new FormControl('', [Validators.required]);
  horaCtrl = new FormControl('', [Validators.required]);
  ubicacionCtrl = new FormControl('', [Validators.required]);
  descripcionCtrl = new FormControl('', [Validators.required]);
  urlFotoCtrl = new FormControl('', [Validators.required]);
  alturaCtrl = new FormControl('', [Validators.required]);
  dominioCtrl = new FormControl('', [Validators.required]);
  ID_Reclamo = new FormControl('', [Validators.required]);
  estadoReclamoCtrl = new FormControl('', [
    Validators.required,
  ]); /* Se utiliza al actualizar */

  recla: Reclamo = {
    fecha: '',
    foto: '',
    hora: '',
    ID_Sesion: 1,
    ID_TipoReclamo: 1,
    ID_Estado: 1,
  };

  usuario = {
    idUsuario: 0,
    nick: '',
    idRol: 0,
    rol: '',
    IDsesion:0,
  }

  ubicacionReclamo = {
    longitud: 0,
    latitud: 0,
  }

  rutaURL:any;
  

  Tiporecla: TipoReclamo[] = new Array<TipoReclamo>();
  ReclamoAmbie: ReclamoAmbiental[] = [];
  Mar: marca[] = [];
  Mod: modelo[] = [];
  public arregloDetalleReclamo: any; /* se utiliza luego de cambiar de historial a editar reclamo */

  validacionTipoReclamo: any;

  selectIdTipoReclamo: number = 0; //se establece en 0 para que no se muestren los combobox de los reclamos
  selectIdinfoReclamo: number = 0;
  selectIdMarcaVehiculo: number = 0;
  selectIdModeloVehiculo: number = 0;
  nombreTipoReclamo?: string;

  ruta: any;
  IDUsuario: any; /* se utiliza para navegar entre los componentes */
  /* IDRol: any; */
 /*  IDsesion: any; */

  IDDetalleR: any; /* ID DE LA RUTA DEL NAVEGADOR - al querer editar el detalle del reclamo */
  idrecambie: number = 0; /* idreclamoambiental */
  ID_Vehiculo: any; /* se usa para saber el id que tiene el auto recien registrado */
  ID_DetReclamo: any; /* para vehiculoXDetalle */
  time: any;
  banderaEdicionReclamo: boolean =
    false; /* se utiliza para validar controles cuando se navega desde historial hacia reclamo */

  objetoHistorial: any;
  idEstadoReclamo: any;
  objetEstadoReclamo: any;

  /* Mapa - detalle reclamo - editar */
  banderaVerMapa:string= ''; /* bandera utilizada para visualizar el mapa comun y el mapa ya posicionado en las coordenadas del reclamo a editar */
  longitud: string='';
  latitud: string='';
  direccion: string='';

  public datosHistorial: Array<any> = [];

  /* para la foto */
  public archivos: any = [];
  public previsualizacion: string = "";
  public imagenBase64: string = "";

  constructor(private serviceUsuario: MenuApiService, private service: BackenApiService, private serviceLogin:LoginApiService , private router: Router, private toastr:ToastrService,
    private placesReclamoServices: PlacesReclamoService,private mapaReclamoService:MapReclamoService) { 

    this.rutaURL = window.location.pathname.split('/');
    console.log(this.rutaURL)
    this.usuario.idUsuario = this.rutaURL[2];
    
    this.IDDetalleR = this.rutaURL[5]; /* en la posicion 5 esta el detalle del reclamo a actualizar */
    this.getRolUsuario(); /*obtengo todos los datos */
    

    this.getListReclamoAmbiental();
    this.getListMarca();
    this.getListModelo();
    /* utilizado como bandera y ver la tabla del detalle del reclamo */
    if(this.IDDetalleR!= undefined){
      this.banderaVerMapa='editar';
      this.metodo_VisualEditarReclamo(this.IDDetalleR);
    }
   
  }

  ngOnInit(): void {
    this.getListTipoReclamos();
  }
  /* utilizado solamente para visualizar etiquetas que dependen del rol del usuario */
  getRolUsuario() {
      this.serviceUsuario.getRolUsuario(this.usuario.idUsuario).subscribe(
        (data) => {
            this.usuario.idUsuario= data[0].idUsuario,
            this.usuario.nick= data[0].nick,
            this.usuario.idRol = data[0].idRol,
            this.usuario.rol=data[0].rol

            this.getIDSesionUsuarioLogueado(); /* de esos datos utilizo el idUsuario para obtener el id de sesion */
        },
        (error) => {
          console.error(error);
        }
      )

  }
  getIDSesionUsuarioLogueado(){
    this.serviceLogin.getSesionUsuarioLogueado(this.usuario.idUsuario).subscribe(
      (data)=>{
        
        this.usuario.IDsesion=data[0].idSesion;
        
      }
    )

  }

  
  getListTipoReclamos(): void {
    this.service.getTipoReclamo().subscribe(
      (res) => {
        this.Tiporecla = res;
        
      },
      (err) => console.error(err)
    );
  }
  getListEstadosReclamos(): void {
    this.service.getTipoReclamo().subscribe(
      (res) => {
        this.Tiporecla = res;
        
      },
      (err) => console.error(err)
    );
  }

  getListReclamoAmbiental(): void {
    this.service.getReclamoAmbiental().subscribe(
      (res) => {
       
        this.ReclamoAmbie = res;
      },
      (err) => console.error(err)
    );
  }

  getListMarca(): void {
    this.service.getMarca().subscribe(
      (res) => {
        this.Mar = res;
      },
      (err) => console.error(err)
    );
  }

  getListModelo(): void {
    this.service.getModelo().subscribe(
      (res) => {
        this.Mod = res;
        
      },
      (err) => console.error(err)
    );
  }

  registrarReclamo() {
    
    /* Validacion en el caso que registre un input vacio o cambie de tipo de reclamo y tenga un input vacio */
    /* reclamo Ambiental */
    if (Number(this.tipoReclamoCtrl.value) == 1 && (this.tipoReclamoCtrl.value == '' || this.reclamoAmbientalCtrl.value == '' ||
      this.fechaCtrl.value == '' || this.horaCtrl.value == '' || this.ubicacionCtrl.value == '' ||
      this.descripcionCtrl.value == '' || this.urlFotoCtrl.value == '' )) { /* || this.alturaCtrl.value == '' */
      this.toastr.warning(
        'Faltan datos por rellenar, verifique y podrá enviar su reclamo',
        'Cuidado!',
        {
          timeOut: 5000,
          progressBar: true,
        }
      );

      /* reclamo vial */
    } else if (Number(this.tipoReclamoCtrl.value) == 2 && (((this.dominioCtrl.value == '' || this.marcaAutoCtrl.value == '') &&
      this.tipoReclamoCtrl.value == '') || this.fechaCtrl.value == '' || this.horaCtrl.value == '' ||
      this.ubicacionCtrl.value == '' || this.descripcionCtrl.value == '' || this.urlFotoCtrl.value == ''  ||
      this.modeloAutoCtrl.value == '')) { /* || this.alturaCtrl.value == '' */
      this.toastr.warning(
        'Faltan datos por rellenar, verifique y podrá enviar su reclamo',
        'Cuidado!',
        {
          timeOut: 5000,
          progressBar: true,
        }
      );
    } else {
      var RegistroRecl: Reclamo = {
        fecha: this.fechaCtrl.value + '',
        foto: this.urlFotoCtrl.value + '', /* cambiar por el input file */
        hora: this.horaCtrl.value + '',
        ID_Sesion: Number(this.usuario.IDsesion),
        ID_TipoReclamo: Number(this.selectIdTipoReclamo),
        ID_Estado: 1 /* estado Activo */,
      };
      
      /* si es vial que se agrege el estado pendiente de vial sino queda en 1 para el ambiental */
      if (this.selectIdTipoReclamo == 2) {
        RegistroRecl.ID_Estado = 5;

      }

      /* Obtengo el id para validar mas adelante en el detalle si es ambiental o vial */
      this.validacionTipoReclamo = RegistroRecl.ID_TipoReclamo;   
      
      this.service.postReclamo(RegistroRecl).subscribe(
        (res) => {
          
          this.registrarDetalleReclamo(res); /* metodo para registrar el detalle */
        },
        (err) => console.error(err)
      );
    }
  }

  registrarDetalleReclamo(infoRec: any) {
    
    if (this.validacionTipoReclamo == 1) {
      /* Si es ambiental */
      
      var RegistroDetReclamo: DetalleReclamo = {
        descripcion: this.descripcionCtrl.value + '',
        direccion: this.ubicacionCtrl.value + '',
        altura: 0, /*  */
        dominio:  '-',
        ID_ReclamoAmbiental: Number(this.selectIdinfoReclamo),
        /* ID_Vehiculo: Number(this.selectIdMarcaVehiculo), */
        ID_Reclamo: infoRec.idReclamo,
        longitud: this.ubicacionReclamo.longitud + '',
        latitud: this.ubicacionReclamo.latitud+ ''
      };

      debugger
      this.service.postDetalleReclamo(RegistroDetReclamo).subscribe(
        (res) => {
          this.Notificacion();
          console.clear(); /* limpio la consola */
          this.limpiarPantalla();
        },
        (err) => console.error(err)
      );
    } else {
      
      /* Cuando sea Vehicular */
      /* Primero el detalle de reclamo */
      var RegistroDetReclamo: DetalleReclamo = {
        descripcion: this.descripcionCtrl.value + '',
        direccion: this.ubicacionCtrl.value + '',
        altura: 0, /* Number(this.alturaCtrl.value) */
        dominio: this.dominioCtrl.value + '',
        ID_ReclamoAmbiental: 0,
        /* ID_Vehiculo: Number(this.selectIdMarcaVehiculo), */
        ID_Reclamo: infoRec.idReclamo,
        longitud: this.ubicacionReclamo.longitud + '',
        latitud: this.ubicacionReclamo.latitud + ''
      };
      /* DETALLE RECLAMO */
      this.service.postDetalleReclamo(RegistroDetReclamo).subscribe(
        (resDetRecla) => {
          this.ID_DetReclamo =
            resDetRecla.idDetalleReclamo; /* se guarda el ID del detalle de reclamo recien creado
          para no perder el dato y despues insertarlo en RegVehiculoxDetalle*/
          this.RegVehiculo(); /* Se procede a realizar el registro del vehiculo  */
        },
        (err) => console.error(err)
      );
    }
  }
  RegVehiculo() {

    /* segundo el vehiculo */
    var RegistroVehiculo: Vehiculo = {
      dominio: this.dominioCtrl.value + '',
      color: this.colorAutoCtrl.value+'',
      numeroChasis: ' - ',
      numeroMotor: ' - ',
      ID_MarcaVehiculo: Number(this.selectIdMarcaVehiculo),
      ID_Estado: 12 /* 12 es activo y 13 es inactivo*/,
      ID_TipoVehiculo: 1 /* 1- Sin asignar */,
      ID_Modelo: Number(this.selectIdModeloVehiculo) /* Agregar modelos en reclamo y al actualizarlo, al igual que en la tabla y el historial */
    };
    this.service.postVehiculo(RegistroVehiculo).subscribe(
      (resVehiculo) => {
        this.ID_Vehiculo =
          resVehiculo.idVehiculo; /* se guarda el ID del vehiculo recien creado
         para no perder el dato y despues insertarlo en RegVehiculoxDetalle*/
        this.RegVehiculoxDetalle();
      },
      (err) => console.error(err)
    );
  }
  RegVehiculoxDetalle() {
    /* Ahora el vehiculoXdetalle */
    var RegistroVehxDet: vehiculoXDetalle = {
      ID_Vehiculo: this.ID_Vehiculo,
      ID_DetalleReclamo: this.ID_DetReclamo,
    };
    ;
    this.service.postVehiculoxDetalle(RegistroVehxDet).subscribe(
      (res) => {
        /* aca capturar el id del detalle de reclamo para insertarlo en vehiculoxDetalle */
        this.Notificacion();
        console.clear(); /* limpio la consola */
        this.limpiarPantalla();
      },
      (err) => console.error(err)
    );
  }
  dataChangedTipoReclamo(ev: any) {
    this.selectIdTipoReclamo = ev.target.value;
  }

  dataChangedIdMarcaVehiculo(ev: any) {
    this.selectIdMarcaVehiculo = ev.target.value;
  }

  obtenerIDModeloVehiculo(ev: any) {
    this.selectIdModeloVehiculo = ev.target.value;
  }

  /* metodo especifico para obtener el id del la seleccion de la causa del reclamo 
ambiental */
  obtenerID(ev: any) {
    this.selectIdinfoReclamo = ev.target.value;
  }

  obtenerHoraActual() {
    var today = new Date();

    this.time = today.getHours() + ':' + today.getMinutes();
  }

  Notificacion() {
    this.toastr.success(
      '¡Su reclamo fué creado correctamente!',
      'El estado del reclamo está pendiente'
    );
  }

  limpiarPantalla() {
    this.tipoReclamoCtrl.reset();
    this.reclamoAmbientalCtrl.reset();
    this.marcaAutoCtrl.reset();
    this.modeloAutoCtrl.reset();
    this.fechaCtrl.reset();
    this.horaCtrl.reset();
    this.ubicacionCtrl.reset();
    this.descripcionCtrl.reset();
    this.urlFotoCtrl.reset();
    this.alturaCtrl.reset();
    this.dominioCtrl.reset();
    this.banderaVerMapa='reclamo'



    this.toastr.info('Será redirigido al menú principal', '', {
      timeOut: 5000,

    });
    this.metodoRedireccion();
  }
  metodoRedireccion() {
    this.banderaEdicionReclamo = false;
    delete this.arregloDetalleReclamo;
    
    this.router.navigate(['menu',this.usuario.idUsuario,'historial'
    ]);
  }

  metodo_VisualEditarReclamo(idDetalleReclamo:number) {
    
    /* Este metodo se utiliza para controlar lo que se quiere ver cuando se desea editar un reclamo */
    if (this.rutaURL[3] == 'historial' && idDetalleReclamo != undefined) {
      this.banderaEdicionReclamo = true;

      /* Metodo en el cual se usa para traer todos los datos del reclamo a actualizar */
      this.service.getDetalleReclamoParaActualizar(idDetalleReclamo).subscribe(
        (info) => {

          /* Acá pregunto si es ambiental o vial, si es ambiental sigo lo comun si es vial traigo los datos del auto */
          if (info[0].idTipoRec == 1) {
            this.arregloDetalleReclamo = info;
            console.log(this.arregloDetalleReclamo)
            /* al obtener los datos muestro el mapa con la ubicacion del reclamo */

            this.verMapaReclamo(this.arregloDetalleReclamo[0].longitud,this.arregloDetalleReclamo[0].latitud)
            
            
            
          } else {

            delete this.arregloDetalleReclamo;
            this.getDetalleVehicularParaActualizar(info[0].idDetalleReclamo);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.banderaEdicionReclamo == false;
    }
  }
  getDetalleVehicularParaActualizar(idDetalleReclamo: number) {

    
    this.service.getDetalleReclamoVehicular(idDetalleReclamo).subscribe(
      (info) => {
      
        this.arregloDetalleReclamo = info;
      
      },
      (error) => {
        console.log(error);
      }
    );
  }

  dataChangedEstadoReclamo(ev: any) {
    /* Capturo el id del tipo de reclamo y luego lo uso para traer sus estados */
    this.idEstadoReclamo = ev.target.value;
    this.service.getFiltroEstadoHistorial(this.idEstadoReclamo).subscribe(
      (data) => {
        this.objetEstadoReclamo = data;
        
      },
      (error) => {
        console.log(error);
      }
    );
  }
  /* MetodoEstadoReclamo(id:any){
    console.log("EstadoReclamo: ",id)
  } */

  MetodoActualizarReclamo() {
    

    /* idEstadoReclamo */
    /* Roles 1=Administrador - 3=Usuario */
    if (this.estadoReclamoCtrl.value == '' && this.usuario.idRol == 1) {
      this.toastr.warning(
        'Para realizar la actualización ingrese el estado correspondiente al reclamo',
        'Atención',
        {
          timeOut: 5000,
          progressBar: true,
        }
      );
    } else if (this.arregloDetalleReclamo[0].idTipoRec != this.idEstadoReclamo && this.usuario.idRol == 1) {
      this.toastr.warning(
        'Seleccione el estado correcto del reclamo',
        'Atención',
        {
          timeOut: 5000,
          progressBar: true,
        }
      );
    } else {
      var putfecha: any;
      var putfoto: any;
      var puthora: any;
      var putID_TipoReclamo: any;
      var putID_Estado: any;
      

      if (this.estadoReclamoCtrl.value == '') {
        putID_Estado = this.arregloDetalleReclamo[0].idEstado;
      }
      if (this.estadoReclamoCtrl.value != '') {
        putID_Estado = Number(this.estadoReclamoCtrl.value);
      }
      if (this.tipoReclamoCtrl.value == '') {
        putID_TipoReclamo = this.arregloDetalleReclamo[0].idTipoRec;
      }
      if (this.tipoReclamoCtrl.value != '') {
        putID_TipoReclamo = Number(this.selectIdTipoReclamo);
      }
      if (this.fechaCtrl.value == '') {
        putfecha = this.arregloDetalleReclamo[0].fecha;
      }
      if (this.fechaCtrl.value != '') {
        putfecha = this.fechaCtrl.value + '';
      }
      ;
      if (this.horaCtrl.value == '') {
        puthora = this.arregloDetalleReclamo[0].hora;
      }

      if (this.horaCtrl.value != '') {
        puthora = this.horaCtrl.value + '';
      }
      if (this.urlFotoCtrl.value == '') {
        putfoto = this.arregloDetalleReclamo[0].foto;
      }
      if (this.urlFotoCtrl.value != '') {
        putfoto = this.urlFotoCtrl.value + '';
      }

      var reclamo: Reclamo = {
        IDReclamo: this.arregloDetalleReclamo[0].iD_Reclamo,
        fecha: putfecha,
        foto: putfoto,
        hora: puthora,
        ID_Sesion: this.arregloDetalleReclamo[0].idSesion,
        ID_TipoReclamo: putID_TipoReclamo,
        ID_Estado: putID_Estado,
      };

      

      this.service.putActualizarReclamo(reclamo).subscribe(
        (data) => {
          
          this.MetodoActualizarDetalleReclamo();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  MetodoActualizarDetalleReclamo() {
    
    var putDescripcion: any;
    var putUbicacion: any;
    /* var putAltura: any; */ /* no se usa, la altura se agrega en la descripcion */
    var putDominio: any;
    var putID_ReclamoAmbiental: any;

    if (this.selectIdinfoReclamo == 0) {
      putID_ReclamoAmbiental = this.arregloDetalleReclamo[0].idRecAmb;
    }
    if (this.selectIdinfoReclamo != 0) {
      putID_ReclamoAmbiental = Number(this.selectIdinfoReclamo);
    }

    if (this.descripcionCtrl.value == '') {
      putDescripcion = this.arregloDetalleReclamo[0].descripcion;
    }
    if (this.descripcionCtrl.value != '') {
      putDescripcion = this.descripcionCtrl.value + '';
    }
    ;
    if (this.ubicacionCtrl.value == '') {
      putUbicacion = this.arregloDetalleReclamo[0].direccion;
    }
    if (this.ubicacionCtrl.value != '') {
      putUbicacion = this.ubicacionCtrl.value + '';
    }
    /* if (this.alturaCtrl.value == '') {
      putAltura = this.arregloDetalleReclamo[0].altura;
    }
    if (this.alturaCtrl.value != '') {
      putAltura = this.alturaCtrl.value + '';
    } */
    if (this.dominioCtrl.value == '') {
      putDominio = this.arregloDetalleReclamo[0].dominio;
    }
    if (this.dominioCtrl.value != '') {
      putDominio = this.dominioCtrl.value + '';
    }
    ;
    var detalleReclamo: DetalleReclamo = {
      IDDetalleReclamo: Number(this.arregloDetalleReclamo[0].idDetalleReclamo),
      descripcion: String(putDescripcion),
      direccion: String(putUbicacion),
      altura: 0,
      dominio: String(putDominio),
      ID_ReclamoAmbiental: Number(putID_ReclamoAmbiental),
      ID_Reclamo: Number(this.arregloDetalleReclamo[0].iD_Reclamo),
      longitud: this.ubicacionReclamo.longitud+ '',
      latitud: this.ubicacionReclamo.latitud+ ''
    };
    debugger
    
    this.service.putActualizarDetalleReclamo(detalleReclamo).subscribe(
      (data) => {
        ;
        /*1= reclamo ambiental  */
        if (this.arregloDetalleReclamo[0].idTipoRec == 1) {
          
          this.ResetearFormulariosActualizacionReclamo();
          this.metodo_VisualEditarReclamo(this.IDDetalleR);
        } else if (this.arregloDetalleReclamo[0].idTipoRec == 2) {
          this.MetodoActualizarVehiculo();
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  MetodoActualizarVehiculo() {
    var putIDVehiculo: any;
    var putDominio: any;
    var putID_Marca: any;
    var putID_Modelo: any;

    

    if (this.selectIdMarcaVehiculo == 0) {
      putID_Marca = Number(this.arregloDetalleReclamo[0].iD_marca);
    }
    if (this.selectIdMarcaVehiculo != 0) {
      putID_Marca = Number(this.selectIdMarcaVehiculo);
    }

    if (this.selectIdModeloVehiculo == 0) {
      putID_Modelo = Number(this.arregloDetalleReclamo[0].iD_Modelo);
    }
    if (this.selectIdModeloVehiculo != 0) {
      putID_Modelo = Number(this.selectIdModeloVehiculo)
    }

    if (this.dominioCtrl.value == '') {
      putDominio = this.arregloDetalleReclamo[0].dominio;
    }
    if (this.dominioCtrl.value != '') {
      putDominio = this.dominioCtrl.value + '';
    }


    var vehiculo: Vehiculo = {
      IDVehiculo: this.arregloDetalleReclamo[0].iD_Vehiculo,
      dominio: putDominio,
      color: this.arregloDetalleReclamo[0].colorAuto,
      numeroChasis: this.arregloDetalleReclamo[0].numeroChasis,
      numeroMotor: this.arregloDetalleReclamo[0].numeroMotor,
      ID_MarcaVehiculo: putID_Marca,

      ID_Estado: this.arregloDetalleReclamo[0].iD_EstadoVehiculo,
      ID_TipoVehiculo: this.arregloDetalleReclamo[0].iD_Tipovehiculo,
      ID_Modelo: putID_Modelo /* Agregar los modelos en el reclamo */
    };

    this.service.putActualizarDetVehicular(vehiculo).subscribe(
      (data) => {
        this.ResetearFormulariosActualizacionReclamo();
        this.metodo_VisualEditarReclamo(this.IDDetalleR);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  regresarHistorial() {
    this.metodoRedireccion();
  }

  ResetearFormulariosActualizacionReclamo() {
    this.tipoReclamoCtrl.reset();
    this.reclamoAmbientalCtrl.reset();
    this.marcaAutoCtrl.reset();
    this.modeloAutoCtrl.reset();
    this.fechaCtrl.reset();
    this.horaCtrl.reset();
    this.ubicacionCtrl.reset();
    this.descripcionCtrl.reset();
    this.urlFotoCtrl.reset();
    this.alturaCtrl.reset();
    this.dominioCtrl.reset();
    this.estadoReclamoCtrl.reset();
    this.toastr.success('Reclamo Actualizado con exito', '', {
      timeOut: 7000,
      progressBar: true,
    });
  }


  /* Acciones con el mapa */

/* buscar lugar */
  onQueryChanged(query: string = '') {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {

      this.placesReclamoServices.getPlacesByQuery( query );
      /* this.lugaresService.getLugaresPorBusqueda(query); */
      console.log('Enviar este query: ', query)

    }, 1000)
  }
  
  /* coordenadas del reclamo y utilizadas para mostrarlo en el mapa a la hora de buscar dicha direccion */
  almacenarUbicacion(lng:number , lat:number){
    debugger
    this.ubicacionReclamo ={
      longitud:lng,
      latitud: lat,
    }
    console.log('Estoy almacenando mi ubicacion en ', this.ubicacionReclamo )
  }

  verMapaReclamo(longitud:any, latitud:any){

    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [longitud, latitud], // starting position [lng, lat]
      zoom: 16, // starting zoom
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
      .setLngLat([longitud, latitud ])
      .setPopup(popup)
      .addTo(map);
      this.mapaReclamoService.setMap( map );
  }



  

  

}
