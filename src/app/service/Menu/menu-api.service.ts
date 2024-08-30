import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { rolUsuario } from 'src/app/model/Menu/rolUsuario';
import { ApiService } from '../API/api.service';

@Injectable({
  providedIn: 'root'
})
export class MenuApiService {

    //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  urlApi: string = '' ;
  constructor(private http:HttpClient, private apiService:ApiService) {

    this.urlApi = this.apiService.getBaseUrl();
   }



  getRolUsuario(idUsuario:any): Observable<any> {
      
    return this.http.get<rolUsuario[]>('https://localhost:44363/V_rolUsuario/'+idUsuario);
  }
}