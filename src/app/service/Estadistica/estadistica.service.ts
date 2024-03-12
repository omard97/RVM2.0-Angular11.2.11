import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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


}
