import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal  } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { EstadoReclamo, tipoEstadoHistorial } from 'src/app/model/filtrosHistorial/estadoReclamo';
import { TipoReclamo } from 'src/app/model/tipoReclamo';
import { LoginApiService } from 'src/app/service/Login/login-api.service';
import { MenuApiService } from 'src/app/service/Menu/menu-api.service';
import { BackenApiService } from 'src/app/service/backen-api.service';
import { MenuComponent } from '../../Estructura/menu/menu.component';
import { Title } from '@angular/platform-browser';
import { Reclamo } from 'src/app/model/reclamo';

import { PageEvent } from '@angular/material/paginator';

/* import { Popup, Map, Marker } from 'mapbox-gl';
import { MapReclamoService } from '../reclamo/maps-reclamo/services'; */




@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {



  
  tipoReclamoCtrl = new FormControl('', [Validators.required]);
  estadoReclamoCtrl = new FormControl('', [Validators.required]);
  fechaDesdeCtrl = new FormControl('', [Validators.required]);
  fechaHastaCtrl = new FormControl('', [Validators.required]);
  nombreUsuarioCtrl = new FormControl('', [Validators.required]);
  formTarjetas = new FormControl('', [Validators.required]);

  rutaURL:any;
  IDUsuario: any;
  IDRol: any;
  IDSesion: any;

  Dreclamos: any[] = [];

  estadosReclamo: number[] = [2,3,4,6,7,8]; //utilizado para desabilitar el boton de editar y descartar con los estados del reclamo
  //2,3,4 - ambiental | 6,7,8 - vial


  tiposReclamos: TipoReclamo[] = []; /* le asigno el nombre del modelo a una variable */
  /* tiene que ser el mismo nombre sino angular no encuentra el modelo */

  estadosReclamoFiltro: any;
  fechaHoy:any;

  public FER: EstadoReclamo[] = []; /* filtro estadoRecmo.ts */

  selectIDTipReclamo = 0; /* Variable para capturar el valor del tipo de reclamo */
  selectIDEstadoReclamo = 0; /* Variable para capturar el id del estado del tipo de reclamo */
 
  objetoReclamo: any;

   filtroNombreUsuario:string=""; //se va usar para filtrar por nombre de usuario (hacer una validacion al crear el usuario, que no haya 2 usuarios con el mismo nombre )

   banderaIconoCarga:boolean =true;
   banderaAlerta:boolean=false;
   mensajeCarga:string='No hay reclamos...';

   usuario = {
    idUsuario: 0,
    nick: '',
    idRol: 0,
    rol: '',
    IDsesion:0,
  }

  /* Mapa */
  coordonadas: string='';
  longitud: string='';
  latitud: string='';
  direccion: string='';

  /* Switch */
  banderaVistaHistorial: boolean=true; /* True porque es para ver en lista detallada */

  /* Cancelar Reclamo */
  listTipoReclamo:any;

  /* paginacion para las listas */
  pageSize = 5; // Tamaño de página predeterminado
  paginaDesde: number=0;
  paginaHasta: number =10;

  listaEstados: tipoEstadoHistorial[] = [];
  constructor( public serviceUsuario: MenuApiService, public serviceLogin: LoginApiService,  public detalleReclamo:BackenApiService, private router:Router, private toastr:ToastrService,  private modal: NgbModal, private menuComponent: MenuComponent, private titulo:Title) 
  {

    titulo.setTitle('Historial')
    this.rutaURL = window.location.pathname.split('/');
    this.usuario.idUsuario = this.rutaURL[2];
    
    this.fechaHoy = formatDate(new Date(), 'yyyy-MM-dd', 'en-US'); /* fecha del dia */
    /* this.fechaDesdeCtrl = new FormControl(this.fechaHoy, [Validators.required]); */

    
   

    this.getRolUsuario();
   /*  this.getTipoReclamo(); */ // esto tenia antes
    this.getEstados()
   }

  ngOnInit(): void {
   

    
  }

  getEstados(){
    //lista de estados utilizados en el primer select, anteriormente era tipos de reclamos pero para que tenga relacion segun los estados es mejor
    //usar la lista de estados - ambienta y vial -
    this.detalleReclamo.getEstadosHistorial().subscribe(
      (data) => {
        this.listaEstados = data;
        console.log(this.listaEstados)
      }
    )

    
  }

    /* utilizado solamente para visualizar etiquetas que dependen del rol del usuario */
    getRolUsuario() {
      this.serviceUsuario.getRolUsuario(this.usuario.idUsuario).subscribe(
        (data) => {
            this.usuario.idUsuario= data[0].idUsuario,
            this.usuario.nick= data[0].nick,
            this.usuario.idRol = data[0].idRol,
            this.usuario.rol=data[0].rol
            
            if(this.usuario.idRol==3){
              this.getIDSesionUsuarioLogueado(); /* de esos datos utilizo el idUsuario para obtener el id de sesion */
            }
            
            this.getDetalleReclamosHoy(); /* Traer los reclamos del dia de hoy */
           
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

  
  getDetalleReclamosHoy() {
   debugger
    console.log('rol usuario: '+this.usuario.idRol)
    if (this.usuario.idRol == 1 || this.usuario.idRol == 2) {
     
      this.detalleReclamo.getHistorialHoy(this.fechaHoy,this.usuario.idUsuario,1,5,this.usuario.idRol).subscribe(
        (info) => {
          console.log(info);

          if (info.length == 0) {
            this.banderaAlerta=true;
            this.banderaIconoCarga=false;
            this.mensajeDelDia();
          }else{
           
            this.Dreclamos = info; 
            this.banderaIconoCarga=false;           
          } 
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
     
      this.detalleReclamo.getHistorialHoy(this.fechaHoy,this.usuario.idUsuario,1,5,this.usuario.idRol).subscribe( /* getDetalleReclamoUsuario(this.IDUsuario, 1) */
        (info) => {
          
          this.banderaIconoCarga=false;
          this.Dreclamos = info;
          if (info.length == 0) {
            this.banderaAlerta=true;           
            this.banderaIconoCarga=false;
            this.mensajeDelDia();
          }else{
            
            this.Dreclamos = info;
            console.log(this.Dreclamos)           
            this.banderaIconoCarga=false;          
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

/*   getTipoReclamo(): void {
    this.detalleReclamo.getTipoReclamo().subscribe(
      (res) => {
        this.tiposReclamos = res;
        console.log('Tipos Reclamos:', this.tiposReclamos);
      },
      (err) =>{
        console.error(err)
      } 
    );
  } */

  obtenerIDTipoReclamo(ev: any) {
    
    this.selectIDTipReclamo = ev.target.value;
    console.log(this.selectIDTipReclamo);
    this.getEstadoReclamo(this.selectIDTipReclamo);
  }

  getEstadoReclamo(idTipoReclamo: number) {
    
    this.detalleReclamo.getFiltroEstadoHistorial(idTipoReclamo).subscribe(
      (res) => {
        this.estadosReclamoFiltro = res;
        this.FER = res;

        console.log('Estados Reclamos', this.estadosReclamoFiltro);
      },
      (err) => console.error(err)
    );
  }
  obtenerIDEstadoReclamo(ev: any) {
    
    this.selectIDEstadoReclamo = ev.target.value;
    console.log('IDEstadoReclamo: ', this.selectIDEstadoReclamo);
  }

  /* Funcion para ir de la pantalla historial hacia el reclamo y editarlo */
  editarReclamo(idDetalleReclamo: any) {
    
    console.clear();

   /*  this.router.navigate([
      'main-nav',
      this.usuario.idUsuario,
      this.usuario.idRol,
      this.IDSesion,
      'historial',
      'reclamos',
      idDetalle,
    ]); */
    this.router.navigate(['menu',this.usuario.idUsuario,'historial',idDetalleReclamo]);
  }

  btnBuscarReclamosFiltrados() {
    
    //NOTA: si busco todos los reclamos de ambiental tengo que hacer una nueva funcion para ese mismo estado, solamente es (23/02/2022)
    var filtroIDTReclamo: any;
    var filtroIDEstadoReclamo: any;
    var filtroFechaInicio: any;
    var filtroFechaFin: any;

    this.banderaIconoCarga=true; /* se activa para que la animacion refleje que se están cargando los reclamos solicitados */
    
    /* Administrador y empleado */
    if (this.usuario.idRol == 1 || this.usuario.idRol== 2) {
      
      /* Busqueda por tipo reclamo y estado (no ingreso el nombre de usuario ni la fecha) */
      if ((this.tipoReclamoCtrl.value != '' && this.estadoReclamoCtrl.value!='') &&  this.nombreUsuarioCtrl.value=='' && this.fechaDesdeCtrl.value=='') {
        filtroIDTReclamo = this.selectIDTipReclamo;
        filtroIDEstadoReclamo = this.selectIDEstadoReclamo;
        this.detalleReclamo
          .getDetalleReclamoFiltrado(filtroIDTReclamo, filtroIDEstadoReclamo,this.usuario.idRol).subscribe(
            (res) => {
              this.formTarjetas.reset();
              this.Dreclamos =[];

              this.banderaIconoCarga =false; /* No se visualiza */
              this.banderaAlerta=false;/* No se visualiza */
              this.Dreclamos = res;
              console.log(this.Dreclamos);
            
              if (res.length == 0) {
                this.banderaAlerta=true;/*se visualiza */
                this.mensajeRespuestaErrordeBusqueda();
              }
            },
            (err) => console.error(err)
          );
          /* Busqueda por tipo reclamo, estado y nombre (no ingresó la fecha) */
      }else if((this.tipoReclamoCtrl.value != '' && this.estadoReclamoCtrl.value!='') &&  this.nombreUsuarioCtrl.value!='' && this.fechaDesdeCtrl.value==''){
        filtroIDTReclamo = this.selectIDTipReclamo;
        filtroIDEstadoReclamo = this.selectIDEstadoReclamo;
        this.detalleReclamo
          .getDetalleReclamoFiltradoNombre(filtroIDTReclamo, filtroIDEstadoReclamo,this.nombreUsuarioCtrl.value+'', this.usuario.idRol).subscribe(
            (res) => {
              this.formTarjetas.reset();
              this.Dreclamos =[];
              
              this.banderaIconoCarga =false; /* No se visualiza */
              this.banderaAlerta=false;/* No se visualiza */
              this.Dreclamos = res;
              if (res.length == 0) {
                this.banderaAlerta=true;/*se visualiza */
                this.mensajeRespuestaErrordeBusqueda()
              }
            },
            (err) => console.error(err)
          );
          /* Busqueda por nombre de usuario - siendo administrador */
      }else if((this.tipoReclamoCtrl.value=="" && this.estadoReclamoCtrl.value=="" )&& this.nombreUsuarioCtrl.value!=""){
        
        this.filtroNombreUsuario = this.nombreUsuarioCtrl.value+'';
        this.detalleReclamo.getDetalleReclamoFiltradoNombreUsuario(this.filtroNombreUsuario).subscribe(
          (res) => {
            this.formTarjetas.reset();//elimino las tarjetas
            this.Dreclamos =[];//vacio el array con toda la informacion
            this.banderaIconoCarga =false; /* No se visualiza */
            this.banderaAlerta=false;/* No se visualiza */
            
            this.Dreclamos = res;
            if (res.length == 0) {
              this.banderaAlerta=true;/*se visualiza */
              this.mensajeRespuestaErrordeBusqueda();
            }
          },
          (err) => console.error(err)
        );
        /* Busqueda por una fecha, estado y tiporeclamo */
      }else if((this.tipoReclamoCtrl.value!="" && this.estadoReclamoCtrl.value!="" )&& this.fechaDesdeCtrl.value!="" && this.nombreUsuarioCtrl.value==""){
        
        this.detalleReclamo.getDetalleReclamoPorfecha(Number(this.tipoReclamoCtrl.value),Number(this.estadoReclamoCtrl.value),this.fechaDesdeCtrl.value+'',this.usuario.idRol).subscribe(
          (res)=>{
            
            this.formTarjetas.reset();//elimino las tarjetas
            this.Dreclamos =[];;//vacio el array con toda la informacion
            this.banderaIconoCarga =false;
            this.banderaAlerta=false;
            this.Dreclamos = res;
            console.log(this.Dreclamos)
            if (res.length == 0) {
              this.banderaAlerta=true;
              this.banderaIconoCarga=false;
              this.mensajeRespuestaErrordeBusqueda();
            }

            
          },
          (err)=>console.error(err)
        )
          /* Busqueda por tipo reclamo, estado reclamo, fecha y nombre de usuario */
      }else if((this.tipoReclamoCtrl.value!="" && this.estadoReclamoCtrl.value!="" )&& this.fechaDesdeCtrl.value!="" && this.nombreUsuarioCtrl.value!=""){
        debugger
        this.detalleReclamo.getDetalleReclamoPorfechayNombreUsuario(Number(this.tipoReclamoCtrl.value),Number(this.estadoReclamoCtrl.value),this.fechaDesdeCtrl.value+'',this.usuario.idRol,this.nombreUsuarioCtrl.value+'').subscribe(
          (res)=>{
            
            this.formTarjetas.reset();//elimino las tarjetas
            this.Dreclamos =[];//vacio el array con toda la informacion
            this.banderaIconoCarga =false;
            this.banderaAlerta=false;
            this.Dreclamos = res;
            console.log(this.Dreclamos)
            if (res.length == 0) {
              this.banderaAlerta=true;
              this.banderaIconoCarga=false;
              this.mensajeRespuestaErrordeBusqueda();
            }

            
          },
          (err)=>console.error(err)
        )

      }else{
        this.banderaAlerta=true;
        this.banderaIconoCarga =false; 

        this.toastr.info(
          'No se puede realizar la acción deseada',
'',
          {
            timeOut: 5000,
            
          }
        );
      }

      /* {
        this.banderaAlerta=true;
        this.banderaIconoCarga =false; 

        this.toastr.info(
          'No se encuentran reclamos registrados para la busqueda seleccionada ',
          'Atención',
          {
            timeOut: 5000,
            progressBar: true,
          }
        );
      
    
      } */

      /* siendo usuario */
    } else if(this.usuario.idRol==3)  {
      
      filtroIDTReclamo = this.selectIDTipReclamo;
      filtroIDEstadoReclamo = this.selectIDEstadoReclamo;
      filtroFechaInicio = this.fechaDesdeCtrl.value;
      filtroFechaFin = this.fechaHastaCtrl.value;
      /* Filtro por usuario */
      /* Filtro los reclamos por el tipo y el estado pero sin fecha */
      if ((this.tipoReclamoCtrl.value !='' && this.estadoReclamoCtrl.value!='') && this.fechaDesdeCtrl.value=='') {
  
      
        
        this.detalleReclamo.getDetalleReclamoFiltradoUsuario(filtroIDTReclamo,filtroIDEstadoReclamo,this.usuario.idRol,this.usuario.idUsuario).subscribe(
            (res) => {
              this.formTarjetas.reset();
              this.Dreclamos =[];
              
              this.banderaIconoCarga =false; /* No se visualiza */
              this.banderaAlerta=false;/* No se visualiza */
              this.Dreclamos = res;
              
              console.log(this.Dreclamos);
              if (res.length == 0) {
                this.banderaAlerta=true;
                this.banderaIconoCarga=false;
                this.mensajeRespuestaErrordeBusqueda();
              }
            },
            (err) => console.error(err)
          );

          /* Filtro los reclamos por el tipo y el estado pero con fecha */
      }else if ((this.tipoReclamoCtrl.value !='' && this.estadoReclamoCtrl.value!='') && this.fechaDesdeCtrl.value!=''){
        
        this.detalleReclamo.getDetalleReclamoPorfechaDelUsuario(filtroIDTReclamo,filtroIDEstadoReclamo,this.fechaDesdeCtrl.value+'',this.usuario.idRol,this.usuario.idUsuario)
          .subscribe(
            (res) => {
              this.formTarjetas.reset();
              this.Dreclamos =[];
              this.banderaIconoCarga =false; /* No se visualiza */
              this.banderaAlerta=false;/* No se visualiza */
              this.Dreclamos = res;
              console.log(this.Dreclamos);
              if (res.length == 0) {
                this.banderaAlerta=true;
                this.banderaIconoCarga=false;
                this.mensajeRespuestaErrordeBusqueda();
              }
            },
            (err) => console.error(err)
          );

      }else{
        this.banderaAlerta=true;
        this.banderaIconoCarga =false; 

        this.toastr.info(
          'No se puede realizar la acción deseada',
          '',
          {
            timeOut: 5000,
          
          }
        );
      }
    }
  }

  fechadehoy(){
    
    /* Fecha del fia de hoy, para mostrar los reclamos del este día */
    /* var today = new Date();
    var mes;
    var dia:any;

    mes=(today.getMonth()+1)
    if(mes>=1 || mes<=9){
      mes='0'+mes;
    }

    dia= (today.getDay());
    if(dia>=1 || dia<=9){
      dia= (today.getDay()+1);
      dia='0'+dia;
    }

    console.log("dia: "+dia);
    this.fecha = today.getFullYear() + '-' + mes+'-'+ dia; */
    
  }

  mensajeDelDia(){
    this.toastr.info(
      'No se registraron reclamos en el día de hoy','',
      {
        timeOut: 4000,
        positionClass:'toast-top-right'
      }
    );
  }

  mensajeRespuestaErrordeBusqueda(){
    this.toastr.info(
      'No se encuentran reclamos registrados para la busqueda seleccionada ',
      '',
      {
        timeOut: 5000,
       
      }
    );
  }

  verMapa(longitud:any, latitud:any, direccion:any){
    /* apreto el boton y automaticamente envio las coordenadas a la funcion verMapadesdeHistorial del menuComponent */
   
    if(longitud == null || latitud == null){
      this.toastr.info(
        'El reclamo seleccionado no posee una geolocalización,',
        '',
        {
          timeOut: 5000,
          positionClass: 'toast-bottom-full-width'
          
        }
      );
      
    }else{
      this.menuComponent.verMapadesdeHistorial(longitud,latitud,direccion)
      this.longitud='';
      this.latitud='';
      this.direccion=''
    }
  }

  vistaSwitchReclamos(){
    
    if (this.banderaVistaHistorial == true)
    {

      this.banderaVistaHistorial = false;

    }else{

      this.banderaVistaHistorial = true;
    }
  }

  cancelarReclamo(idReclamo:number, fecha:string, foto:any, hora:string,id_sesion:number, idTipoRec:number,idEstado:number){
    debugger
   
    debugger
    if(this.selectIDTipReclamo == idTipoRec || idTipoRec ==1 ){
      var reclamo: Reclamo = {
        IDReclamo: idReclamo,
        fecha: fecha,
        foto: foto,
        hora: hora,
        ID_Sesion: id_sesion,
        ID_TipoReclamo: idTipoRec,
        ID_Estado: 4, /* 4 - descartado - ambiental */
      };
      
      (window.confirm("¿Estás seguro de cancelar el reclamo?") ?
        this.detalleReclamo.putActualizarReclamo(reclamo).subscribe(
          (data) => {
            this.Dreclamos = [];
            this.getDetalleReclamosHoy();
          },
          (err) => {

          }
        ) : console.log("El usuario canceló la acción."))

    }else if(this.selectIDTipReclamo == idTipoRec || idTipoRec ==2){
      var reclamo: Reclamo = {
        IDReclamo: idReclamo,
        fecha: fecha,
        foto: foto,
        hora: hora,
        ID_Sesion: id_sesion,
        ID_TipoReclamo: idTipoRec,
        ID_Estado: 8, /* 8 - descartado - Vial */
      };

      (window.confirm("¿Estás seguro de cancelar el reclamo?") ?
        this.detalleReclamo.putActualizarReclamo(reclamo).subscribe(
          (data) => {
            this.Dreclamos = [];
            this.getDetalleReclamosHoy();
          },
          (err) => {

          }
        ) : console.log("El usuario canceló la acción."))


      alert('es vial')
    }
  }

  /* Paginacion en tablas */
    
    M_cambioPaginas(pagina:PageEvent){
      this.paginaDesde = pagina.pageIndex * pagina.pageSize;
      this.paginaHasta =  this.paginaDesde + pagina.pageSize;
    }
    cambiarPaginaLista(pagina: PageEvent){
      this.M_cambioPaginas(pagina)
    }
    cambiarPaginaTarjetas(pagina: PageEvent){
      this.M_cambioPaginas(pagina)
    }
    

}
