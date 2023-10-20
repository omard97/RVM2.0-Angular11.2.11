import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { MenuApiService } from 'src/app/service/Menu/menu-api.service';
import { putUsuario } from 'src/app/model/perfil';
import { PerfilApiService } from 'src/app/service/Perfil/perfil-api.service';
import { UsuarioApiService } from 'src/app/service/Usuario/usuario-api.service';
import { MapReclamoService } from '../../Reclamo/reclamo/maps-reclamo/services';
import { Marker, Popup, Map } from 'mapbox-gl';
import { LoginApiService } from 'src/app/service/Login/login-api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild('mapaDiv')
  mapDivElement!: ElementRef;

  /* Guardar foto de perfil para actualizar */
  imagePerfilDataUrl!:string;

  nombrePersonaCtrl = new FormControl('', [Validators.required]);
  apellidoPersonaCtrl = new FormControl('', [Validators.required]);
  celularCtrl = new FormControl('', [Validators.required]);
  dniCtrl = new FormControl('', [Validators.required]);
  correoCtrl = new FormControl('', [Validators.required]);
  contraseniaCtrl = new FormControl('', [Validators.required]);
  nombreUsuarioCtrl = new FormControl('', [Validators.required]);
  fotoCtrl = new FormControl('', [Validators.required]);



  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  idUsuario: any;
  datosPerfil: any;
  /* utilizado al hacer click en perfil */
  usuario = {
    idUsuario: 0,
    nick: '',
    idRol: 0,
    rol: '',
    foto:''
  }

  banderaActualizarPerfil: boolean = false;

   direccion: string='';



  constructor(private breakpointObserver: BreakpointObserver, private serviceM: MenuApiService, private _route: ActivatedRoute, private servicePerfil: PerfilApiService, private serviceUsuario: UsuarioApiService, private _router: Router, private mapaReclamoService:MapReclamoService,private serviceLogin: LoginApiService) {

    this.idUsuario = this._route.snapshot.paramMap.get('id');

    this.getRolUsuario();
  }

  ngOnInit(): void {

  }

  getRolUsuario() {
    if (this.idUsuario > 0) {
      this.serviceM.getRolUsuario(this.idUsuario).subscribe(
        (data) => {
          this.usuario.idUsuario = data[0].idUsuario,
            this.usuario.nick = data[0].nick,
            this.usuario.idRol = data[0].idRol,
            this.usuario.rol = data[0].rol,
            this.usuario.foto = data[0].foto
            
        },
        (error) => {
          console.error(error);
        }
      )
    }

  }

  /*  ------- Botones Menu ------ */

  getDatosPerfil() {
    
    this.servicePerfil.getdatosPerfil(Number(this.idUsuario)).subscribe(
      (data) => {
        console.log('datos del perfil logueado: ', data)
        this.datosPerfil = data;
      },
      (error) => {
        console.log(error)
      }
    )
  }

  /*  --------- Actualizar perfil de usuario --------- */
  formularioPerfil() {
    if (this.banderaActualizarPerfil == false) {
      this.banderaActualizarPerfil = true
    } else {
      this.banderaActualizarPerfil = false;
    }
  }

  actualizarPerfil() {

    let putUser: putUsuario = {
      IDUsuario: this.datosPerfil[0].idUsuario,
      Nombre: '',
      Apellido: '',
      DNI: '',
      Correo: '',
      Nick: '',
      Celular: '',
      Contrasenia: '',
      id_Perfil: this.datosPerfil[0].id_Perfil,
      id_Estado: this.datosPerfil[0].id_Estado,
      foto: '',
    }

    debugger
    if (this.nombrePersonaCtrl.value == '') {
      /* si el formulario esta vacio es porque no se actualizo */
      putUser.Nombre = this.datosPerfil[0].nombrePersona;
    } else {
      putUser.Nombre = this.nombrePersonaCtrl.value + '';
    }

    if (this.apellidoPersonaCtrl.value == '') {
      /* si el formulario esta vacio es porque no se actualizo */
      putUser.Apellido = this.datosPerfil[0].apellidoPersona;
    } else {
      putUser.Apellido = this.apellidoPersonaCtrl.value + '';
    }

    if (this.celularCtrl.value == '') {

      putUser.Celular = this.datosPerfil[0].telefonoUsuario + '';
    } else {
      putUser.Celular = this.celularCtrl.value + '';
    }

    if (this.dniCtrl.value == '') {

      putUser.DNI = this.datosPerfil[0].dniUsuario + '';
    } else {
      putUser.DNI = this.dniCtrl.value +'';
    }
    if (this.correoCtrl.value == '') {

      putUser.Correo = this.datosPerfil[0].correoUsuario + '';
    } else {
      putUser.Correo = this.correoCtrl.value + '';
    }
    if (this.contraseniaCtrl.value == '') {

      putUser.Contrasenia = this.datosPerfil[0].contrasenia + '';
    } else {
      putUser.Contrasenia = this.contraseniaCtrl.value + '';
    }


    if (this.nombreUsuarioCtrl.value == '') {

      putUser.Nick = this.datosPerfil[0].nombreUsuario + '';

    } else {
      putUser.Nick = this.nombreUsuarioCtrl.value + '';
    }

    debugger
    /* si esta vacio quiere decir que no se actualizo la foto */
    if(this.imagePerfilDataUrl==''){
      putUser.foto = this.datosPerfil[0].foto + '';
    }else{
      putUser.foto = this.imagePerfilDataUrl+'';
    }


    if (this.banderaActualizarPerfil == true) {
      debugger
      this.serviceUsuario.putUsuario(putUser).subscribe(
        (data) => {
          alert('usuario actualizado')
          debugger
        },
        (error) => {
          console.log(error);
        }
      )
      debugger
      this.banderaActualizarPerfil = false;
      this.limpiarFormulario();

    } else {
      alert('Perfil no actualizado')
      this.banderaActualizarPerfil = false;
    }
  }
  limpiarFormulario() {
    debugger
    this.nombrePersonaCtrl.reset()
    this.apellidoPersonaCtrl.reset()
    this.celularCtrl.reset()
    this.dniCtrl.reset()
    this.correoCtrl.reset()
    this.contraseniaCtrl.reset()
    this.nombreUsuarioCtrl.reset()
    debugger
    
    this.getDatosPerfil();
  
  }

  verMapadesdeHistorial(lng:string , lat:string, direc:string){
    /* recibo los las cooerdenadas de la funcion verMapa del historial component para luego crear y mostrar un mapa con la ubicacion del reclamo */
    var longitd = Number(lng);
    var latitud = Number(lat)
    this.direccion = direc;

    
    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [longitd, latitud], // starting position [lng, lat]
      zoom: 15, // starting zoom
    });

    /* Popup */
    const popup = new Popup()
      .setHTML(`
        <div style="text-align: center;">
          <h6 style>Aquí estoy</h6>
          <span>Estoy en este lugar del mundo</span>
        </div>
        `);

    /* Market - Marcador */
    new Marker({ color: 'red' })
      .setLngLat([longitd, latitud ])
      .setPopup(popup)
      .addTo(map);
      this.mapaReclamoService.setMap( map );

  }

  /* ---------------------- Input file ----------------------*/
  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.uploadImage(file);
    }
  }
