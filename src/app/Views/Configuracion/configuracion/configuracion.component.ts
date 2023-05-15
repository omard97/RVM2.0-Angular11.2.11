import { Component, OnInit } from '@angular/core';
import { BackenApiService } from 'src/app/service/backen-api.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TipoEstado } from 'src/app/model/Configuracion/tipoEstadoAdmin';
import { PostEstado } from 'src/app/model/Configuracion/estadosAdmin';
import { PerfilAdmin } from 'src/app/model/Configuracion/tipoPerfil';
import { TipoReclamo } from 'src/app/model/tipoReclamo';
import { TipoVehiculoModal } from 'src/app/model/Configuracion/tipoVehiculo';
import { autoPost } from 'src/app/model/Configuracion/vehiculo';
import { postMarca } from 'src/app/model/Configuracion/marcaVehiculo';
import { postModeloVehiculo } from 'src/app/model/Configuracion/modeloVehiculo';
import { MenuApiService } from 'src/app/service/Menu/menu-api.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
   /* Modal Estados */
   nombreEstadoCtrl = new FormControl('', [Validators.required]);
   /*  nombreTipoEstadoCtrl = new FormControl('', [Validators.required]); */
    listaTipoEstadoCtrl = new FormControl('', [Validators.required]);
    nombreTipoReclamoCtrl = new FormControl('', [Validators.required]);
    descripcionTipoReclamoCtrl = new FormControl('',[Validators.required])
    switchTipoEstadoCtrl = new FormControl('',[Validators.required])
  
    /* Modal Vehiculo */
    nombreTipoVehiculoCtrl = new FormControl('', [Validators.required]);
   
    dominioCtrl = new FormControl('', [Validators.required]);
    marcaCtrl = new FormControl('', [Validators.required]);
    modeloCtrl = new FormControl('', [Validators.required]);
    colorCtrl = new FormControl('', [Validators.required]);
    numChasisCtrl = new FormControl('', [Validators.required]);
    numMotorCtrl = new FormControl('', [Validators.required]);
    listaEstadoVehiculoCtrl = new FormControl('', [Validators.required]);
  
    nombreModalMarcaCrtl = new FormControl('', [Validators.required]);
    nombreModalModelo = new FormControl('', [Validators.required]);
  
    nombreModalPerfil = new FormControl('', [Validators.required]);
  
    selectMarcaVehiculo = new FormControl('', [Validators.required]);
    selectModeloVehiculo = new FormControl('',[Validators.required]);
  
    selectMarca = new FormControl('',[Validators.required]);
    selectModelo=new FormControl('',[Validators.required]);
  
    /* Modal TipoVehiculo */
    descripcionTipoVehiculoModal = new FormControl('', [Validators.required]);
    nombreTipoVehiculoCtrlModal = new FormControl('', [Validators.required]);
    
  
    objTipoEstado: any; /* Select */
    objEstadosDelTipo: any; /* Tabla */
    selectIDTipEstado = 0; /* Variable para capturar el valor del tipo de estado */
  
    objModalTipoEstado: any;
    selectIDTipEstadoModal = 0;
  
    objTipVehiculo: any; /* Select */
    selectIDTipVehiculo = 0; /* Tabla */
    objListaTipVehiculos: any;
  
    objTipoDeReclamo: any; /* Select */
    selectIDTipReclamo = 0; /* Variable para capturar el valor del tipo de reclamo */
    objListaTipoReclamo: any;
  
    objTipoPerfil: any; /* Select */
    selectIDTipPerfil = 0; /* Variable para capturar el valor del tipo de reclamo */
    objListaTipoPerfil: any;
  
    selectIDMarcaVehiculo=0;
    objListaMarcaVehiculo:any;
  
    objListaModeloVehiculo:any;
    selectIDModeloVehiculo=0;
  
    objListaVehiculos:any;
    objListaIDMarca:any;
    selecIDMarca=0;
    selecIDModelo=0;
    textoEstadoModal="Tipo de Estado";
  
    /* banderaTextEstado: boolean = false; */
    banderaSelectEstado: boolean = false; //false
  
    objListaEstadoVehiculo:any;
  
    banderaSwitch: boolean = false;
    animacionSwitch="";
  
    /* modal put vehiculo - actualizar */
    objVehiculoModal:any;
  
    ruta: any;
    /* IDUsuario: any; */
    /* IDRol: any; */
    IDSesion: any;

    usuario = {
      idUsuario: 0,
      nick: '',
      idRol: 0,
      rol: '',
      IDsesion:0,
    }

  constructor(config: NgbModalConfig, private servicio: BackenApiService, private modal: NgbModal,private toastr: ToastrService, public serviceUsuario: MenuApiService) { 
    /* Configuracion del Modal */
    config.backdrop = 'static';
    config.keyboard = false;
    config.centered = true;
    debugger

    //Obtengo la URL y la separo en base a los / en lo que al final obtengo un array
    this.ruta = window.location.pathname.split('/');
    this.usuario.idUsuario = this.ruta[2];

    this.getRolUsuario();

   
    this.getTipoEstado();

    this.getTipoReclamo();
    this.getTipoVehiculo();
    this.getTipoPerfil();
    this.getMarcaVehiculo();
    this.getModeloVehiculo();
    this.getIdEstadoVehiculoModal();
  }

  ngOnInit(): void {
  }

   /* utilizado solamente para visualizar etiquetas que dependen del rol del usuario */
   getRolUsuario() {
    debugger
    this.serviceUsuario.getRolUsuario(this.usuario.idUsuario).subscribe(
      (data) => {
        debugger
          this.usuario.idUsuario= data[0].idUsuario,
          this.usuario.nick= data[0].nick,
          this.usuario.idRol = data[0].idRol,
          this.usuario.rol=data[0].rol
          
         
          
      },
      (error) => {
        console.error(error);
      }
    )

}
  
  /* Visualizar el modal nuevo estado */
  visualizarModal(content: any) {
    this.modal.open(content);
  }
  visualizarModalTiposReclamos(content: any) {
    this.modal.open(content);
  }
  visualizarModalTiposVehiculos(content: any) {
    this.modal.open(content);
  }
  visualizarModalVehiculos(content: any) {
    this.modal.open(content);
  }
  visualizarModalMarca(content: any) {
    this.modal.open(content);
  }
  visualizarModalModelo(content: any) {
    this.modal.open(content);
  }
  visualizarModalPerfil(content: any) {
    this.modal.open(content);
  }

  /* Visualizar Modal para ACTUALIZAR */
  openPutModalVehiculo(putModalVehiculo:any,idvehiculo:number){
    this.modal.open(putModalVehiculo);
    
    this.servicio.getActualizarModalVehiculo(idvehiculo).subscribe(
      (res) => {
        this.objVehiculoModal=res;
        console.log(this.objVehiculoModal)
        
      },
      (err) => console.error(err)

    )
    
  }

  /* metodo para visualizar input del modal nuevo estado */
  /* visualizarInput() {
    debugger;
    if (this.banderaTextEstado == false) {
      
      this.banderaTextEstado = true;
      
      this.banderaSelectEstado = true;
      this.selectIDTipEstadoModal = 0;
    }
  } */

  /* Cerrar Modales  */
  botonCerrarNuevoEstado() {
    this.limpiarModalEstado();
  }
  botonCerrarTipoReclamo() {
    this.nombreTipoReclamoCtrl.setValue('');
    this.descripcionTipoReclamoCtrl.setValue('');
    this.modal.dismissAll();
    
  }
  botonCerrarNuevoTipoVehiculoModal() {
    this.nombreTipoVehiculoCtrlModal.setValue('');
    this.descripcionTipoVehiculoModal.setValue('');
    this.modal.dismissAll();
  }
  botonCerrarVehiculo() {
    this.modal.dismissAll();
    this.limpiarModalVehiculos();
  }
  botonCerrarMarca() {
    this.nombreModalMarcaCrtl.setValue('');
    this.modal.dismissAll();
  }
  botonCerrarModelo() {
    this.nombreModalModelo.setValue('');
    this.modal.dismissAll();
  }
  botonCerrarModalPerfil(){
    this.modal.dismissAll();
    this.nombreModalPerfil.setValue('');
  }


  /* Metodos Get */

  getTipoEstado(){
    debugger
    this.servicio.getTipoEstadoAdmin().subscribe(
      (res) => {
        debugger
        if(res.length!=0){
          this.objTipoEstado = res;
          this.objModalTipoEstado = res;

         


        }else{
          this.notificacionDatosInexistentes(res);
          delete this.objTipoEstado
          delete this.objModalTipoEstado
        }
        

      },
      (error) => console.error(error)
    );
  }
  
  GetBuscarVehiculos(){
    
    if(this.selectIDMarcaVehiculo!=0 && this.selectIDModeloVehiculo!=0){

      this.servicio.getConfiguracionVehiculos(this.selectIDMarcaVehiculo,this.selectIDModeloVehiculo).subscribe(
        (res) => {
          if(res.length!=0){
            debugger
            this.objListaVehiculos= res;
          }else{
            this.notificacionDatosInexistentes(res);
            this.selectIDMarcaVehiculo=0;
            this.selectIDModeloVehiculo=0;
            delete this.objListaVehiculos
            this.selectMarcaVehiculo.setValue('');
            this.selectModeloVehiculo.setValue('');
          }
          
         
        },
        (error) => console.error(error)
      )
    }else{
      this.NotificacionRellenarCampos();
    }

    
  }

  getMarcaVehiculo(){
    /* Se utiliza en vehiculo y marca */
    this.servicio.getMarca().subscribe(
      (res) => {
      this.objListaMarcaVehiculo = res;
     
    },
    (error) => console.error(error)
    );
  }

  getModeloVehiculo(){
    /* Se utiliza en vehiculo y modelo */
    this.servicio.getModelo().subscribe(
      (res) => {
      this.objListaModeloVehiculo = res;
      
    },
    (error) => console.error(error)
    );
  }

  getTipoVehiculo() {
    /* Relleno del select tipo vehiculo */
    this.servicio.getTipVehiculo().subscribe(
      (res) => {
        this.objTipVehiculo = res;
        
      },
      (error) => console.error(error)
    );
  }

  getTipoReclamo(): void {
    this.servicio.getTipoReclamo().subscribe(
      (res) => {
        this.objTipoDeReclamo = res;


        

      },
      (err) => console.error(err)
    );
  }

  getTipoPerfil(): void {
    this.servicio.getTipoPerfil().subscribe(
      (res) => {
        this.objTipoPerfil = res;
        
      },
      (err) => console.error(err)
    );
  }

  /* Metodos para obtener los valores de los selec */
  obtenerIDTipoEstado(ev: any) {
    this.selectIDTipEstado = 0;
    this.selectIDTipEstado = ev.target.value;
    if(this.selectIDTipEstado!=0){
      this.servicio.getEstadosDelTipo(this.selectIDTipEstado).subscribe(
        (res) => {
          this.objEstadosDelTipo = res;
  
          this.notificacionDatosInexistentes(res);
        },
        (error) => console.error(error)
      );

    }
    
  }

  obtenerIDMarcaVehiculo(ev: any){
    this.selectIDMarcaVehiculo=0;
    this.selectIDMarcaVehiculo=ev.target.value;
    console.log("marca vehiculo: "+this.selectIDMarcaVehiculo)
  }

  obtenerIDModeloVehiculo(ev:any){
    this.selectIDModeloVehiculo=0;
    this.selectIDModeloVehiculo=ev.target.value;
    console.log("modelo Vehiculo: "+this.selectIDModeloVehiculo)
  }

  obtenerIDMarca(ev:any){
    this.selecIDMarca=0;
    this.selecIDMarca=ev.target.value;
    this.servicio.getIDMarca(this.selecIDMarca).subscribe(
      (res) => {
        this.objListaIDMarca= res;
      },
      (error) => console.error(error)
    );
  }

  obtenerIDModelo(ev:any){
    this.selecIDModelo=0;
    this.selecIDModelo=ev.target.value;
    console.log("modelo: "+this.selecIDModelo)
  }

  obtenerIDTipoPerfil(ev: any) {
    this.selectIDTipPerfil = 0;
    this.selectIDTipReclamo = ev.target.value;
  }

  obtenerIDTipoReclamo(ev: any) {
    this.selectIDTipReclamo = 0;

    this.selectIDTipReclamo = ev.target.value;
    console.log(this.selectIDTipReclamo);
    this.servicio.getListaTiposReclamos(this.selectIDTipReclamo).subscribe(
      (res) => {
        this.objListaTipoReclamo = res;
      },
      (err) => console.error(err)
    );
  }

  obtenerIDTipoVehiculo(dato: any) {
    this.selectIDTipVehiculo = 0;
    /* selecciono un tipo y muestro la lista de esos tipos de vehiculos */
    this.selectIDTipVehiculo = dato.target.value;

    if( this.selectIDTipVehiculo!=0){

      

      this.servicio.getListaTiposVehiculos(this.selectIDTipVehiculo).subscribe(
        (res) => {

          if(res.length!=0){
            this.objListaTipVehiculos = res;
          }else{
            this.notificacionDatosInexistentes(res);
            delete this.objListaTipVehiculos;
            this.selectIDTipVehiculo=0;
          }
          
        },
        (error) => console.error(error)
      );
    }else{
      this.NotificacionRellenarCampos();
    }
    
  }

  /* Modal Estado */
  botonCrearNuevoEstado() {
    debugger;
    /* Crear solo un tipo de estado */
    if(this.nombreEstadoCtrl.value!="" && this.selectIDTipEstadoModal == 0  && this.banderaSwitch==false){

      var TipEstado: TipoEstado={
        nombre: this.nombreEstadoCtrl.value,
      }
      debugger
      this.servicio.postTipoEstado(TipEstado).subscribe(
        (res) => {
        },
        (err) => console.error(err)
      );
      this.NotificacionTipoEstadoCreado();
      this.limpiarModalEstado();

      /* Creo un estado con tipo de estado */
    }else if (this.nombreEstadoCtrl.value != '' && this.selectIDTipEstadoModal != 0 && this.banderaSwitch==true) {
      
      var Estado: PostEstado={
        nombre: this.nombreEstadoCtrl.value,
        id_TipoEstado: Number(this.selectIDTipEstadoModal)
      }
      
      this.servicio.postEstado(Estado).subscribe(
        (res) => {
          
        },
        (err) => console.error(err)
      )
      this.NotificacionEstadoCreado();
      this.limpiarModalEstado();
      
    } else {
      this.NotificacionRellenarCampos();
    }
  }
  obtenerIDTipoEstadoModal(ev: any) {
    this.selectIDTipEstadoModal = 0;
    this.selectIDTipEstadoModal = ev.target.value;
  }

  switchTipoEstadoModal() {
    if(this.banderaSwitch==false){
      this.banderaSwitch=true; /* Se visualiza */
      this.textoEstadoModal="Estado"
      this.selectIDTipEstadoModal = 0;
    }else{
      this.banderaSwitch=false;
      this.textoEstadoModal="Tipo de Estado";
      this.selectIDTipEstadoModal = 0;
      
    }
  }

  /* ****************************** Modal Vehiculo ****************************** */
  getIdEstadoVehiculoModal(){
    this.servicio.getidActivoVehiculo().subscribe(
      (res) => {
        this.objListaEstadoVehiculo= res;
      },
      (error) => console.error(error)
    );
  }

  botonCrearVehiculo() {
   
    if((this.nombreTipoVehiculoCtrl.value === null || this.dominioCtrl.value === null ||  this.marcaCtrl.value === null ||  this.modeloCtrl.value === null ||
      this.colorCtrl.value=== null || this.numChasisCtrl.value === null ||  this.numMotorCtrl.value===null ||  this.listaEstadoVehiculoCtrl.value === null)
      || 
      (this.nombreTipoVehiculoCtrl.value === '' || this.dominioCtrl.value === '' ||   this.marcaCtrl.value === '' ||   this.modeloCtrl.value === '' || 
      this.colorCtrl.value === '' ||  this.numChasisCtrl.value === '' ||   this.numMotorCtrl.value=== '' ||   this.listaEstadoVehiculoCtrl.value=== '')){

      this.NotificacionRellenarCampos();
    } else  {
     
      var auto: autoPost = {
        dominio: this.dominioCtrl.value,
        color: this.colorCtrl.value,
        numeroChasis:  this.numChasisCtrl.value+'',
        numeroMotor: this.numMotorCtrl.value+'',
        id_MarcaVehiculo: Number(this.marcaCtrl.value),
        id_Estado: Number(this.listaEstadoVehiculoCtrl.value),
        id_TipoVehiculo: Number(this.nombreTipoVehiculoCtrl.value),
        id_modelo: Number(this.modeloCtrl.value)
      }

      

      this.servicio.postVehiculoModal(auto).subscribe(
        (res)=>{     
        },
        (err)=> console.log(err)
        );

        this.toastr.success(
          'Vehiculo Creado!','Atención',
          {
            timeOut: 2000,
            positionClass: 'toast-bottom-center',
          }
        );
      this.limpiarModalVehiculos(); 
    } 
  }

  /* ****************************** Modal Marca ****************************** */

  PostMarcaModal(){
    debugger
    if(this.nombreModalMarcaCrtl.value===null || this.nombreModalMarcaCrtl.value ===''){
      this.NotificacionRellenarCampos();
    }else{ 
      var marca : postMarca={
        nombre: this.nombreModalMarcaCrtl.value,
      }

      this.servicio.postMarcaModal(marca).subscribe(
        (res)=>{
          res=res;
          this.toastr.success(
            'Marca Creada!','Atención',
            {
              timeOut: 2000,
              positionClass: 'toast-bottom-center',
            }
          );
          this.botonCerrarMarca();
        },
        (err)=>console.error()
      )
    }
  }

  
  /* ****************************** Modal Modelos ****************************** */

  postModeloVehiculo(){
    debugger
    if(this.nombreModalModelo.value === ''){

      this.NotificacionRellenarCampos();

    }else{
      var modelo:postModeloVehiculo={
        nombre:this.nombreModalModelo.value+'',
      }

      this.servicio.postModeloModal(modelo).subscribe(
        (res)=>{
          res=res
          this.toastr.success(
            'Modelo Creado!','Atención',
            {
              timeOut: 2000,
              positionClass: 'toast-bottom-center',
            }
          );
          this.botonCerrarModelo();      
        },
        (err)=>console.error()

      )
    }
  }


  /* ****************************** Modal Perfil ****************************** */
  botonCrearPerfilModal(){
    debugger
    if(this.nombreModalPerfil.value!=''){

      var objPerfil:PerfilAdmin={
        nombre : this.nombreModalPerfil.value,
      }
      this.servicio.postPerfilModal(objPerfil).subscribe(
        (resp)=>{
        },
        (err) => console.error(err)
      )
      this.NotificacionPerfilCreado();
      this.nombreModalPerfil.setValue('');


    }else{
      this.NotificacionRellenarCampos();
    }

  }

  /* ****************************** Modal Tipo Reclamo ****************************** */
  botonCrearNuevoTipoReclamo() {
    debugger
    if (this.nombreTipoReclamoCtrl.value != '' && this.descripcionTipoReclamoCtrl.value!='') {

      var tipoRec: TipoReclamo ={
        nombre: this.nombreTipoReclamoCtrl.value,
        descripcion: this.descripcionTipoReclamoCtrl.value,
      }
      
      this.servicio.postTipoReclamoModal(tipoRec).subscribe(
        (resp)=>{
          
        },
        (err) => console.error(err)
      ) 
      this.NotificacionTipoReclamoCreado();
    } else {
      this.NotificacionRellenarCampos();
    }
  }

  /* ******************************  Modal Tipo Vehiculo ****************************** */
  botonCrearTipoVehiculoModal(){
    debugger
    if(this.nombreTipoVehiculoCtrlModal.value!='' && this.descripcionTipoVehiculoModal.value!=''){

      var objTipoVehiculo:TipoVehiculoModal ={
        nombre: this.nombreTipoVehiculoCtrlModal.value,
        descripcion: this.descripcionTipoVehiculoModal.value,
      }
      this.servicio.postTipoVehiculoModal(objTipoVehiculo).subscribe(
        (resp)=>{ 
        },
        (err) => console.error(err)
      )
      this.NotificacionTipoVehiculoCreado();
    }else{
      this.NotificacionRellenarCampos();
    }
  }
 

  limpiarModalEstado() {
    /* cuando se cierra el modal o se crea el estado o el tipo de estado */
    this.banderaSwitch = false;
    this.textoEstadoModal="Tipo De Estado";
    this.selectIDTipEstadoModal = 0;
    this.nombreEstadoCtrl.setValue('');
    this.modal.dismissAll();
  }
  limpiarModalVehiculos() {
    this.nombreTipoVehiculoCtrl.setValue('');
    this.dominioCtrl.setValue('');
    this.marcaCtrl.setValue('');
    this.modeloCtrl.setValue('');
    this.colorCtrl.setValue('');
    this.numChasisCtrl.setValue('');
    this.numMotorCtrl.setValue('');
    this.listaEstadoVehiculoCtrl.setValue('');
  }

  limpiarModalTipoReclamos(){
    this.nombreTipoReclamoCtrl.setValue('');
    this.descripcionTipoReclamoCtrl.setValue('');
     this.modal.dismissAll();
  }
  
