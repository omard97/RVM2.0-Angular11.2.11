import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadosAdminConfig } from '../model/Configuracion/estadosAdmin';
import { TipoEstado } from '../model/Configuracion/tipoEstadoAdmin';
import { tipoEstadoVehiculo } from '../model/Configuracion/tipoEstadoVehiculo';
import { PerfilAdmin, putPerfilAdmin } from '../model/Configuracion/tipoPerfil';
import { TipoVehiculoConfig, putTipoVehiculo } from '../model/Configuracion/tipoVehiculo';
import { DatosVehiculo, putVehiculo } from '../model/Configuracion/vehiculo';
import { RecuentoRecAmbiental } from '../model/Dashboard/V_CantidadRecAmbientalUsuario';
import { CantReclamoMesyAnio } from '../model/Dashboard/V_CantidadRecPorMesyAnio';
import { RecuentoTipReclamos } from '../model/Dashboard/V_CantidadTipReclamoUsuario';
import { RecuentoTarjetas } from '../model/Dashboard/V_RecuentoReclamos';
import { RecuentoTotal } from '../model/Dashboard/V_RecuentoTotal';
import { DetalleReclamo, DetalleReclamoActualizar, DetalleReclamoVehicularActualizar } from '../model/detalleReclamo';
import { EstadoReclamo, tipoEstadoHistorial } from '../model/filtrosHistorial/estadoReclamo';
import { marca } from '../model/marca';
import { modelo } from '../model/modelo';
import { datosperfil, putUsuario } from '../model/perfil';
import { Reclamo } from '../model/reclamo';
import { ReclamoAmbiental } from '../model/reclamoAmbiental';
import { sesionUsuario } from '../model/sesion';
import { TipoReclamo } from '../model/tipoReclamo';
import { Vehiculo } from '../model/vehiculo';
import { bajaUsuario, estadosUsuarios, usuarioConfig } from '../model/usuario';
import { putMarca } from '../model/Configuracion/marcaVehiculo';
import { putModelo } from '../model/Configuracion/modeloVehiculo';
import { putTipoReclamo } from '../model/Configuracion/tipoReclamo';
import { VE_ReclamosXLocalidades } from '../model/Estadistica/VE_ReclamosXLocalidades';
import { bajaLoc, localidad, nombreLoc } from '../model/localidad';

@Injectable({
  providedIn: 'root'
})
export class BackenApiService {

  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  

  constructor( private http: HttpClient) { }

  
  /* metodo get de reclamos */
  getReclamo(): Observable<Reclamo[]> {
    return this.http.get<Reclamo[]>('https://localhost:44363/reclamo');
  }

  postReclamo(Reclamo: any):Observable<any>{
    
    console.log(Reclamo);
    return this.http.post('https://localhost:44363/reclamo', Reclamo, this.httpOptions);
  }

  postDetalleReclamo(Detallereclamo: any ):Observable<any>{
    debugger
    return this.http.post('https://localhost:44363/detallereclamo', Detallereclamo, this.httpOptions);
  }

  
 
  /* se trasladora a los servicios correspondientes */
  getReclamoAmbiental(): Observable<ReclamoAmbiental[]> {
    return this.http.get<ReclamoAmbiental[]>('https://localhost:44363/reclamoambiental');
  }

  getMarca(): Observable<marca[]> {
    return this.http.get<marca[]>('https://localhost:44363/marcavehiculo');
  }

  getModelo(): Observable<modelo[]> {
    return this.http.get<modelo[]>('https://localhost:44363/modeloVehiculo');
  }


  /* Pantalla Login (registro de usuario) - utilizado en el servicio de registro */
 /*  postUsuario(usuario: any ):Observable<any>{
    return this.http.post('https://localhost:44363/usuario', usuario, this.httpOptions);
  } */

  /* Post inicio sesion - se registra el logueo del usuario */
  postInicioSesionUsuario(usuarioLogueado: any):Observable<any>{
    return this.http.post('https://localhost:44363/sesion', usuarioLogueado, this.httpOptions);
  }

  // getPerfil( usuario : any ): Observable<any>{
  //   console.log(usuario);
  //   return this.http.get('http://localhost:4200/usuario' , usuario);
  // }

