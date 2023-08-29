import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginApiService } from 'src/app/service/Login/login-api.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  banderaRutas: string = '';
  rutaURL: any;
  constructor( private loginService:LoginApiService,private router: Router) {

    debugger

    this.rutaURL = window.location.pathname.split('/');


    if(this.loginService.estaLogeado() == true){
      //bandera utilizado para mostrar el menu de redireccion de la app
      this.banderaRutas = 'Logueado'
    }else{
      //solo aparece el link para ir al login porque no esta registrado
      this.banderaRutas = 'Desconectado'

    }


  }

  ngOnInit(): void {
  }

  navegacion(ubicacion:string){
    if(ubicacion=='dashboard'){
      this.router.navigate(['menu',this.rutaURL[2],'dashboard']);
    }else if(ubicacion =='reclamo'){

    }else{
      // historial
    }
  }

}
