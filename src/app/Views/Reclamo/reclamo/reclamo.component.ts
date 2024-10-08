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

import { MapReclamoService, PlacesReclamoService } from './maps-reclamo/services';
import { Popup, Map, Marker } from 'mapbox-gl';
import { Title } from '@angular/platform-browser';

import { OnExit } from 'src/app/guards/exit.guard';
import { formatDate } from '@angular/common';
import { EstadosService } from 'src/app/service/Estados/estados.service';
import { ReclamoApiService } from 'src/app/service/Reclamo/reclamo-api.service';
import { dir } from 'console';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { LocalidadService } from 'src/app/service/Localidad/localidad.service';
import {  postLocalidad } from 'src/app/model/localidad';


@Component({
  selector: 'app-reclamo',
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.css']
})
export class ReclamoComponent implements OnInit, OnExit {

  private debounceTimer?: NodeJS.Timeout;

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef

  /* ------------ Camara -------- */

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  isCameraStarted = false;
  capturedPhoto!: string;

  /* ------------ Camara -------- */

  /* ------------ Input File ------------  */
  imageReclamoDataUrl:string | undefined;
  /* ------------ Input File ------------  */

  
  tipoReclamoCtrl = new FormControl('', [Validators.required]);
  reclamoAmbientalCtrl = new FormControl('', [Validators.required]);
  marcaAutoCtrl = new FormControl('', [Validators.required]);
  modeloAutoCtrl = new FormControl('', [Validators.required]);
  colorAutoCtrl = new FormControl('', [Validators.required]);
 /*  fechaCtrl = new FormControl('', [Validators.required]); */
  /* horaCtrl = new FormControl('', [Validators.required]); */
  ubicacionCtrl = new FormControl('', [Validators.required]);
  descripcionCtrl = new FormControl('', [Validators.required]);
  FotoCtrl = new FormControl('', [Validators.required]);
  /* alturaCtrl = new FormControl('', [Validators.required]); */
  dominioCtrl = new FormControl('', [Validators.required]);
  ID_Reclamo = new FormControl('', [Validators.required]);
  estadoReclamoCtrl = new FormControl('', [Validators.required,]); /* Se utiliza al actualizar */

  recla: Reclamo = {
    fecha: '',
    foto: '',
    hora: '',
    ID_Sesion: 1,
    ID_TipoReclamo: 1,
    ID_Estado: 1,
  };
  fotoCamara:string=''

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
  fechaHoy: string ='';
  horaActual: string = '';
  

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
  nombreTipoReclamo!: string;

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

  // Variable para rastrear si se han realizado cambios sin guardar
  private cambiosSinGuardar = false;

  /* para la foto */
  public archivos: any = [];
  public previsualizacion: string = "";
  public imagenBase64: string = "";

  //bandera para visualizar la tabla 
   banderaTabla: number = 0;

   //mejorar ubicacion - utilizado para capturar la calle y altura, asi registrarlo en reclamo - el completo es para el input text
   // esto se usa en busqueda-lugares-reclamos
   calle: string = ''; // variable que se usa para registrar el reclamo
   altura: string =''; // variable que se usa para registrar el reclamo
   localidad:string = '';
   ubicacionCompleta : string = '';
   localidadUnica:string ='';
   idlocalidadReclamo:number=0;
   banderaLocalidad:boolean = false; //Falso si no esta registrado, verdadero si esta registrado
                                     // Se usa para validar a la hora de crear el reclamo, en el text dirección.

   @ViewChild('txtQuery') txtQuery: any;  // Asegúrate de importar ViewChild asi poder cambiar el texto del input

  constructor(private serviceUsuario: MenuApiService, private service: BackenApiService, private serviceLogin:LoginApiService , private router: Router, private toastr:ToastrService,
    private placesReclamoServices: PlacesReclamoService,private mapaReclamoService:MapReclamoService, private titulo:Title, private serviceEstado: EstadosService, private reclamoApi:ReclamoApiService, private serviceLocalidad:LocalidadService) { 

      

    titulo.setTitle('Reclamo') // titulo de la pesaña del navegador
     
    
  
    this.rutaURL = window.location.pathname.split('/');
    this.usuario.idUsuario = this.rutaURL[2];
    this.IDDetalleR = this.rutaURL[4]; /* en la posicion 5 esta el detalle del reclamo a actualizar */
   
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
      //trae los tipos de reclamos para el select y visualizar los radio buttons a la hora de actualizar el reclamo
      this.getListTipoReclamos();
  }