  /* Pantalla sesion - validar usuario - transferido al servicio de login */
  /* getValidacionUsuario(email:any, pass:any): Observable<any> {
    console.log(email);
    console.log(pass);
    debugger
    
    return this.http.get<sesionUsuario[]>('https://localhost:44363/sesion?'+"email="+email+"&"+"password="+pass); 
  } */

  /*Obtener los datos del usuario segun el ID - se utiliza directamente en el servicio de perfil*/
/*   getdatosPerfil(id:any): Observable<datosperfil[]>{
    console.log(id)
    return this.http.get<datosperfil[]>('https://localhost:44363/usuario/' + id);
  } */

  metodoEditar(perfil:datosperfil){
    //console.log(id)
    //
    return this.http.put('https://localhost:44363/usuario/' + perfil.IDUsuario,perfil);
  }
  

  /* Metodo para obtener todos reclamos (historial) */
  getDetalleReclamo(): Observable<any> {
    /* return this.http.get<DetalleReclamo[]>('https://localhost:44363/detallereclamo); */
    return this.http.get<DetalleReclamo[]>('https://localhost:44363/detallereclamo');
  }
 /* Metodo para obtener todos reclamos del usuario (historial) */
  getDetalleReclamoUsuario(idUsuario:number,id:number): Observable<any> {
    /* return this.http.get<DetalleReclamo[]>('https://localhost:44363/detallereclamo); */
    return this.http.get<DetalleReclamo[]>('https://localhost:44363/detallereclamo/'+idUsuario+'/'+id);/* por ahora el id es 1 =pendiente - trae todos los pendientes */
  }

  /* Metodo para obtener todos reclamos siendo administrador o empleado */
  getTodoslosDetalleReclamo(): Observable<any> {
    /* return this.http.get<DetalleReclamo[]>('https://localhost:44363/detallereclamo); */
    return this.http.get<DetalleReclamo[]>('https://localhost:44363/detallereclamo/');/* por ahora el id es 1 =pendiente - trae todos los pendientes */
  }

 
  // ---------------------------------- Metodos HISTORIAL---------------------------------- 

  // GET

  getEstadosHistorial(){
    //utilizado para traer los tipos de estados que se van a visualizar en el primer select de los filtros del historial
    // antes se filtraba por tipos de reclamos 
    return this.http.get<tipoEstadoHistorial[]>('https://localhost:44363/TipoEstado');
  }

  getTipoReclamo(): Observable<TipoReclamo[]> {
    return this.http.get<TipoReclamo[]>('https://localhost:44363/tiporeclamo');
  }

  getHistorialHoy(fechaHoy:string,idUsuario:number,idEstadoA:number, idEstadoV:number,idRol:number):Observable<any>{
    return this.http.get<DetalleReclamo[]>('https://localhost:44363/HistorialHoy?'+'fechaHoy='+fechaHoy+'&'+'idUsuario='+idUsuario+'&'+'idEstadoA='+idEstadoA+'&'+'idEstadoV='+idEstadoV+'&'+'idRol='+idRol);
    /* HistorialHoy?fechaHoy=2021-09-28&idUsuario=4&idEstadoA=1&idEstadoV=5&idRol=3  */
  }

  /* Filtros Histrial / tambien usado para los estados del reclamo para actualizar ******/
  getFiltroEstadoHistorial(idTipoReclamo:number): Observable<EstadoReclamo[]>{
    return this.http.get<EstadoReclamo[]>('https://localhost:44363/estadoreclamo/'+idTipoReclamo);
  }

  /****** Busqueda por filtros siendo admininistrador, empleado o usuario ***/
  /* Busqueda por tipo reclamo y estado (no ingreso el nombre de usuario ni la fecha) */
  getDetalleReclamoFiltrado(idTipoR:number,idEstadoReclamo:number, idRol:number): Observable<any> {
    
    return this.http.get<DetalleReclamo[]>('https://localhost:44363/FiltrosReclamos?'+'idtipor='+idTipoR+"&"+'idestado='+idEstadoReclamo+'&'+'idRol='+idRol);
  }

