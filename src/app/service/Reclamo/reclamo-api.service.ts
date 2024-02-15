import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { estadoReclamoPost } from 'src/app/model/filtrosHistorial/estadoReclamo';


@Injectable({
  providedIn: 'root'
})
export class ReclamoApiService {

   objetoRecibido : any ;
  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http:HttpClient) { }


  /* el tipo de reclamo que se selecciono va a devolver su tipo de estado - es decir si seleccione seguridad me trae los estados de seguridad */
 getEstadoReclamo(nombreTipoReclamo:string){

  return this.http.get<estadoReclamoPost[]>('https://localhost:44363/EstadoReclamoXTipoReclamo/'+nombreTipoReclamo);

 }


}
