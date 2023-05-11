import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroApiService {
  
   //cabeceras http
   httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http:HttpClient) { }

  /* Pantalla Login - Modal(registro de usuario) */
  postRegistrarUsuario(usuario: any ):Observable<any>{
    return this.http.post('https://localhost:44363/usuario', usuario, this.httpOptions);
  }
}