   /* Busqueda de reclamos por filtro usando tipo de reclamo, su estado y una fecha */
   getDetalleReclamoPorfecha(idTipoR:number,idEstadoReclamo:number,fechaDesde:string, idrol:number){
    /* https://localhost:44363/FiltroRangoFechas?idTipoReclamo=1&idEstado=1&fechaDesde=2021-10-13&fechaHasta=2021-10-22&idRol=1&nombreUsuario=- */
     return this.http.get<DetalleReclamo[]>('https://localhost:44363/FiltroRangoFechas?'+'idTipoReclamo='+idTipoR+'&'+'idEstado='+idEstadoReclamo+'&'+'fechaDesde='+fechaDesde+'&'+'idRol='+idrol);
   }

   /* Busqueda por tipo reclamo, estado y nombre (no ingresó la fecha) - administrador o usuario*/
   getDetalleReclamoFiltradoNombre(idTipoR:number,idEstadoReclamo:number, nombreUsuario:string, idRol:number): Observable<any>{
    debugger
    return this.http.get<DetalleReclamo[]>('https://localhost:44363/FiltrosReclamos?'+'idtipor='+idTipoR+"&"+'idestado='+idEstadoReclamo+'&'+'nombreUsuario='+nombreUsuario+'&'+'idRol='+idRol);
  }

   /* Busqueda de reclamos por filtro usando el nombre del usuario - administrador */
   getDetalleReclamoFiltradoNombreUsuario(nombreUsuario:string): Observable<any> {
    
   /*https://localhost:44363/FiltroNombreReclamos?nombreUsuario=Omar */
   return this.http.get<DetalleReclamo[]>('https://localhost:44363/FiltroNombreReclamos?'+'nombreUsuario='+nombreUsuario);
  }

  /* Busqueda de reclamos por filtro usando tipo de reclamo, su estado y una fecha - administrador o usuario */
  getDetalleReclamoPorfechayNombreUsuario(idTipoR:number,idEstadoReclamo:number,fechaDesde:string, idrol:number,nombreUsuario:string ){
    
    /* https://localhost:44363/FiltroRangoFechas?idTipoReclamo=1&idEstado=1&fechaDesde=2021-10-13&fechaHasta=2021-10-22&idRol=1&nombreUsuario=- */
    return this.http.get<DetalleReclamo[]>('https://localhost:44363/FiltroRangoFechas?'+'idTipoReclamo='+idTipoR+'&'+'idEstado='+idEstadoReclamo+'&'+'fechaDesde='+fechaDesde+'&'+'idRol='+idrol+'&'+'nombreUsuario='+nombreUsuario);
  }

   /****** Busqueda por filtros tipo reclamo y estado siendo usuario***/
   getDetalleReclamoFiltradoUsuario(idTipoR:number,idEstado:number,idRol:number,idUsuario:number): Observable<any> {
    
   return this.http.get<DetalleReclamo[]>('https://localhost:44363/FiltrosReclamos?'+'idTipoR='+idTipoR+'&'+'idEstado='+idEstado+'&'+'idRol='+idRol+'&'+'idUsuario='+idUsuario);
  }

  /* Busqueda por filtros tipo reclamo, estado y fecha - siendo usuario */
  getDetalleReclamoPorfechaDelUsuario(idTipoReclamo:number,idEstado:number,fechaDesde:string,idRol:number,idUsuario:number  ): Observable<any> {
    
   return this.http.get<DetalleReclamo[]>('https://localhost:44363/FiltroRangoFechas?'+'idTipoReclamo='+idTipoReclamo+'&'+'idEstado='+idEstado+'&'+'fechaDesde='+fechaDesde+'&'+'idRol='+idRol+'&'+'idUsuario='+idUsuario);
  }

  /* Metodo usado para traer los datos necesarios para actualizar el reclamo AMBIENTAL */
  getDetalleReclamoParaActualizar(idDetalleR:number): Observable<any>{
    return this.http.get<DetalleReclamoActualizar[]>('https://localhost:44363/ActualizarReclamo/'+idDetalleR);
  }
  /* Metodo usado para traer los datos necesarios para actualizar el reclamo VEHICULAR */
  getDetalleReclamoVehicular(idDetalleR:number): Observable<any>{
    return this.http.get<DetalleReclamoVehicularActualizar[]>('https://localhost:44363/ActualizarRecVehicular/'+idDetalleR);
  }

