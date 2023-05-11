import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { rolUsuario } from 'src/app/model/Menu/rolUsuario';

@Injectable({
  providedIn: 'root'
})
export class MenuApiService {

    //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http:HttpClient) { }



  getRolUsuario(idUsuario:any): Observable<any> {
      
    return this.http.get<rolUsuario[]>('https://localhost:44363/V_rolUsuario/'+idUsuario);
  }
}