/* Notificaciones */
  NotificacionRellenarCampos() {
    this.toastr.warning(
      'Complete el formulario para realizar la operación!',
      'Atención',
      {
        timeOut: 2000,
        /* positionClass: 'toast-bottom-center', */
      }
    );
  }

  NotificacionEstadoCreado() {
    this.toastr.success('Estado creado!', 'Atención', {
      timeOut: 2000,
      positionClass: 'toast-bottom-center',
    });
  }
  NotificacionTipoEstadoCreado() {
    this.toastr.success(
      'Tipo De Estado Creado!',
      'Atención',
      {
        timeOut: 2000,
        positionClass: 'toast-bottom-center',
      }
    );
  }

  NotificacionPerfilCreado() {
    this.toastr.success(
      'Perfil creado!',
      'Atención',
      {
        timeOut: 2000,
        positionClass: 'toast-bottom-center',
      }
    );
  }
  NotificacionTipoReclamoCreado(){
    this.toastr.success(
      'Tipo De Reclam Creado!',
      'Atención',
      {
        timeOut: 2000,
        positionClass: 'toast-bottom-center',
      }
    );
    this.botonCerrarTipoReclamo();
  }

  NotificacionTipoVehiculoCreado(){
    this.toastr.success(
      'Tipo De Vehiculo Creado!',
      'Atención',
      {
        timeOut: 2000,
        positionClass: 'toast-bottom-center',
      }
    );
    this.botonCerrarNuevoTipoVehiculoModal();
  }

  notificacionDatosInexistentes(res:any){
    if(res.length==0){
      this.toastr.info(
        'No hay datos para la busqueda requerida',
        'Atención',
        {
          timeOut: 2000,
        }
      );
    }
  }

}
