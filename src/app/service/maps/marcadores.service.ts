import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../API/api.service';



@Injectable({
  providedIn: 'root'
})
export class MarcadoresService {

  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  urlApi: string = '' ;
  constructor(private http: HttpClient, private apiService:ApiService) {

    this.urlApi = this.apiService.getBaseUrl();

   }

   //busco los reclamos con su ubicacion para mostarlos en el mapa
   obtenerLugares(idUsuario:number, idRol:number){
    debugger
    return this.http.get<any>('https://localhost:44363/ubicacionReclamos?idUsuario='+idUsuario+'&idRol='+idRol);
   }


   /* Filtros de marcadores */
   getMarcadoresporEstados(idUsuario:number, idRol:number,iDTipoEstado:number,iDEstado:number,fecha:string){
    debugger
    return this.http.get<any>('https://localhost:44363/ubicacionReclamos/'+idUsuario+'/'+idRol +'/'+iDTipoEstado + '/'+ iDEstado+'/'+fecha);
   }
}
