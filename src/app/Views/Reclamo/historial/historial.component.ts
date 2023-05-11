import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EstadoReclamo } from 'src/app/model/filtrosHistorial/estadoReclamo';
import { TipoReclamo } from 'src/app/model/tipoReclamo';
import { LoginApiService } from 'src/app/service/Login/login-api.service';
import { MenuApiService } from 'src/app/service/Menu/menu-api.service';
import { BackenApiService } from 'src/app/service/backen-api.service';


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
  /* IDRol: any; */
  IDSesion: any;

  Dreclamos: any;
  TR: TipoReclamo[] = []; /* le asigno el nombre del modelo a una variable */
  /* tiene que ser el mismo nombre sino angular no encuentra el modelo */

  estadosReclamoFiltro: any;
  fecha:any;

  public FER: EstadoReclamo[] = []; /* filtro estadoRecmo.ts */

  selectIDTipReclamo = 0; /* Variable para capturar el valor del tipo de reclamo */
  selectIDEstadoReclamo = 0; /* Variable para capturar el id del estado del tipo de reclamo */
 
  objetoReclamo: any;

   filtroNombreUsuario:string=""; //se va usar para filtrar por nombre de usuario (hacer una validacion al crear el usuario, que no haya 2 usuarios con el mismo nombre )

   banderaIconoCarga:boolean =true;
   banderaAlerta:boolean=false;
   mensajeCarga:string='No Hay Reclamos...';

   usuario = {
    idUsuario: 0,
    nick: '',
    idRol: 0,
    rol: '',
    IDsesion:0,
  }
  constructor( public serviceUsuario: MenuApiService, public serviceLogin: LoginApiService,  public detalleReclamo:BackenApiService, private router:Router) 
  {

    this.rutaURL = window.location.pathname.split('/');
    this.usuario.idUsuario = this.rutaURL[2];
    this.getRolUsuario();
    this.fechadehoy();
    this.getTipoReclamo();
    this.getDetalleReclamosHoy(); /* Traer los reclamos del dia de hoy */
   }

  ngOnInit(): void {
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

  
  getDetalleReclamosHoy() {
    
    if (this.usuario.idRol == 1 || this.usuario.idRol == 2) {
      this.detalleReclamo.getHistorialHoy(this.fecha,this.usuario.idUsuario,1,5,this.usuario.idRol).subscribe(
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
     
      this.detalleReclamo.getHistorialHoy(this.fecha,this.usuario.idUsuario,1,5,this.usuario.idRol).subscribe( /* getDetalleReclamoUsuario(this.IDUsuario, 1) */
        (info) => {
          
          this.banderaIconoCarga=false;
          this.Dreclamos = info;
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
    }
  }

  getTipoReclamo(): void {
    this.detalleReclamo.getTipoReclamo().subscribe(
      (res) => {
        this.TR =
          res; /* res es la respuesta del servidor con todos los objetos y sus datos */
        console.log('Recla:', this.TR);
      },
      (err) => console.error(err)
    );
  }

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
    debugger
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
    this.router.navigate(['menu',this.usuario.idUsuario,'historial','reclamo',idDetalleReclamo]);
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
              delete this.Dreclamos;

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
          /* Busqueda por tipo reclamo, estado y nombre (no ingresó la fecha) */
      }else if((this.tipoReclamoCtrl.value != '' && this.estadoReclamoCtrl.value!='') &&  this.nombreUsuarioCtrl.value!='' && this.fechaDesdeCtrl.value==''){
        filtroIDTReclamo = this.selectIDTipReclamo;
        filtroIDEstadoReclamo = this.selectIDEstadoReclamo;
        this.detalleReclamo
          .getDetalleReclamoFiltradoNombre(filtroIDTReclamo, filtroIDEstadoReclamo,this.nombreUsuarioCtrl.value+'').subscribe(
            (res) => {
              this.formTarjetas.reset();
              delete this.Dreclamos;
              
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
            delete this.Dreclamos;//borro el objeto con toda la informacion
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
        ;
        this.detalleReclamo.getDetalleReclamoPorfecha(Number(this.tipoReclamoCtrl.value),Number(this.estadoReclamoCtrl.value),this.fechaDesdeCtrl.value+'',this.usuario.idRol).subscribe(
          (res)=>{
            
            this.formTarjetas.reset();//elimino las tarjetas
            delete this.Dreclamos;//borro el objeto con toda la informacion
            this.banderaIconoCarga =false;
            this.banderaAlerta=false;
            this.Dreclamos = res;
            
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
        
        this.detalleReclamo.getDetalleReclamoPorfechayNombreUsuario(Number(this.tipoReclamoCtrl.value),Number(this.estadoReclamoCtrl.value),this.fechaDesdeCtrl.value+'',this.usuario.idRol,this.nombreUsuarioCtrl.value+'').subscribe(
          (res)=>{
            
            this.formTarjetas.reset();//elimino las tarjetas
            delete this.Dreclamos;//borro el objeto con toda la informacion
            this.banderaIconoCarga =false;
            this.banderaAlerta=false;
            this.Dreclamos = res;
            
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

       /*  this.toastr.info(
          'No se puede realizar la accion deseasa',
          'Atención',
          {
            timeOut: 5000,
            progressBar: true,
          }
        ); */
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

    } else if(this.usuario.idRol==3)  {
      debugger
      filtroIDTReclamo = this.selectIDTipReclamo;
      filtroIDEstadoReclamo = this.selectIDEstadoReclamo;
      filtroFechaInicio = this.fechaDesdeCtrl.value;
      filtroFechaFin = this.fechaHastaCtrl.value;
      /* Filtro por usuario */
      /* Filtro los reclamos por el tipo y el estado pero sin fecha */
      if ((this.tipoReclamoCtrl.value !='' && this.estadoReclamoCtrl.value!='') && this.fechaDesdeCtrl.value=='') {
  
        debugger
        
        this.detalleReclamo
          .getDetalleReclamoFiltradoUsuario(filtroIDTReclamo,filtroIDEstadoReclamo,this.usuario.idRol,this.usuario.idUsuario)
          .subscribe(
            (res) => {
              this.formTarjetas.reset();
              delete this.Dreclamos;
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
              delete this.Dreclamos;
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

        /* this.toastr.info(
          'No se puede realizar la accion deseasa',
          'Atención',
          {
            timeOut: 5000,
            progressBar: true,
          }
        ); */
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
    this.fecha = formatDate(new Date(), 'yyyy-MM-dd', 'en-US')
  }

  mensajeDelDia(){
   /*  this.toastr.info(
      'No se encuentran reclamos registrados en el dia de hoy ',
      'Atención',
      {
        timeOut: 3000,
        progressBar: true,
      }
    ); */
  }

  mensajeRespuestaErrordeBusqueda(){
  /*   this.toastr.info(
      'No se encuentran reclamos registrados para la busqueda seleccionada ',
      'Atención',
      {
        timeOut: 5000,
        progressBar: true,
      }
    ); */
  }

}
