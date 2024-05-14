import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { estadisticaGeneral } from 'src/app/model/Estadistica/EstPorcentajeCalleXLocalidad';
import { VE_CallesXlocalidad2 } from 'src/app/model/Estadistica/VE_CallesXlocalidad2';
import { VE_ReclamosXLocalidades } from 'src/app/model/Estadistica/VE_ReclamosXLocalidades';
import { V_CantidadTipoReclamoDelMes } from 'src/app/model/Estadistica/V_CantidadTipoReclamoDelMes';
import { V_EstadisticaXmes } from 'src/app/model/Estadistica/V_EstadisticaXmes';
import { V_ReclamosEnElTiempo } from 'src/app/model/Estadistica/V_ReclamosEnElTiempo';
import { VeReclamosLocalidadXCalle } from 'src/app/model/Estadistica/VeReclamosLocalidadXCalle';
import { v_ReclamosEnLaSemana } from 'src/app/model/Estadistica/v_ReclamosEnLaSemana';

@Injectable({
  providedIn: 'root'
})
export class EstadisticaService {

   //cabeceras http
   httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http:HttpClient) { }

 /*  getReclamosXLocalidades(IDUsuario:number): Observable<any>{
    debugger
    return this.http.get<VE_ReclamosXLocalidades[]>('https://localhost:44363/VE_ReclamosXLocalidades/'+IDUsuario);
  } */

  getReclamosLocalidadesXCalle(IDUsuario:number,IDLocalidad:number){
    return this.http.get<VeReclamosLocalidadXCalle[]>('https://localhost:44363/VeReclamosLocalidadXCalle/'+IDUsuario+'/'+IDLocalidad);
  }

  //Metodo para rellenar el primer grafico de torta y las tarjetas
  getEstadisticaGeneral(IDUsuario:number, idRol:number){ 
    debugger
    return this.http.get<estadisticaGeneral[]>('https://localhost:44363/EstPorcentajeCalleXLocalidad/'+IDUsuario+'/'+idRol);
  }

  getVE_CallesXlocalidad2(IDUsuario:number,IDLocalidad:number){
    return this.http.get<VE_CallesXlocalidad2[]>('https://localhost:44363/VE_CallesXlocalidad2/'+IDUsuario+'/'+IDLocalidad);
  }


  // rellena el grafico de barras horizontales 
  V_EstadisticaXmes(IDUsuario:number, idRol:number, fecha:string){
    return this.http.get<V_EstadisticaXmes[]>('https://localhost:44363/V_EstadisticaXmes/'+IDUsuario+'/'+idRol+'/'+fecha);
  }

  //Estadistica para dia de la semana - usuario y admin - Cuando abre pantalla en estadistica
  v_ReclamosEnLaSemana(idRol:number, idUsuario:number, mes:number,anio:number){
    return this.http.get<v_ReclamosEnLaSemana[]>('https://localhost:44363/v_ReclamosEnLaSemana/'+idRol +'/'+idUsuario+'/'+mes+'/'+anio)
  }

  //utilizado cuando se selecciona la barra del mes en ESTADISTICAS - Usuario
  V_ReclamoEnLaSemanaDelMes(idRol:number, idUsuario:number, nombreMes:string,anio:number){
    return this.http.get<v_ReclamosEnLaSemana[]>('https://localhost:44363/v_ReclamosEnLaSemana?idRol='+idRol+'&idUsuario='+idUsuario+'&nombreMes='+nombreMes+'&anio='+anio)
  }

  //Grafico de barras tipos de reclamos del mes actual y anio actual
  V_CantidadTipoReclamoDelMes(idRol:number, idUsuario:number, mes:number,anio:number){
    return this.http.get<V_CantidadTipoReclamoDelMes[]>('https://localhost:44363/V_CantidadTipoReclamoDelMes/'+idRol +'/'+idUsuario+'/'+mes+'/'+anio)
  }

  //grafico de tipos de reclamo viales y ambientales - cuando selecciono el mes del primer grafico
  V_CantidadTipoReclamoDelMesSelect(idRol:number, idUsuario:number, nombreMes:string,anio:number){
    return this.http.get<V_CantidadTipoReclamoDelMes[]>('https://localhost:44363/V_CantidadTipoReclamoDelMes?idRol='+idRol+'&idUsuario='+idUsuario+'&nombreMes='+nombreMes+'&anio='+anio)
  }

  //V_ReclamosEnElTiempo - visualiza todos los reclamos hechos en un intervalo de tiempo de todos los años
  V_ReclamosEnElTiempo(idRol:number, idUsuario:number,  mes:number,anio:number){
    return this.http.get<V_ReclamosEnElTiempo[]>('https://localhost:44363/V_ReclamosEnElTiempo/'+idRol +'/'+idUsuario+'/'+mes+'/'+anio)
  }




// ------------------------------ FILTROS ------------------------------

  //V_EstadisticaXmes - Filtro grafico de barras horizontales
  V_EstadisticaXmesFiltro(idUsuario:number,idRol:number,anio:number, idLocalidad:number){
    debugger
    return this.http.get<V_EstadisticaXmes[]>('https://localhost:44363/V_EstadisticaXmesFiltro/'+idUsuario+'/'+idRol+'/'+anio+'/'+idLocalidad)
  }

  // v_ReclamosEnLaSemana - cuando selecciona el mes del grafico busca los reclamos de ese mes seleccionado
  v_ReclamosEnLaSemanaFiltro(idRol:number,idUsuario:number, nombreMes:string,anio:number,idLocalidad:number){
    debugger
     return this.http.get<v_ReclamosEnLaSemana[]>('https://localhost:44363/v_ReclamosEnLaSemanaFiltro?idRol='+idRol+'&idUsuario='+idUsuario+'&nombreMes='+nombreMes+'&anio='+ anio+'&idLocalidad='+idLocalidad)
  }

  // V_CantidadTipoReclamoDelMesSelect - cuando selecciona el mes del grafico busca los reclamos de ese mes seleccionado

  V_CantidadTipoReclamoDelMesSelectFiltro(idRol:number,idUsuario:number, nombreMes:string,anio:number,idLocalidad:number){

    return this.http.get<V_CantidadTipoReclamoDelMes[]>('https://localhost:44363/V_CantidadTipoReclamoDelMesFiltro?idRol='+idRol+'&idUsuario='+idUsuario+'&nombreMes='+nombreMes+'&anio='+ anio+'&idLocalidad='+idLocalidad)
  }

  V_ReclamosEnElTiempoFiltro(idRol:number, idUsuario:number,  mes:number,anio:number,idLocalidad:number){
    return this.http.get<V_ReclamosEnElTiempo[]>('https://localhost:44363/V_ReclamosEnElTiempoFiltro/'+idRol +'/'+idUsuario+'/'+mes+'/'+anio+'/'+idLocalidad)
  }





}