  putActualizarReclamo(Recla: Reclamo):Observable<any>{
    var dato = JSON.stringify(Recla);
    
    return this.http.put('https://localhost:44363/reclamo/'+Recla.IDReclamo,dato,this.httpOptions)
  }
  putActualizarDetalleReclamo(DetRecla: DetalleReclamo):Observable<any>{
    var dato = JSON.stringify(DetRecla);
    
    return this.http.put('https://localhost:44363/detallereclamo/'+DetRecla.IDDetalleReclamo,dato,this.httpOptions)
  }
  /* Aca se usa cuando se cambia la marca del auto */
  putActualizarDetVehicular(DetoVehiculo: Vehiculo):Observable<any>{
    var dato = JSON.stringify(DetoVehiculo);
    
    return this.http.put('https://localhost:44363/ActualizarRecVehicular/'+DetoVehiculo.IDVehiculo,dato,this.httpOptions)
  }

  /******* Vehiculo *******/
  postVehiculo(vehiculo: any):Observable<any>{
    
    
    return this.http.post('https://localhost:44363/vehiculo', vehiculo, this.httpOptions);
  }
  postVehiculoxDetalle(vehiculoxDetalle: any):Observable<any>{
    
    return this.http.post('https://localhost:44363/vehiculoxdetallereclamo', vehiculoxDetalle, this.httpOptions);
  }

  /* DASHBOARD  */

  /* arregloTarjetas: Array<RecuentoTarjetas> = new Array<RecuentoTarjetas>(); */

  /* Dashboard - devuelve la cantidad total de reclamos dependiendo de sus 3 estados en general */
  getRecuentoReclamos():Observable<any>{ 
    return  this.http.get<RecuentoTarjetas[]>('https://localhost:44363/cantidadxestados')
  }

  /* Dashboard - devuelve la cantidad total de reclamos del usuario dependiendo de los 3 estados */
  getCantidadReclamosUsuario(idUsuario:number):Observable<any>{
    return this.http.get<RecuentoTarjetas[]>('https://localhost:44363/V_CantidadxEstadoUsuario?'+'idUsuario='+idUsuario);
  }
  /* Dashboard - devuelve la cantidad total de reclamos */
  getReclamosTotales(idUsuario:number,idRol:number):Observable<any>{
    
    if(idRol==1 || idRol==2){
      return this.http.get<RecuentoTotal[]>('https://localhost:44363/V_TotalReclamosAdmin/'+idRol);
    }else{
      return this.http.get<RecuentoTotal[]>('https://localhost:44363/V_TotalReclamosRealizados/'+idUsuario+'/'+idRol);
    }
    
  }

  /* Dashboard - devuelve la cantidad de tipos de reclamos para el usuario logeado o el admin */
  getRecuentoTiposReclamosUsuario(idUsuario:number, idRol:number){
    
    if(idRol==1 || idRol==2){
      return this.http.get<RecuentoTipReclamos[]>('https://localhost:44363/V_TotalTipoReclamosAdmin/'+idRol)
    }else{
      return this.http.get<RecuentoTipReclamos[]>('https://localhost:44363/V_CantidadTipReclamoUsuario/'+idUsuario)
    }
    
  }

  getRecuentoReclamosAmbientalesUsuario(idUsuario:number,idRol:number){
    
    if(idRol==1 || idRol==2){
      return this.http.get<RecuentoRecAmbiental[]>('https://localhost:44363/V_TotalRecAmbientalAdmin/')
    }else{
      return this.http.get<RecuentoRecAmbiental[]>('https://localhost:44363/V_CantidadRecAmbientalUsuario/'+idUsuario)
    }
    
  }
  /* Utilizado para el boton de buscar cantidad de reclamos dependiendo del año, rol y usuario */
  getRecuentoReclamosDelAnio(idUsuario:number,anio:string,idRol:number){
    if(idRol==1 || idRol==2){
      return this.http.get<CantReclamoMesyAnio[]>('https://localhost:44363/V_TotalReclamosPorAnioAdmin/'+idRol+'/'+anio);
    }else{
      return this.http.get<CantReclamoMesyAnio[]>('https://localhost:44363/V_CantidadRecPorMesyAnio/'+idUsuario+'/'+anio);
    }
  }
    /* ---------------------------- Estadística ------------------------------------- */

   


    getReclamosXLocalidades(IDUsuario:number,idrol:number):Observable<VE_ReclamosXLocalidades[]>{ 
      debugger
      return this.http.get<VE_ReclamosXLocalidades[]>('https://localhost:44363/VE_ReclamosXLocalidades/'+IDUsuario+'/'+idrol);
    }

