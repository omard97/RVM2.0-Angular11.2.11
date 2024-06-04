import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadoReclamo, estadoReclamoAdmin } from 'src/app/model/filtrosHistorial/estadoReclamo';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {
  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  //trae todos los estados una unica vez
  //utilizado en FiltrosHistorialController - EstadoReclamoController
  getEstados(id:number){
    debugger
    return this.http.get<estadoReclamoAdmin[]>('https://localhost:44363/estadoreclamo?id='+id);
  }

  getEstadoPorNombre(nombreTipoReclamo:string){
    return this.http.get<EstadoReclamo[]>('https://localhost:44363/EstadoReclamoEditar/'+nombreTipoReclamo);
  }


}
