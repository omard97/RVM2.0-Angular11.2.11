import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { idInicioSesionUsuario } from 'src/app/model/InicioSesion';
import { sesionUsuario } from 'src/app/model/sesion';
import { nickUsuario } from 'src/app/model/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  /* Pantalla sesion - validar usuario y luego loguearse */
  getValidacionUsuario(email: any, pass: any): Observable<any> {

    return this.http.get<sesionUsuario[]>('https://localhost:44363/sesion?' + "email=" + email + "&" + "password=" + pass); /* email=example@hotmail.com&password=123'); */
  }

  getConfirmarNickUsuario(nick:string){
    return this.http.get<nickUsuario[]>('https://localhost:44363/V_listaUsuariosNick/' + nick);
  }

  getConfirmarCorreoUsuario(correo:string){
    return this.http.get<nickUsuario[]>('https://localhost:44363/V_listaUsuariosNick?'+"correo="+correo);
    
  }



  /* traer el id de sesion y utilizarlo para crear el reclamo */
  getSesionUsuarioLogueado(idUsuario: number): Observable<idInicioSesionUsuario[]> {
    return this.http.get<idInicioSesionUsuario[]>('https://localhost:44363/V_ultimaSesionDelUsuario/' + idUsuario);
  }

  /* Post inicio sesion - se registra el logueo del usuario */
  postInicioSesionUsuario(usuarioLogueado: any): Observable<any> {
    return this.http.post('https://localhost:44363/sesion', usuarioLogueado, this.httpOptions);
  }
}