/* leer el contenido del archivo seleccionado y convertirlo en un formato utilizable, como una URL de datos */
  uploadImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePerfilDataUrl = reader.result as string;
      
      
      // Aquí puedes realizar acciones adicionales con la imagen,
      // como enviarla al servidor o mostrarla en la interfaz de usuario.
    };
    reader.readAsDataURL(file);
  }
  /* ---------------------- Fin Input file ----------------------*/

  /* ---------------------- Cerrar Sesion ----------------------*/
  cerrarSesion(){
    this.serviceLogin.logout()
    this._router.navigate(['home'])
  }

    /* ---------------------- Eliminar Cuenta ----------------------*/

    eliminarCuenta(){
      debugger
      console.log('eliminar cuenta');
      console.log(this.datosPerfil)
      let putUser: putUsuario = {
        IDUsuario: this.datosPerfil[0].idUsuario,
        Nombre: this.datosPerfil[0].nombrePersona,
        Apellido: this.datosPerfil[0].apellidoPersona ,
        DNI: this.datosPerfil[0].dniUsuario,
        Correo: this.datosPerfil[0].correoUsuario,
        Nick: this.datosPerfil[0].nombreUsuario,
        Celular: this.datosPerfil[0].telefonoUsuario,
        Contrasenia: this.datosPerfil[0].contrasenia,
        id_Perfil: this.datosPerfil[0].id_Perfil,
        id_Estado: 10, /* Usuario Inactivo - dado de baja */
        foto: this.datosPerfil[0].foto,
      }

      this.serviceUsuario.putUsuario(putUser).subscribe(
        (data) => {
         
          this.cerrarSesion();
        },
        (error) => {
          console.log(error);
        }
      )


    }



}
