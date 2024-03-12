import { Component, OnInit} from '@angular/core';
import { BackenApiService } from 'src/app/service/backen-api.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TipoEstado } from 'src/app/model/Configuracion/tipoEstadoAdmin';
import { PostEstado } from 'src/app/model/Configuracion/estadosAdmin';
import { PerfilAdmin, putPerfilAdmin } from 'src/app/model/Configuracion/tipoPerfil';
import { TipoReclamo } from 'src/app/model/tipoReclamo';
import { estadosUsuarios, usuarioConfig } from 'src/app/model/usuario';
import { TipoVehiculoModal, putTipoVehiculo } from 'src/app/model/Configuracion/tipoVehiculo';
import { DatosVehiculo, autoPost, putVehiculo } from 'src/app/model/Configuracion/vehiculo';
import { postMarca, putMarca } from 'src/app/model/Configuracion/marcaVehiculo';
import { postModeloVehiculo, putModelo } from 'src/app/model/Configuracion/modeloVehiculo';
import { MenuApiService } from 'src/app/service/Menu/menu-api.service';
import { PageEvent } from '@angular/material/paginator';
import { PerfilApiService } from 'src/app/service/Perfil/perfil-api.service';
import { putUsuario } from 'src/app/model/perfil';
import { putTipoReclamo } from 'src/app/model/Configuracion/tipoReclamo';
import { localidad } from 'src/app/model/localidad';


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
  
    /* ---Configuración Tipo Estado ---  */
    objTipoEstado: any; /* Select */
    objEstadosDelTipo: any [] = []; /* Tabla */
    selectIDTipEstado = 0; /* Variable para capturar el valor del tipo de estado */

  /* ---Modal Tipo Estado ---  */
    objModalTipoEstado: any;
    selectIDTipEstadoModal = 0;

  /* ---Configuración Tipo Vehículo ---  */
    objTipVehiculo: any; /* Select */
    selectIDTipVehiculo = 0; /* Tabla */
    objListaTipVehiculos: any [] = [];
  
    /* ---Configuración Tipo Reclamo ---  */
    objTipoDeReclamo: any; /* Select */
    selectIDTipReclamo = 0; /* Variable para capturar el valor del tipo de reclamo */
    objListaTipoReclamo: any;
  
    /* ---Configuración Tipo Perfil ---  */
    objTipoPerfil: any [] = []; /* Select */
    selectIDTipPerfil = 0; /* Variable para capturar el valor del tipo de reclamo */
    objListaTipoPerfil: any;
  
     /* ---Configuración Marcas ---  */
    selectIDMarcaVehiculo=0;
    objListaMarcaVehiculo:any;
  
     /* ---Configuración Modelos---  */
    objListaModeloVehiculo:any;
    selectIDModeloVehiculo=0;
  
     /* ---Configuración Vehiculos ---  */
    objListaVehiculos:DatosVehiculo [] = [];
    objListaIDMarca:any;
    selecIDMarca=0;
    selecIDModelo=0;
    textoEstadoModal="Tipo de Estado";

     /* ---Configuración Usuarios ---  */
    objListaUsuarios:usuarioConfig [] = [];
    objEstadosUsuarios: estadosUsuarios [] = []; // estados activo inactivo
    idUsuario = 0;
    idEstadoUsuario = 0;
    objUsuarioSelect:any;
    ctrlNombreUsuario = new FormControl('',[Validators.required])
    ctrlNickUsuario = new FormControl('',[Validators.required])
    ctrlEstadoUsuario = new FormControl('',[Validators.required]);

     /* ---Configuración Localidad ---  */
     objListaLocalidades:localidad [] = [];
     ctrlNombreLocalidad = new FormControl('',[Validators.required]);
    


    /* ---Configuración Actualizacion Marca ---  */
    ctrlNombreMarca=new FormControl('',[Validators.required]);
    arrayMarca: any [] = []; // utilizada para almacenar el id y el nombre de la marca ingresada

    /* ---Configuración Actualizacion Modelo ---  */
    ctrlNombreModelo = new FormControl('',[Validators.required]);
    modeloSeleccionado :string ='';
    arrayModelo: any [] = []; 

     /* ---Configuración Actualizacion Perfil ---  */
     ctrlNombrePerfil = new FormControl('',[Validators.required]);
     arrayPutPerfil: any [] =[];

      /* ---Configuración Actualizacion Tipo Reclamo ---  */
     ctrlNombreTipoReclamo = new FormControl('',[Validators.required]);
     ctrlDescripcionTipoReclamo= new FormControl('',[Validators.required]);
     arrayPutTipoReclamo:any [] = [];

     /* ---Configuración Actualizacion Tipo vehiculo ---  */
     ctrlNombreTipoVehiculo = new FormControl('',[Validators.required]);
     ctrlDescripcionTipoVehiculo= new FormControl('',[Validators.required]);
     arrayPutTipoVehiculo:any [] = [];

    /* paginacion para las listas */
    pageSize = 5; // Tamaño de página predeterminado
    paginaDesde: number=0;
    paginaHasta: number =5;
  
    /* banderaTextEstado: boolean = false; */
    banderaSelectEstado: boolean = false; //false
  
    objListaEstadoVehiculo:any;
  
    banderaSwitch: boolean = false;
    animacionSwitch="";
  
    /* modal put vehiculo - actualizar */
    objVehiculoModal:any;



    /* Modal Usuario - Actualiar */
    nombrePersonaCtrl = new FormControl('', [Validators.required]);
    apellidoPersonaCtrl = new FormControl('', [Validators.required]);
    celularCtrl = new FormControl('', [Validators.required]);
    dniCtrl = new FormControl('', [Validators.required]);
    correoCtrl = new FormControl('', [Validators.required]);
    contraseniaCtrl = new FormControl('', [Validators.required]);
    nombreUsuarioCtrl = new FormControl('', [Validators.required]);
    fotoCtrl = new FormControl('', [Validators.required]);
    datosUsuario:any [] =[]
    banderaActualizarUsuario: boolean = false;
    estadoUsuario: number=0;
    /* Guardar foto de perfil para actualizar */
    imagePerfilDataUrl!:string;
  
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

  constructor(config: NgbModalConfig, private servicio: BackenApiService, private modal: NgbModal,private toastr: ToastrService, public serviceUsuario: MenuApiService, private servicePerfil:PerfilApiService) { 
    /* Configuracion del Modal */
    config.backdrop = 'static';
    config.keyboard = false;
    config.centered = true;
    

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
    this.getLocalidades();
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
    this.modal.open(content,{ size: 'lg' });
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
  visualizarModalUsuario(content: any, idUsuario:number) {
    this.modal.open(content,{ size: 'lg' });
    this.getDatosUsuarioSeleccionado(idUsuario);
  }

  /* Visualizar Modal para ACTUALIZAR */
  openPutModalVehiculo(putModalVehiculo:any,idvehiculo:number){
    this.modal.open(putModalVehiculo, { size: 'lg' });
    this.servicio.getActualizarModalVehiculo(idvehiculo).subscribe(
      (res) => {
        this.objVehiculoModal=res;   
        console.log(this.objVehiculoModal)   
      },
      (err) => console.error(err)
    ) 
  }

  openPutModalMarca(putMarca:any, id:number, nombre:string){
    this.modal.open(putMarca, { size: 'lg' });
    this.arrayMarca[0] = id;
    this.arrayMarca[1] = nombre;
  }

  openPutModalModelo(putModelo:any){
    debugger
    if(this.selectModelo.value!=''){

      this.modal.open(putModelo, { size: 'lg' });
    this.arrayModelo[0] = this.selecIDModelo;
    this.arrayModelo[1] = this.modeloSeleccionado;
    }else{
      this.toastr.info(
        'Seleccione un modelo para realizar la modificaión deseada','',
        {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        }
      );
    }
  }

  openPutModalPerfil(putPerfil:any, idPerfil:number,nombre:string){
    debugger
    this.modal.open(putPerfil, { size: 'lg' });
    this.arrayPutPerfil[0] = idPerfil;
    this.arrayPutPerfil[1] = nombre;
  }

  openPutModalTipoReclamo(putTipReclamo:any, idTipoReclamo:number,nombre:string,descripcion:string){
    debugger
    this.modal.open(putTipReclamo, { size: 'lg' });
    this.arrayPutTipoReclamo[0] = Number(idTipoReclamo)
    this.arrayPutTipoReclamo[1] = nombre +'';
    this.arrayPutTipoReclamo[2] = descripcion +'';
  }
  openModalTipoVehiculo(putTipoVehiculo:any, idTipo:number,nombre:string,descripcion:string){
    this.modal.open(putTipoVehiculo,{ size: 'lg' })
    this.arrayPutTipoVehiculo[0] = Number(idTipo);
    this.arrayPutTipoVehiculo[1] = nombre +'';
    this.arrayPutTipoVehiculo[2] = descripcion +'';
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
  botonCerrarModal(){
    this.modal.dismissAll();
  }
  
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
    this.nombreModalPerfil.reset();
  }
  botonCerrarModalUsuario(){
    this.modal.dismissAll();
  }

  botonCerrarPutModalPerfil(){
    this.arrayPutPerfil = [];
    this.ctrlNombrePerfil.reset();
    this.modal.dismissAll();
  
  }

  botonCerrarPutModalMarca(){
    this.ctrlNombreMarca.reset();
    this.arrayMarca = [];
    this.modal.dismissAll();
  }
  botonCerrarPutModalModelo(){
    this.selecIDMarca=0;
    this.modeloSeleccionado = '';
    this.arrayModelo = [];
    this.ctrlNombreModelo.reset();
    this.modal.dismissAll();
  }

  botonCerrarPutModalTipoReclamo(){
    this.arrayPutTipoReclamo = []
    this.ctrlNombreTipoReclamo.reset();
    this.ctrlDescripcionTipoReclamo.reset();
    this.modal.dismissAll();
  }
  botonCerrarPutModalTipoVehiculo(){
    this.modal.dismissAll();
  }

  /* Metodos Get */

  getTipoEstado(){
    
    this.servicio.getTipoEstadoAdmin().subscribe(
      (res) => {
        
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
    //muestro los vehiculos en el carrusel de vehiculos
    if(this.selectIDMarcaVehiculo!=0 && this.selectIDModeloVehiculo!=0){
      debugger
      this.servicio.getConfiguracionVehiculos(this.selectIDMarcaVehiculo,this.selectIDModeloVehiculo).subscribe(
        (res) => {
          if(res.length!=0){
            this.objListaVehiculos = [];
           
            this.objListaVehiculos= res;
          }else{
            this.notificacionDatosInexistentes(res);
            this.selectIDMarcaVehiculo=0;
            this.selectIDModeloVehiculo=0;
             this.objListaVehiculos = []
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

  /* Este metodo se accionara en el momento en se abre la pestaña de USUARIOS ' para no sobrecargar de peticiones al abrir la pestaña de configuración */
  getusuarios(){
   
    this.servicio.getUsuarios().subscribe(
      (data)=>{
        console.log(data[0])
        this.objListaUsuarios = data;
        this.getEstadosUsuarios();
      },
      (err)=>{
        console.log(err)
      }
    )
  }
  // utilizado para rellenar el select en el cual se almacenan solo 2 estados activos e inactivos
  getEstadosUsuarios(){
    this.servicio.getEstadosFiltroUsuariosConfig('Usuario').subscribe(
      (data)=>{
        this.objEstadosUsuarios = data;
      },
      (err)=>{
        console.log(err)
      }
    )
  }

  // utilizado para rellenar el select en el cual se almacenan solo 2 estados activos e inactivos
  // utilizado para rellenar la tabla de configuracion localidades, mostrara todas las localidades y su pais
  getLocalidades(){
    this.servicio.getLocalidades().subscribe(
      (data)=>{
        console.log(data)
       this.objListaLocalidades = data ;
         },
      (err)=>{
        this.toastr.info(
          'No se encuentran localidades registradas','',
          {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          }
        );
      }
    )
  }

  btn_buscarUsuario(){
    debugger
    if(this.ctrlNombreUsuario.value =='' || this.ctrlNickUsuario.value=='' || this.ctrlEstadoUsuario.value == ''){
      this.toastr.info(
        'No ingresó los datos necesarios para realizar la busqueda','',
        {
          timeOut: 5000,
          positionClass: 'toast-top-right',
        }
      );
    }else{

      //hacer metodo para traer y mostrar el usuario



    }
  }

  btn_buscarLocalidad(){
    if(this.ctrlNombreLocalidad.value==''){
      this.toastr.info(
        'No ingresó los datos necesarios para realizar la busqueda','',
        {
          timeOut: 5000,
          positionClass: 'toast-top-right',
        }
      );
    }else{


      this.servicio.getFiltrarLocalidades(this.ctrlNombreLocalidad.value.toUpperCase()).subscribe(
        (data)=>{
          debugger
          if(data.length ==0){
            this.toastr.info(
              'La localidad '+this.ctrlNombreLocalidad.value+' no se encuentra registrada','',
              {
                timeOut: 5000,
                positionClass: 'toast-top-right',
              }
            );
          }else{
            this.objListaLocalidades = data ;
          }
          
         
          },
        (err)=>{
          this.toastr.info(
            'La localidad '+this.ctrlNombreLocalidad.value+' no se encuentra registrada','',
            {
              timeOut: 5000,
              positionClass: 'toast-top-right',
            }
          );
        }
      )




    }
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
    debugger
    this.selecIDModelo=0;
    this.selecIDModelo=ev.target.value;
     this.modeloSeleccionado = (ev.target as HTMLSelectElement).options[(ev.target as HTMLSelectElement).selectedIndex].text;
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
            debugger
            this.objListaTipVehiculos = res;
          }else{
            this.notificacionDatosInexistentes(res);
             this.objListaTipVehiculos =[]; // se cambio de obj:any a obj:any [] = [] y se elimino el delete
            this.selectIDTipVehiculo=0;
          }
          
        },
        (error) => console.error(error)
      );
    }else{
      this.NotificacionRellenarCampos();
    }
    
  }
  //por ahora no se usa, es para obtener la informacion de usuario selecionado
  obtenerIdUsuario(id:any){
  
    this.idUsuario = id.target.value;
    /* crear metodo para traer los datos del usuario - podria usar los datos del usuario que esta en objListausuario */
    this.servicio.getUsuarioSelecionado(this.idUsuario).subscribe(
      (data)=>{
        console.table(data[0])
        this.objUsuarioSelect = data[0];
        console.log(this.objUsuarioSelect)
      },
      (err) =>{
        console.log(err)
      }
    )
  }

  obtenerIdEstadoUsuario(idEstado:any){
    this.idEstadoUsuario = idEstado.target.value;
  }


  /* ****************************** Modal Estado ****************************** */
  botonCrearNuevoEstado() {
    
    /* Crear solo un tipo de estado */
    if(this.nombreEstadoCtrl.value!="" && this.selectIDTipEstadoModal == 0  && this.banderaSwitch==false){

      var nombreEstado ='';

      var TipEstado: TipoEstado={
        nombre: this.nombreEstadoCtrl.value,
      }
      debugger
      this.servicio.postTipoEstado(TipEstado).subscribe(
        (res) => {


          this.postEstado(res,'pendiente') // utilizado para crear un tipo de estaod con 4 estados por defecto
        },
        (err) => console.error(err)
      );


      /* Creo un estado con tipo de estado */
    }else if (this.nombreEstadoCtrl.value != '' && this.selectIDTipEstadoModal != 0 && this.banderaSwitch==true) {
      //En lugar de crear 4 estados por defecto acá creo uno personalizado para el tipo de estado seleccionado
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
  //creo un tipo de estado con los 4 estados por defecto - pendiente, en revision, solucionado, descartado
  postEstado(dataTipoEstado:any,nombreEstado:string){
    debugger
      var Estado: PostEstado={
        nombre: nombreEstado,
        id_TipoEstado: dataTipoEstado.idTipoEstado
      }
      
      this.servicio.postEstado(Estado).subscribe(
        (res) => {
          
        },
        (err) => console.error(err)
      )
      this.NotificacionEstadoCreado();
      this.limpiarModalEstado();
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

  botonActualizarVehiculo(){
    debugger
    if(this.nombreTipoVehiculoCtrl.value == "" || this.marcaCtrl.value=="" || this.modeloCtrl.value ==""
    || this.dominioCtrl.value == "" || this.colorCtrl.value == "" || this.numChasisCtrl.value == ""
    || this.numMotorCtrl.value == "" || this.listaEstadoVehiculoCtrl.value == "" ){
      this.toastr.info(
        'Por favor completa todos los campos antes de modificar el vehículo.','',
        {
          timeOut: 2000,
          positionClass: 'toast-top-right',
        }
      );
    }else{

      var vehiculo: putVehiculo = {
        IDVehiculo : this.objVehiculoModal[0].idVehiculo,
        dominio : this.dominioCtrl.value + '',
        color: this.colorCtrl.value +'',
        numeroChasis:this.numChasisCtrl.value+'',
        numeroMotor:this.numMotorCtrl.value + '',
        ID_MarcaVehiculo : Number(this.marcaCtrl.value),
        ID_Estado : Number(this.listaEstadoVehiculoCtrl.value),
        ID_TipoVehiculo : Number(this.nombreTipoVehiculoCtrl.value),
        ID_Modelo : Number(this.modeloCtrl.value),
      }
      debugger
      
      this.servicio.putVehiculoModal(vehiculo).subscribe(
        (data)=>{
          this.toastr.success(
            'Vehículo Mdificado!','',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
        },
        (err) =>{

        }
      )

      this.limpiarModalVehiculos(); 
      
      this.modal.dismissAll();
    }

  }

  /* ****************************** Modal Marca ****************************** */

  PostMarcaModal(){
    
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
              positionClass: 'toast-top-right',
            }
          );
          this.botonCerrarMarca();
        },
        (err)=>{
          this.toastr.error(
            'Ocurrio un error al crear la Marca!','Atención',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
        }
      )
    }
  }

  putMarcaAuto(){

    if(this.ctrlNombreMarca.value==""){
      this.toastr.info(
        'Por favor completa todos el campoo antes de modificar la marca.','',
        {
          timeOut: 2000,
          positionClass: 'toast-top-right',
        }
      );
    }else{
      var marca : putMarca ={
        
          idMarca: this.arrayMarca[0],
          nombre : this.arrayMarca[1]+'' ,
      
      }
      if(this.ctrlNombreMarca.value !=''){
        marca.nombre = this.ctrlNombreMarca.value +'';
      }

      this.servicio.putMarcaModal(marca).subscribe(
        (data)=>{

          this.toastr.success(
            'Marca Modificada!','Atención',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
          this.arrayMarca = []
          this.ctrlNombreMarca.reset();
          this.modal.dismissAll();

        },
        (err)=>{
          this.toastr.error(
            'Ocurrio un error al modificar la Marca!','Atención',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
        }
      )
    }

  }

  
  /* ****************************** Modal Modelos ****************************** */

  postModeloVehiculo(){
    
    if(this.nombreModalModelo.value === ''){

      this.NotificacionRellenarCampos();

    }else{
      var modelo:postModeloVehiculo={
        nombre:this.nombreModalModelo.value+'',
      }

      this.servicio.postModeloModal(modelo).subscribe(
        (res)=>{
          delete this.objListaModeloVehiculo;
          this.getModeloVehiculo();
          this.toastr.success(
            'Modelo Creado!','Atención',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
          this.botonCerrarModelo();      
        },
        (err)=>console.error()

      )
    }
  }

  putModelo(){
    debugger
    if(this.ctrlNombreModelo.value==''){
      this.toastr.info(
        'Complete el campo para realizar la modificación!','Atención',
        {
          timeOut: 2000,
          positionClass: 'toast-top-right',
        }
      );
    }else{
      debugger
      var modeloAuto: putModelo ={
        idModelo : Number(this.arrayModelo[0]),
        nombre :this.arrayModelo[1]+'',
      }

      if(this.ctrlNombreModelo.value!=''){
        modeloAuto.nombre = this.ctrlNombreModelo.value +'';
      }

      this.servicio.putModeloModal(modeloAuto).subscribe(
        (data) => {

          this.toastr.success(
            'Modelo de vehículo modificado','',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
          this.selecIDMarca=0;
          this.modeloSeleccionado = '';
          this.arrayModelo = [];
          this.ctrlNombreModelo.reset();
          
          this.modal.dismissAll()
        },
        (err) =>{
          this.toastr.warning(
            'Ocurrió un problema al modificar el Modelo seleccionado','',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
        }
      )



    
    }


  }


  /* ****************************** Modal Perfil ****************************** */
  botonCrearPerfilModal(){
    
    if(this.nombreModalPerfil.value!=''){

      var objPerfil:PerfilAdmin={
        nombre : this.nombreModalPerfil.value,
      }
      this.servicio.postPerfilModal(objPerfil).subscribe(
        (resp)=>{
           this.objTipoPerfil = []; // se cambio el delete
          this.getTipoPerfil();
        },
        (err) => console.error(err)
      )
      debugger
      this.NotificacionPerfilCreado();

    }else{
      this.NotificacionRellenarCampos();
    }

  }
  putPerfil(){
    debugger
    if(this.ctrlNombrePerfil.value==''){
      this.toastr.info(
        'Complete el campo para realizar la modificación!','Atención',
        {
          timeOut: 2000,
          positionClass: 'toast-top-right',
        }
      );
    }else{
      debugger
      var putPerfil:putPerfilAdmin = {
        idPerfil: this.arrayPutPerfil[0],
        nombre: this.arrayPutPerfil[1],
      }
      if(this.ctrlNombrePerfil.value!=''){
        putPerfil.nombre = this.ctrlNombrePerfil.value +'';
      }
      this.servicio.putPerfilModal(putPerfil).subscribe(
        (data)=>{

          this.toastr.success(
            'Perfil de Usuario Modificado!','',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
          this.arrayPutPerfil = [];
          this.ctrlNombrePerfil.reset();
          this.modal.dismissAll();
        },
        (err)=>{
          this.toastr.warning(
            'Ocurrió un problema al modificar el Perfil de Usuario','',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
        }
      )
    }
  }

  /* ****************************** Modal Tipo Reclamo ****************************** */
  botonCrearNuevoTipoReclamo() {
    
    if (this.nombreTipoReclamoCtrl.value != '' && this.descripcionTipoReclamoCtrl.value!='') {

      var tipoRec: TipoReclamo ={
        nombre: this.nombreTipoReclamoCtrl.value,
        descripcion: this.descripcionTipoReclamoCtrl.value,
      }
      
      this.servicio.postTipoReclamoModal(tipoRec).subscribe(
        (resp)=>{
          delete this.objTipoDeReclamo;
          this.getTipoReclamo();    
        },
        (err) => console.error(err)
      ) 
      this.NotificacionTipoReclamoCreado();
    } else {
      this.NotificacionRellenarCampos();
    }
  }

  putTipoReclamo(){
    debugger
    if(this.ctrlNombreTipoReclamo.value =='' || this.ctrlDescripcionTipoReclamo.value == ''){
      this.toastr.info(
        'Complete el campo para realizar la modificación!','Atención',
        {
          timeOut: 2000,
          positionClass: 'toast-top-right',
        }
      );
    }else{
      debugger
      var putTipoReclamo : putTipoReclamo ={
        idTipoReclamo : this.arrayPutTipoReclamo[0],
        nombre : this.arrayPutTipoReclamo[1],
        descripcion: this.arrayPutTipoReclamo[2]
      }

      if(this.ctrlNombreTipoReclamo.value !=''){
        putTipoReclamo.nombre = this.ctrlNombreTipoReclamo.value +'';
      }
      if(this.ctrlDescripcionTipoReclamo.value!=''){
        putTipoReclamo.descripcion = this.ctrlDescripcionTipoReclamo.value+'';
      }

      this.servicio.putTipoReclamoModal(putTipoReclamo).subscribe(
        (data)=>{

          this.toastr.success(
            'Tipo de Reclamo Modificado!','',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );

          this.arrayPutTipoReclamo = []
          this.ctrlNombreTipoReclamo.reset();
          this.ctrlDescripcionTipoReclamo.reset();
          this.modal.dismissAll();
        },
        (err)=>{
          this.toastr.warning(
            'Ocurrió un problema al modificar el Tipo de Reclamo','',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
        }
      )


    }
  }
  /* ******************************  Modal Tipo Vehiculo ****************************** */
  botonCrearTipoVehiculoModal(){
    
    if(this.nombreTipoVehiculoCtrlModal.value!='' && this.descripcionTipoVehiculoModal.value!=''){

      var objTipoVehiculo:TipoVehiculoModal ={
        nombre: this.nombreTipoVehiculoCtrlModal.value,
        descripcion: this.descripcionTipoVehiculoModal.value,
      }
      debugger
      this.servicio.postTipoVehiculoModal(objTipoVehiculo).subscribe(
        (resp)=>{
           delete this.objTipVehiculo;
           this.getTipoVehiculo();
        },
        (err) => console.error(err)
      )
      
      this.NotificacionTipoVehiculoCreado();
    }else{
      this.NotificacionRellenarCampos();
    }
  }

  putTipoVehiculo(){
    if(this.ctrlNombreTipoVehiculo.value == '' || this.ctrlDescripcionTipoVehiculo.value == ''){
      this.toastr.info(
        'Complete los campo para realizar la modificación!','Atención',
        {
          timeOut: 2000,
          positionClass: 'toast-top-right',
        }
      );
    }else{

      var putTipVehiculo : putTipoVehiculo ={
        idTipoVehiculo: this.arrayPutTipoVehiculo[0],
        nombre: this.arrayPutTipoVehiculo[1],
        descripcion: this.arrayPutTipoVehiculo[2]
      }

      if(this.ctrlNombreTipoVehiculo.value != ''){
        putTipVehiculo.nombre = this.ctrlNombreTipoVehiculo.value +'';
      }
      if(this.ctrlDescripcionTipoVehiculo.value !=''){
        putTipVehiculo.descripcion = this.ctrlDescripcionTipoVehiculo.value +'';
      }

      this.servicio.putTipoVehiculoModal(putTipVehiculo).subscribe(
        (data)=>{

          this.toastr.success(
            'Tipo de Vehículo Modificado!','',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );

          this.arrayPutTipoVehiculo = [];
          this.ctrlNombreTipoVehiculo.reset();
          this.ctrlDescripcionTipoVehiculo.reset();
          this.modal.dismissAll();
        },
        (err)=>{
          this.toastr.warning(
            'Ocurrió un problema al modificar el Tipo de Vehículo','',
            {
              timeOut: 2000,
              positionClass: 'toast-top-right',
            }
          );
        }
      )


    }

  }
 
   /* ******************************  Modal Usuario ****************************** */

   getDatosUsuarioSeleccionado(idUsuario:number){
    /* Datos del usuario seleccionado */
    this.servicePerfil.getdatosPerfil(idUsuario).subscribe(
      (data)=>{
        this.datosUsuario=data;/* almacenado para utilizar en el metodo actualizarUsuario */
        console.log(this.datosUsuario)
      }
    )
   }

   formularioUsuario(){
    if(this.banderaActualizarUsuario == false){
      this.banderaActualizarUsuario = true;
    }else{
      this.banderaActualizarUsuario = false;
      this.limpiarFormulario();
    }
   }
   limpiarFormulario() {
    this.nombrePersonaCtrl.reset()
    this.apellidoPersonaCtrl.reset()
    this.celularCtrl.reset()
    this.dniCtrl.reset()
    this.correoCtrl.reset()
    this.contraseniaCtrl.reset()
    this.nombreUsuarioCtrl.reset()
  }
  obtenerIDestadoModalUsuario(id:any){
    this.estadoUsuario = id.target.value;
  }
   actualizarUsuario(){
    let putUser: putUsuario = {
      IDUsuario: this.datosUsuario[0].idUsuario,
      Nombre: '',
      Apellido: '',
      DNI: '',
      Correo: '',
      Nick: '',
      Celular: '',
      Contrasenia: '',
      id_Perfil: this.datosUsuario[0].id_Perfil,
      id_Estado: this.datosUsuario[0].id_Estado,
      foto: '',
    }
   }

   /* ---------------------- Input file ----------------------*/
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
      this.imagePerfilDataUrl = reader.result as string;
      
      
      // Aquí puedes realizar acciones adicionales con la imagen,
      // como enviarla al servidor o mostrarla en la interfaz de usuario.
    };
    reader.readAsDataURL(file);
  }
  /* ---------------------- Fin Input file ----------------------*/
  /* ******************************  FIN Modal Usuario ****************************** */
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

    this.botonCerrarModalPerfil();
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

  /* Paginacion en tablas */
    /* Usuario */
    M_cambioPaginas(pagina:PageEvent){
      this.paginaDesde = pagina.pageIndex * pagina.pageSize;
      this.paginaHasta =  this.paginaDesde + pagina.pageSize;
    }
    
    cambiarPaginaEstados(pagina: PageEvent){
      this.M_cambioPaginas(pagina)
    }
    cambiarPaginaPerfiles(pagina: PageEvent){
      this.M_cambioPaginas(pagina)
    }
    cambiarPaginaTiposVehiculos(pagina: PageEvent){
      this.M_cambioPaginas(pagina)
    }
    cambiarPaginaUsario(pagina: PageEvent){
      this.M_cambioPaginas(pagina)
    }
    cambiarPaginaULocalidad(pagina: PageEvent){
      this.M_cambioPaginas(pagina)
    }

    /* Metodos para buscar usuarios */
    /* m_buscarUsuario(nombre:any){
      nombre = nombre.target.value;
      if(nombre==''){

      }else{
        this.objListaUsuarios.find(nombre);
      }

    } */

}
