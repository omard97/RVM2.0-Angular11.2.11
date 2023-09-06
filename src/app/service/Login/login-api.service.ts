import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { formulario, idInicioSesionUsuario } from 'src/app/model/InicioSesion';
import { sesionUsuario } from 'src/app/model/sesion';
import { nickUsuario } from 'src/app/model/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  private isLoggedIn = false;

  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { 

    
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  }


  /* Pantalla sesion - validar usuario y luego loguearse */
  getValidacionUsuario(email: any, pass: any): Observable<any> {
   
    if (email == '' || pass == '') {

      this.isLoggedIn = false; // no esta logueado
      localStorage.removeItem('isLoggedIn');
      return of(0);

    } else {

      
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      return this.http.get<sesionUsuario[]>('https://localhost:44363/sesion?' + "email=" + email + "&" + "password=" + pass); /* email=example@hotmail.com&password=123'); */

    }
  }

  // Método para cerrar sesión
  logout() {
    // Lógica para cerrar sesión (invalidar token, eliminar datos de usuario, etc.)
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
  }
  // Método para verificar si el usuario está autenticado
  estaLogeado() {
    
    return this.isLoggedIn;
  }



   /* Post inicio sesion - se registra el logueo del usuario */
   postInicioSesionUsuario(usuarioLogueado: any): Observable<any> {
    return this.http.post('https://localhost:44363/sesion', usuarioLogueado, this.httpOptions);
  }
  getConfirmarNickUsuario(nick: string) {
    return this.http.get<nickUsuario[]>('https://localhost:44363/V_listaUsuariosNick/' + nick);
  }

  getConfirmarCorreoUsuario(correo: string) {
    return this.http.get<nickUsuario[]>('https://localhost:44363/V_listaUsuariosNick?' + "correo=" + correo);

  }

  /* traer el id de sesion y utilizarlo para crear el reclamo */
  getSesionUsuarioLogueado(idUsuario: number): Observable<idInicioSesionUsuario[]> {
    return this.http.get<idInicioSesionUsuario[]>('https://localhost:44363/V_ultimaSesionDelUsuario/' + idUsuario);
  }  

  getFormulario(correo:string, contrasenia:string, nombre:string, usuario:string){
    debugger
    //https://localhost:44363/formulario?correo=omarf.dandrea@gmail.com&&contrasenia=omar123&&nombre=Omar&&usuario=omard97
      return this.http.get<formulario[]>('https://localhost:44363/formulario?' + "correo=" + correo + '&contrasenia='+contrasenia + '&nombre='+nombre+'&usuario=+'+usuario);
  }

  
}
