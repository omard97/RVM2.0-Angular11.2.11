import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { datosperfil } from 'src/app/model/perfil';

@Injectable({
  providedIn: 'root'
})
export class PerfilApiService {

  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /*Obtener los datos del usuario segun el ID*/
  getdatosPerfil(id: any): Observable<datosperfil[]> {
    console.log(id)
    //
    return this.http.get<datosperfil[]>('https://localhost:44363/usuario/' + id);
  }

  
}