  /* ---------------------------- Configuración ------------------------------------- */

  getTipoEstadoAdmin(){
    
    return this.http.get<TipoEstado[]>('https://localhost:44363/tipoestadoadmin');
  }

  getEstadosDelTipo(idTipoEstado:number){
    
    return this.http.get<EstadosAdminConfig[]>('https://localhost:44363/estadosadmin?idTipoEstado='+idTipoEstado);
  }

  getTipVehiculo(){
    return this.http.get<TipoVehiculoConfig[]>('https://localhost:44363/TipoVehiculoAdmin');
  }

  getListaTiposVehiculos(idTipoVehiculo:number){
    
    return this.http.get<DatosVehiculo[]>('https://localhost:44363/TipoVehiculoAdmin/'+idTipoVehiculo);
  }

  getListaTiposReclamos(idTipoReclamo:number){
    
    return this.http.get<TipoReclamo[]>('https://localhost:44363/TipoReclamoAdmin/'+idTipoReclamo);
  }

  getTipoPerfil(){
    return this.http.get<PerfilAdmin[]>('https://localhost:44363/TipoPerfilAdmin');
  }

  getConfiguracionVehiculos(idMarca:number,idModelo:number){
    return this.http.get<DatosVehiculo[]>('https://localhost:44363/VehiculosAdmin/'+idMarca+'/'+idModelo);
  }

  getIDMarca(idMarca:number){
    return this.http.get<marca[]>('https://localhost:44363/MarcaAdmin/'+idMarca)
  }

  getUsuarios(){
    return this.http.get<any>('https://localhost:44363/UsuarioAdminConfiguration');
  }

  getUsuarioSelecionado(idUser:number){
    return this.http.get<any>('https://localhost:44363/UsuarioAdminConfiguration/'+idUser);
  }

  getidActivoVehiculo(){
    /* 4 devuelve estado activo e inactivo de vehiculo */
   return this.http.get<tipoEstadoVehiculo[]>('https://localhost:44363/TipoEstadoVehiculoadmin/4');
  }
  //utilizado para traer los estados activo e inactivo del usuario, solo para rellenar un select
  getEstadosFiltroUsuariosConfig(estado:string){
    return this.http.get<estadosUsuarios[]>('https://localhost:44363/Usuariofiltroadmin?tipoEstado='+estado);
  }

  //Metodo para filtrar la lista de usuarios de la pantalla de configuración
  getFiltroUsuariosConfiguracion(nombreU:string,idEstado:number){
    debugger
    return this.http.get<usuarioConfig[]>('https://localhost:44363/usuarioFiltroadmin/'+nombreU+'/'+idEstado);
  }

  putBajaUsuario(bajaUsuario: bajaUsuario):Observable<any>{
    var dato = JSON.stringify(bajaUsuario);
    
    return this.http.put('https://localhost:44363/usuarioFiltroadmin/'+bajaUsuario.idUsuario,dato,this.httpOptions)
  }

 /*  getFiltronickUConfiguracion(nickU:string,idEstado:number){
    debugger
    return this.http.get<usuarioConfig[]>('https://localhost:44363/NickFiltroAdmin/'+nickU+'/'+idEstado);
  } */

  //Se utiliza en la pantalla de Configuración - al inciar la pantalla llama al metodo
  getLocalidades(){
    return this.http.get<localidad[]>('https://localhost:44363/localidad');
  }
  getFiltrarLocalidades(nombreLocalidad:string){
    return this.http.get<localidad[]>('https://localhost:44363/localidadesAdmin/'+nombreLocalidad);
  }

  PostLocalidad(localidad: any):Observable<any>{
    return this.http.post('https://localhost:44363/Localidad', localidad, this.httpOptions);
  }

  putConfirmarBajaAltaLocalidad(bajaLoca:bajaLoc):Observable<any>{

    var dato = JSON.stringify(bajaLoca);
    return this.http.put('https://localhost:44363/Localidad/'+bajaLoca.IDLocalidad,dato,this.httpOptions)


  }
  putNombreLocalidad(nombreLoc: nombreLoc):Observable<any>{
    var dato = JSON.stringify(nombreLoc);
    return this.http.put('https://localhost:44363/LocalidadesAdmin/'+nombreLoc.IDLocalidad,dato,this.httpOptions)
  }

/*------------------------ Fin Configuración ------------------------- */


