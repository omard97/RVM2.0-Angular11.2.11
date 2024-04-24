import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { estadisticaGeneral } from 'src/app/model/Estadistica/EstPorcentajeCalleXLocalidad';
import { VE_CallesXlocalidad2 } from 'src/app/model/Estadistica/VE_CallesXlocalidad2';
import { VE_ReclamosXLocalidades } from 'src/app/model/Estadistica/VE_ReclamosXLocalidades';
import { VeReclamosLocalidadXCalle } from 'src/app/model/Estadistica/VeReclamosLocalidadXCalle';

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
  getEstadisticaGeneral(IDUsuario:number){ 
    debugger
    return this.http.get<estadisticaGeneral[]>('https://localhost:44363/EstPorcentajeCalleXLocalidad/'+IDUsuario);
  }

  getVE_CallesXlocalidad2(IDUsuario:number,IDLocalidad:number){
    return this.http.get<VE_CallesXlocalidad2[]>('https://localhost:44363/VE_CallesXlocalidad2/'+IDUsuario+'/'+IDLocalidad);
  }

}
