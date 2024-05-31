import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { estadoReclamoPost } from 'src/app/model/filtrosHistorial/estadoReclamo';
import { getLocalidadRec } from 'src/app/model/localidad';
@Injectable({
  providedIn: 'root'
})
export class LocalidadService {

  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }



  getLocalidadReclamo(nombreLoc:string){
    return this.http.get<getLocalidadRec[]>('https://localhost:44363/obtenerLocalidad?nombreLoc='+nombreLoc);
   }



   PostLocalidad(localidad:any):Observable<any>{
    return this.http.post('https://localhost:44363/ObtenerLocalidad', localidad, this.httpOptions);
  }
   
  /* postInicioSesionUsuario(usuarioLogueado: any): Observable<any> {
    return this.http.post('https://localhost:44363/sesion', usuarioLogueado, this.httpOptions);
  } */
}