  /*------------------------ Configuración Modal tipo estado y Estado ------------------------- */
  postTipoEstado(tipoEstado: any ):Observable<any>{
    debugger
    return this.http.post('https://localhost:44363/TipoEstado', tipoEstado, this.httpOptions);
  }

  postEstado(Estado:any):Observable<any>{
    return this.http.post('https://localhost:44363/EstadosAdmin', Estado, this.httpOptions);
  }
  /*------------------------ Configuración Modal Vehiculo ------------------------- */

  postVehiculoModal(vehiculo:any):Observable<any>{
    return this.http.post('https://localhost:44363/VehiculosAdmin', vehiculo, this.httpOptions);
  }
  putVehiculoModal(vehiculo:putVehiculo){
    var objeto = JSON.stringify(vehiculo);
    debugger
    return this.http.put('https://localhost:44363/ModalPutVehiculo/'+vehiculo.IDVehiculo,objeto,this.httpOptions)
  }


  /*------------------------ Configuración Modal Marcas ------------------------- */
  postMarcaModal(marca:any):Observable<any>{
    return this.http.post('https://localhost:44363/MarcaAdmin', marca, this.httpOptions);
  }
  putMarcaModal(marca:putMarca){
    var objeto = JSON.stringify(marca);
    debugger
    return this.http.put('https://localhost:44363/modalPutMarca/'+marca.idMarca,objeto,this.httpOptions)
  }

  /*------------------------ Configuración Modal Modelo ------------------------- */
  postModeloModal(modelo:any):Observable<any>{
    return this.http.post('https://localhost:44363/ModeloAdmin', modelo, this.httpOptions);
  }
  putModeloModal(modeloAuto:putModelo){
    var objeto = JSON.stringify(modeloAuto);
    debugger
    return this.http.put('https://localhost:44363/modalPutModelo/'+modeloAuto.idModelo,objeto,this.httpOptions)
  }
  
  /*------------------------ Configuración Modal Perfil ------------------------- */

  postPerfilModal(perfil:any):Observable<any>{
    return this.http.post('https://localhost:44363/TipoPerfilAdmin', perfil, this.httpOptions);
    
  }
  putPerfilModal(perfil:putPerfilAdmin){
    var objeto = JSON.stringify(perfil);
    debugger
    return this.http.put('https://localhost:44363/modalPutPerfil/'+perfil.idPerfil,objeto,this.httpOptions)
  }
  /*------------------------ Configuración Modal Tipo Reclamo ------------------------- */
  postTipoReclamoModal(tipoReclamo:any):Observable<any>{
    return this.http.post('https://localhost:44363/TipoReclamoAdmin', tipoReclamo, this.httpOptions);
  }
  putTipoReclamoModal(tipoReclamo:putTipoReclamo){
    var objeto = JSON.stringify(tipoReclamo);
    debugger
    return this.http.put('https://localhost:44363/modalPutTipoReclamo/'+tipoReclamo.idTipoReclamo,objeto,this.httpOptions)
  }
  /*------------------------ Configuración Modal Tipo Vehiculo ------------------------- */
  postTipoVehiculoModal(tipoVehiculo:any):Observable<any>{
    return this.http.post('https://localhost:44363/TipoVehiculoAdmin', tipoVehiculo, this.httpOptions);
  }

  putTipoVehiculoModal(tipoVehiculo:putTipoVehiculo){
    var objeto = JSON.stringify(tipoVehiculo);
    debugger
    return this.http.put('https://localhost:44363/<modalPutTipoVehiculo/'+tipoVehiculo.idTipoVehiculo,objeto,this.httpOptions)
  }

  /*------------------------ Configuración Modal Usuario ------------------------- */

  putEstadoUsuario(usuario:putUsuario){
    var objeto = JSON.stringify(usuario);
    debugger
    return this.http.put('https://localhost:44363/modalUsuario/'+usuario.IDUsuario,objeto,this.httpOptions)
  }

  
  
 




  /*------------------------ MODAL PARA ACTUALIZAR ------------------------- */

  getActualizarModalVehiculo(idVehiculo:number){
    return this.http.get<DatosVehiculo[]>('https://localhost:44363/ModalPutVehiculo/'+idVehiculo);
  }




  
}
