import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { datosperfil } from 'src/app/model/perfil';
import { ApiService } from '../API/api.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilApiService {

  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  urlApi: string = '' ;

  constructor(private http: HttpClient, private apiService:ApiService) {
    this.urlApi = this.apiService.getBaseUrl();
   }

  /*Obtener los datos del usuario segun el ID*/
  getdatosPerfil(id: any): Observable<datosperfil[]> {
    console.log(id)
    //
    return this.http.get<datosperfil[]>('https://localhost:44363/usuario/' + id);
  }

  
}
