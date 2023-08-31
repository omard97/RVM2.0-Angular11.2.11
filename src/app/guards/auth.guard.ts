import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginApiService } from '../service/Login/login-api.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private serviceLogin: LoginApiService, private router: Router,private toastr: ToastrService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      if (this.serviceLogin.estaLogeado() == true) {
        
        return true;
        
      } else {
        this.toastr.error(
          'Usted no tiene permisos, inicie sesión para utilizar la APP.',
          'Atención',
          {
            timeOut: 6000,
            positionClass: 'toast-top-full-width'
          }
        );
        // Redirige a la página de inicio de sesión si no está autenticado
        return this.router.navigate(['login'])
      }
  }
  
}