  obtenerHora(){
    /* Obtengo la hora actual */
    const now = new Date();
      this.horaActual = this.formatoHoraMinutos(now);
       
  }

  formatoHoraMinutos(date: Date): string {
    /* Formateo la hora a HH:mm */
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }
  fechaDeHoy(){
    this.fechaHoy = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    /* this.fechaHoy = new Date().toLocaleDateString('es-es', { day:"numeric",month:"numeric",year:"numeric"}) */ //month:"short" - muestra el mes abreviado
     console.log('fecha' + this.fechaHoy);

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
      (err) => console.error(this.toastr.info(
        'No fue posible cargar la lista de tipos de reclamos',
        'Atención!'
      )
     )
    );
  }
 /*  getListEstadosReclamos(): void {
    this.service.getTipoReclamo().subscribe(
      (res) => {
        this.Tiporecla = res;
        
      },
      (err) => console.error(err)
    );
  } */

  getListReclamoAmbiental(): void {
    this.service.getReclamoAmbiental().subscribe(
      (res) => {
       
        this.ReclamoAmbie = res;
      },
      (err) => console.error(this.toastr.info(
        'No fue posible cargar la lista de Reclamos Ambientales',
        'Atención!'
      ))
    );
  }

  getListMarca(): void {
    this.service.getMarca().subscribe(
      (res) => {
        this.Mar = res;
      },
      (err) => console.error(this.toastr.info(
        'No fue posible cargar la lista de Marca de los vehículos',
        'Atención!'
      ))
    );
  }

  getListModelo(): void {
    this.service.getModelo().subscribe(
      (res) => {
        this.Mod = res;
        
      },
      (err) => console.error(this.toastr.info(
        'No fue posible cargar la lista de los modelos de vehículos',
        'Atención!'
      ))
    );
  }

  registrarReclamo() {
    debugger
    /* Validacion en el caso que registre un input vacio o cambie de tipo de reclamo y tenga un input vacio */
    /* reclamo Ambiental */
   if ((this.tipoReclamoCtrl.value =='' || this.tipoReclamoCtrl.value == 1) &&
     (this.tipoReclamoCtrl.invalid  || this.reclamoAmbientalCtrl.invalid  ||  this.ubicacionCtrl.value == '' || this.descripcionCtrl.value == '' )) { /*  || this.FotoCtrl.invalid  || this.urlFotoCtrl.value == '' || this.alturaCtrl.value == ''  ||   this.fechaCtrl.value == '' this.horaCtrl.value == '' ||*/ 
      this.toastr.warning(
        'Quedan datos por rellenar en el formulario, verifique y podrá enviar su reclamo',
        '',
        {timeOut: 5000,}  
        );

      /* reclamo vial */
    } else if (this.tipoReclamoCtrl.value == 2 && (this.dominioCtrl.value == '' || this.marcaAutoCtrl.value == '' &&
      this.tipoReclamoCtrl.value == ''  ||  this.ubicacionCtrl.value == '' || this.descripcionCtrl.value == ''  || this.modeloAutoCtrl.value == '' || this.colorAutoCtrl.value =='' )) { /* || this.FotoCtrl.value == '' || this.alturaCtrl.value == '' || this.fechaCtrl.value == '' || this.horaCtrl.value == ''*/
      this.toastr.warning(
        'Quedan datos por rellenar, verifique y podrá enviar su reclamo',
        '',
        {
          timeOut: 5000,         
        }
      );
    } else {
      debugger
      this.fechaDeHoy();
      this.obtenerHora();
      var RegistroRecl: Reclamo = {
        fecha: this.fechaHoy + '',
        hora: this.horaActual + '',
        ID_Sesion: Number(this.usuario.IDsesion),
        ID_TipoReclamo: Number(this.selectIdTipoReclamo),
        ID_Estado: 1 /* estado Activo */,
      };

      if(this.imageReclamoDataUrl == undefined ){
        RegistroRecl.foto = ' - ';
      }else{
        RegistroRecl.foto= this.imageReclamoDataUrl; /* cambiar por el input file */
      }
      debugger
      
      /* si es vial que se agrege el estado pendiente de vial sino queda en 1 para el ambiental */
      if (this.selectIdTipoReclamo == 2) {
        RegistroRecl.ID_Estado = 5; //pendiente vial

      }
      /* Obtengo el id para validar mas adelante en el detalle si es ambiental o vial */
     // this.validacionTipoReclamo = RegistroRecl.ID_Estado ;   
      debugger

      //Si o si tiene que ser ambiental o vial, sino no entra
      if(this.selectIdTipoReclamo ==1 || this.selectIdTipoReclamo ==2){
        this.service.postReclamo(RegistroRecl).subscribe(
          (res) => {          
            this.registrarDetalleReclamo(res); /* metodo para registrar el detalle */
          },
          (err) => console.error(
            this.toastr.info(
              'Ocurrió un error al crear el reclamo, verifique que los datos sean correctos.',
              'Atención'
            ) 

          )
        );
      }else{
        this.toastr.info(
          'En estos momentos no se pueden realizar reclamos con el tipo de reclamo que seleccionó',
          'Seleccione Ambiental o Vial'
        );         
      }


      /*this.reclamoApi.getEstadoReclamo(this.nombreTipoReclamo).subscribe(
        (res) => {
          debugger
             RegistroRecl.ID_Estado = res[0].idEstado;
          
          

          
         
        },
        (err) => console.error(err)
      ) */
      

      

      
    }
  }

  public rellenarUbicacion(calle:string, altura:string, localidad:string, direccionCompleta:string, localidadUnica:string){
    debugger
    if(altura !=undefined && calle!=undefined)
    {
      debugger
      this.txtQuery.nativeElement.value = direccionCompleta;
      this.calle = calle;
      this.altura = altura;
      this.localidad = localidad; // contiene toda la direccion completa (sin la altura) pero se usa para validar que el reclamo se realice dentro de villa maria
      this.ubicacionCompleta = this.ubicacionCompleta;
      debugger
      this.localidadUnica = localidadUnica // se tiene que validar para registrar el reclamo, si no esta registrado de antes se crea un post y se agrega el id, si ya esta creado se obtiene el id y se agrega al detalle


      //metodo para traer el id de localidad y asi registrarlo en el reclamo.. tambien se puede usar para editar
      this.validarLocalidad(this.localidadUnica)

      
     //alert('Usted esta en '+ this.localidad)
    }else{
      this.toastr.info(
        'Ingrese la altura de la dirección deseada',
        ''
      );
    }
  }
  validarLocalidad(localidadUnica:string){
    //utilizado para obtener el id de la localidad en el momento de seleccionar la misma localidad
    // por el momento siempre va a ser villa maria, pero se agrega esta funcionalidad para el futuro
    debugger
    this.serviceLocalidad.getLocalidadReclamo(localidadUnica).subscribe(
      (data) => {
        debugger
        console.log(data)

        if(data.length==0){
          //Quiere decir que la localidad no esta registrada, se pasa a registrar
          var localidad : postLocalidad ={
            nombre : localidadUnica+'',
            provincia: "Córdoba",
            ID_Pais: 1,
            iD_EstadoLocalidad:1
          }


          this.serviceLocalidad.PostLocalidad(localidad).subscribe(
            (data) => {
              console.log(data)
              this.idlocalidadReclamo = data[0].idlocalidad;
            },
            (error) =>{
              console.log(error)
            }
          )


        }else{
          debugger
          //Si ya esta registrada entonces se obtiene el id
          this.idlocalidadReclamo = data[0].idLocalidad; //Utilizada en el momento de crear el reclamo
        }


       

      },
      (err) => {
        this.toastr.info(
          'No se encuentran localidades registradas', '',
          {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          }
        );
      }
    )
  }

  verificarLocalidad(localidadUnica:string, infoRec:any){
    
    debugger
    this.serviceLocalidad.getLocalidadReclamo(localidadUnica).subscribe(
      (data) => {
        debugger
        console.log(data)

        if(data.length==0){
          
          //Aca no entra nunca

        }else{
          debugger
          //Si ya esta registrada entonces se obtiene el id
          this.idlocalidadReclamo = data[0].idLocalidad; //Utilizada en el momento de crear el detalle del reclamo

          if (this.selectIdTipoReclamo ==1) {
            /* Si es ambiental */
      
            debugger
           
              var RegistroDetReclamo: DetalleReclamo = {
                descripcion: this.descripcionCtrl.value + '',
                direccion: this.calle + '', 
                altura: Number(this.altura),
                dominio:  '-',
                ID_ReclamoAmbiental: Number(this.selectIdinfoReclamo),
                /* ID_Vehiculo: Number(this.selectIdMarcaVehiculo), */
                ID_Reclamo: infoRec.idReclamo,
                longitud: this.ubicacionReclamo.longitud + '',
                latitud: this.ubicacionReclamo.latitud+ '',
                ID_Localidad:Number(this.idlocalidadReclamo)    // se tiene que agregar el id de la localidad
              };
    
              debugger
              this.service.postDetalleReclamo(RegistroDetReclamo).subscribe(
                (res) => {
                  this.Notificacion();
                  console.clear(); /* limpio la consola */
                  this.limpiarPantalla();
                },
                (err) => console.error(
                  this.toastr.info(
                    'Ocurrio un error al cargar el detalle del reclamo',
                    'Atención'
                  ) 
                )
              );
          
          } else if(this.selectIdTipoReclamo == 2){
            debugger
            /* Cuando sea Vehicular */
            /* Primero el detalle de reclamo */
            var RegistroDetReclamo: DetalleReclamo = {
              descripcion: this.descripcionCtrl.value + '',
              direccion: this.calle + '', 
              altura: Number(this.altura),
              dominio: this.dominioCtrl.value + '',
              ID_ReclamoAmbiental: 0,
              /* ID_Vehiculo: Number(this.selectIdMarcaVehiculo), */
              ID_Reclamo: infoRec.idReclamo,
              longitud: this.ubicacionReclamo.longitud + '',
              latitud: this.ubicacionReclamo.latitud + '',
              ID_Localidad:Number(this.idlocalidadReclamo)
            };
            /* DETALLE RECLAMO */
            this.service.postDetalleReclamo(RegistroDetReclamo).subscribe(
              (resDetRecla) => {
                this.ID_DetReclamo = resDetRecla.idDetalleReclamo; /* se guarda el ID del detalle de reclamo recien creado
                para no perder el dato y despues insertarlo en RegVehiculoxDetalle*/
                this.RegVehiculo(); /* Se procede a realizar el registro del vehiculo  */
              },
              (err) => console.error(this.toastr.info(
                'Ocurrio un error al cargar el detalle del reclamo',
                'Atención!'
              ) 
            )
            );
          }else{
            debugger
            this.toastr.info(
              'En estos momentos no se pueden realizar reclamos con el tipo de reclamo que seleccionó',
              'Seleccione Ambiental o Vial'
            );
            
          
          }



        }


       

      },
      (err) => {
        this.toastr.info(
          'No se encuentran localidades registradas', '',
          {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          }
        );
      }
    )






  }

  registrarDetalleReclamo(infoRec: any) {
    debugger

     //verificacion de que si la localidad que se ingreso en la provincia de cordoba existe entonces no se crea sino que se le agrega el id de esa localidad.
     this.verificarLocalidad(this.localidadUnica, infoRec);

     // HACER!!! METER TODO EL POST DEL DETALLE RECLAMO EN VALIDAR.
     // TIENE QUE IR EN EL ELSE, CUANDO LA LOCALIDAD YA ESTA CARGADA, CON ESO SE SOLUCIONA EL PROBLEMA

    // cuando sea ambiental o distinto de vehicular, es decir que es cualquier otro tipo de reclamo excepto vehicular
    
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
      (err) => console.error(this.toastr.info(
        'Ocurrio un error al cargar el reclamo vial',
        'Atención!'
      ) )
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
      (err) => console.error(this.toastr.info(
        'Ocurrio un error al cargar el detalle del reclamo vial',
        'Atención!'
      ) )
    );
  }


  dataChangedTipoReclamo(ev: any) {
    debugger
   
    this.selectIdTipoReclamo = ev.target.value;

     /* for (let i = 0; i < this.Tiporecla.length; i++) {
      
      if(this.selectIdTipoReclamo==this.Tiporecla[i].idTipoReclamo)
      {
        debugger
        this.nombreTipoReclamo = this.Tiporecla[i].nombre!.toString();
        break;
      }
      
     } */
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

  /* obtenerHoraActual() {
    var today = new Date();

    this.time = today.getHours() + ':' + today.getMinutes();
  } */

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
   /*  this.fechaCtrl.reset();
    this.horaCtrl.reset(); */
    this.ubicacionCtrl.reset();
    this.descripcionCtrl.reset();
    /* this.urlFotoCtrl.reset();
    this.alturaCtrl.reset(); */
    this.dominioCtrl.reset();
    this.banderaVerMapa='reclamo'



    /* this.toastr.info('Será redirigido al menú principal', '', {
      timeOut: 5000,

    }); */
    this.metodoRedireccion();
  }
  metodoRedireccion() {
    this.banderaEdicionReclamo = false;
    delete this.arregloDetalleReclamo;
    
    this.router.navigate(['menu',this.usuario.idUsuario,'historial'
    ]);
  }

  metodo_VisualEditarReclamo(idDetalleReclamo:number) {
    this.titulo.setTitle('Actualizar Reclamo')
    
    /* Este metodo se utiliza para controlar lo que se quiere ver cuando se desea editar un reclamo */
    debugger
    if (this.rutaURL[3] == 'historial' && idDetalleReclamo != undefined) {
      this.banderaEdicionReclamo = true;

      /* Metodo en el cual se usa para traer todos los datos del reclamo a actualizar */
      this.service.getDetalleReclamoParaActualizar(idDetalleReclamo).subscribe(
        (info) => {

          /* Acá pregunto si es ambiental o vial, si es ambiental sigo lo comun si es vial traigo los datos del auto */
          if (info[0].idTipoRec == 1) {
            debugger
            this.arregloDetalleReclamo = info;

            this.calle = this.arregloDetalleReclamo[0].direccion;
            this.altura = this.arregloDetalleReclamo[0].altura;
            this.ubicacionCompleta = this.calle + ' ' + this.altura;

            console.log(this.arregloDetalleReclamo);
           
            this.banderaTabla = this.arregloDetalleReclamo[0].idTipoRec; // tambien puede ser directamente 1 - ambiental
            /* al obtener los datos muestro el mapa con la ubicacion del reclamo */
            this.verMapaReclamo(this.arregloDetalleReclamo[0].longitud,this.arregloDetalleReclamo[0].latitud)
            
            
            debugger
          } else {
            debugger
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

    /* solo se usa para mostrar el mapa */
    /* al ser vehicular se muestra el componente vehicletablecomponent */
    this.service.getDetalleReclamoVehicular(idDetalleReclamo).subscribe(
      (info) => {
        debugger
        this.arregloDetalleReclamo = info;
        this.banderaTabla = this.arregloDetalleReclamo[0].idTipoRec;
        
       
        debugger
        
        this.verMapaReclamo(this.arregloDetalleReclamo[0].longitud,this.arregloDetalleReclamo[0].latitud)
      
      },
      (error) => {
        console.log(error);
      }
    );
  }

  dataChangedEstadoReclamo(ev: any) {
    /* Capturo el id del tipo de reclamo y luego lo uso para traer sus estados */
    debugger
    this.idEstadoReclamo = ev.target.value;
    let nombre = ev.target.getAttribute('data-nombre');
    //buscar por el nombre 
    this.serviceEstado.getEstadoPorNombre(nombre).subscribe(
      (data) => {
        console.log("Estados de los tipos de reclamos seleccionados")
        console.log(data)
        this.objetEstadoReclamo = data;
        debugger
        
      },
      (error) => {
        console.log(error);
      }
    )
   /*  this.service.getFiltroEstadoHistorial(this.idEstadoReclamo).subscribe(
      (data) => {
        this.objetEstadoReclamo = data;
        
      },
      (error) => {
        console.log(error);
      }
    ); */
  }
  /* MetodoEstadoReclamo(id:any){
    console.log("EstadoReclamo: ",id)
  } */

  MetodoActualizarReclamo() {
    
    debugger
    /* idEstadoReclamo */
    /* Roles 1=Administrador - 3=Usuario */
    if (this.estadoReclamoCtrl.value == '' && this.usuario.idRol == 1) {
      this.toastr.warning(
        'Para realizar la actualización ingrese el estado correspondiente al reclamo',
        'Atención',
        {
          timeOut: 5000,
         
        }
      );
    } else if (this.arregloDetalleReclamo[0].idTipoRec != this.idEstadoReclamo && this.usuario.idRol == 1) {
      this.toastr.warning(
        'Seleccione el estado correcto del reclamo',
        'Atención',
        {
          timeOut: 5000,
         
        }
      );
    
    }else {
      debugger
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
      /* if (this.fechaCtrl.value == '') {
        putfecha = this.arregloDetalleReclamo[0].fecha;
      }
      if (this.fechaCtrl.value != '') {
        putfecha = this.fechaCtrl.value + '';
      } */

     /*   if (this.horaCtrl.value == '') {
        puthora = this.arregloDetalleReclamo[0].hora;
      }

      if (this.horaCtrl.value != '') {
        puthora = this.horaCtrl.value + '';
      }  */
      debugger
      
      if (this.FotoCtrl.value =='') {
        putfoto = this.arregloDetalleReclamo[0].foto;
        
      }
      if (this.FotoCtrl.value != '' ) {
        putfoto = this.imageReclamoDataUrl;
      }
      debugger
      var reclamo: Reclamo = {
        IDReclamo: this.arregloDetalleReclamo[0].iD_Reclamo,
        fecha: this.arregloDetalleReclamo[0].fecha,
        foto: putfoto,
        hora: this.arregloDetalleReclamo[0].hora,
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
    var putAltura: any; /* no se usa, la altura se agrega en la descripcion */
    var putDominio: any;
    var putID_ReclamoAmbiental: any;
    var putLongitud:any;
    var putLatitud:any;
    var putID_Localidad:number=0;
    debugger

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
      putUbicacion = this.calle;
    }
    debugger
    if( this.ubicacionCompleta.includes(this.altura)){//cuando no se cambia la altura o posee la misma altura que ya esta en la BD, esto es por ejemplo si tengo la misma altura pero distinta direccion
      putAltura = this.arregloDetalleReclamo[0].altura
    }
    if(!this.ubicacionCompleta.includes(this.altura)){// si la direccion es distinta a la que ya esta en la BD, procese a cambiarlo, pese que sea de la misma direccion o distinta.
      putAltura = this.altura;
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
    debugger
    /* cuando no busque otro direccion */
    if (this.ubicacionReclamo.longitud == 0) {
      putLongitud = this.arregloDetalleReclamo[0].longitud;
    }
    /* cuando busque otra direccion y tengo su coordenada */
    if (this.ubicacionReclamo.longitud  != 0) {
      putLongitud = this.ubicacionReclamo.longitud;
    }

     /* cuando no busque otro direccion */
     if (this.ubicacionReclamo.latitud == 0) {
      putLatitud = this.arregloDetalleReclamo[0].latitud;
    }
    /* cuando busque otra direccion y tengo su coordenada */
    if (this.ubicacionReclamo.latitud  != 0) {
      putLatitud = this.ubicacionReclamo.latitud;
    }
    debugger
    //no busque una nueva direccion entonces mantengo el mismo id
    if(this.idlocalidadReclamo==0){
      putID_Localidad =this.arregloDetalleReclamo[0].iD_Localidad;
    }
    //busque una direccion y la seleccione entonces tengo un nuevo id
    if(this.idlocalidadReclamo!=0){
      putID_Localidad=Number(this.idlocalidadReclamo)
    }


    var detalleReclamo: DetalleReclamo = {
      IDDetalleReclamo: Number(this.arregloDetalleReclamo[0].idDetalleReclamo),
      descripcion: String(putDescripcion),
      direccion: String(putUbicacion),
      altura: Number(putAltura),
      dominio: String(putDominio),
      ID_ReclamoAmbiental: Number(putID_ReclamoAmbiental),
      ID_Reclamo: Number(this.arregloDetalleReclamo[0].iD_Reclamo),
      longitud: putLongitud + '',
      latitud: putLatitud +'',
      ID_Localidad: Number(putID_Localidad)//ID_Localidad
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

  /* boton historial en reclamo */
  regresarHistorial() {
    this.metodoRedireccion();
  }

  ResetearFormulariosActualizacionReclamo() {
    this.tipoReclamoCtrl.reset();
    this.reclamoAmbientalCtrl.reset();
    this.marcaAutoCtrl.reset();
    this.modeloAutoCtrl.reset();
   /*  this.fechaCtrl.reset();
    this.horaCtrl.reset(); */
    this.ubicacionCtrl.reset();
    this.descripcionCtrl.reset();
    /* this.urlFotoCtrl.reset(); */
    /* this.alturaCtrl.reset(); */
    this.dominioCtrl.reset();
    this.estadoReclamoCtrl.reset();

    this.toastr.success('Reclamo Actualizado con exito', '', {
      timeOut: 7000,
      
    });
    this.metodoRedireccion()
  }


  /* Acciones con el mapa */

/* buscar lugar */
  onQueryChanged(query: string = '') {
   
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {

      this.placesReclamoServices.getPlacesByQuery( query );
      /* this.lugaresService.getLugaresPorBusqueda(query); */
      debugger
      console.log('nombre Ubicacion: ', query)

    }, 1000)
  }
  
  /* coordenadas del reclamo y utilizadas para mostrarlo en el mapa a la hora de buscar dicha direccion */
  /* se utiliza en busqueda-lugares-reclamo */
  almacenarUbicacion(lng:number , lat:number){
    debugger
    this.ubicacionReclamo ={
      longitud:lng,
      latitud: lat,
    }
    console.log('Estoy almacenando mi ubicacion en ', this.ubicacionReclamo )
  }

  verMapaReclamo(longitud:any, latitud:any){
    debugger
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
        </div>
        `);

    /* Market - Marcador */
    new Marker({ color: 'red' })
      .setLngLat([longitud, latitud ])
      .setPopup(popup)
      .addTo(map);
      this.mapaReclamoService.setMap( map );
  }



  /* -------------------- Camara ------------------- */


  startCamera() {
    const video = this.videoPlayer.nativeElement;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
          video.play();
          this.isCameraStarted = true;
        })
        .catch(error => {
          console.log('Error al acceder a la cámara:', error);
        });
    } else {
      console.log('La API MediaDevices no está disponible');
    }
  }

  capturePhoto() {
    const video = this.videoPlayer.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    this.capturedPhoto = canvas.toDataURL('image/jpg');
    
    this.stopCamera();
    
  }

  stopCamera() {
    const video = this.videoPlayer.nativeElement;
    const stream = video.srcObject as MediaStream;
  
    if (stream) {
      const tracks = stream.getTracks();
  
      tracks.forEach(track => {
        track.stop();
      });
  
      video.srcObject = null;
      this.isCameraStarted = false;
    }
  }

  /* -------------------- Fin Camara ------------------- */

  /* Input File */

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.uploadImage(file);
    }
  }
/* leer el contenido del archivo seleccionado y convertirlo en un formato utilizable, como una URL de datos */
  uploadImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageReclamoDataUrl = reader.result as string;
      
      
      // Aquí puedes realizar acciones adicionales con la imagen,
      // como enviarla al servidor o mostrarla en la interfaz de usuario.
    };
    reader.readAsDataURL(file);
  }

  // Metodo para verificar su puede abandonar el formulario luego de interactuar con el mismo formulario
  onExit():boolean {
   debugger
    if ( this.tipoReclamoCtrl.dirty || this.reclamoAmbientalCtrl.dirty || this.marcaAutoCtrl.dirty || this.modeloAutoCtrl.dirty || this.colorAutoCtrl.dirty  || this.ubicacionCtrl.dirty || this.descripcionCtrl.dirty || this.FotoCtrl.dirty  || this.dominioCtrl.dirty)  /* || this.alturaCtrl.dirty  || this.fechaCtrl.dirty || this.horaCtrl.dirty */
    {
      const respuesta = confirm('¿Estás seguro de salir del formulario?')
      return respuesta;

    } 
      return true;

    

  }

  // Método para verificar si se pueden abandonar los cambios sin guardar
  canDeactivate(): boolean {
    debugger
    if (this.cambiosSinGuardar== false) {
      return window.confirm('¿Seguro que deseas abandonar el formulario sin guardar los cambios?');
    }
    return true;
  }

  

  

}
