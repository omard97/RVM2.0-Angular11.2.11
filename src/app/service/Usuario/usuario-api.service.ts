import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { putUsuario } from 'src/app/model/perfil';
@Injectable({
  providedIn: 'root'
})
export class UsuarioApiService {
  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }


  putUsuario(putUsuario: putUsuario):Observable<any>{
    var objeto = JSON.stringify(putUsuario);
    debugger
    return this.http.put('https://localhost:44363/Usuario/'+putUsuario.IDUsuario,objeto,this.httpOptions)
  }
}
