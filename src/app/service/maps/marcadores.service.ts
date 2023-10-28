import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MarcadoresService {

  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) {



   }

   //busco los reclamos con su ubicacion para mostarlos en el mapa
   obtenerLugares(idUsuario:number){

    return this.http.get<any>('https://localhost:44363/ubicacionReclamos?idUsuario='+idUsuario);


   }
}
