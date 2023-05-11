import { Component, OnInit } from '@angular/core';
import {  FormControl, Validators } from '@angular/forms';
import { LoginApiService } from 'src/app/service/Login/login-api.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /* ---- Loguear usuario */
  userLogCtrl = new FormControl('', [Validators.required,Validators.minLength(4)]);
  pasworLogCtrl = new FormControl('', [Validators.required,Validators.minLength(4)]);

  /*------ Registrar Usuario ------ */
  nombreCtrl= new FormControl('', [Validators.required]);
  apellidoCtrl= new FormControl('', [Validators.required,]);
  telefonoCtrl= new FormControl('', [Validators.required]);
  contraseniaCtrl= new FormControl('', [Validators.required]);
  confirmacionCtrl= new FormControl('', [Validators.required]);
  dniCtrl= new FormControl('', [Validators.required]);
  correoCtrl=new FormControl('', [Validators.required]);
  usuarioCtrl= new FormControl('', [Validators.required]);

  /* Se utiliza directamente de login asi no creo otro servicio identico */
  constructor(private service: LoginApiService) { }

    /*------ Banderas ------ */
    banderaContrasenia:boolean=false; /* bandera para habilitar el boton de registrarme */
    banderaAlerta:boolean=false;
    banderaAlertaRegistro : boolean=false; /* Avisa que el usuario a sigo registrado con exito */

  ngOnInit(): void {
  }

  
  /* ----- Modal Registrar usuario --- */
  validarContrasenia(){
    var contrasenia = this.contraseniaCtrl.value + '';
    var confirmacion = this.confirmacionCtrl.value + '';
    if (contrasenia===confirmacion) {
      debugger
      this.banderaContrasenia = true; /* si las contraseñas son iguales */
      console.log('contrasenia iguales');
    } else if (contrasenia != confirmacion) {
      this.banderaContrasenia = false; /* si las contraseñas no son iguales */
      console.log('contrasenia no son iguales');
    }
  }

  registrarUsuario(){
    debugger
    if(this.nombreCtrl.invalid || this.apellidoCtrl.invalid || this.telefonoCtrl.invalid || this.dniCtrl.invalid|| this.usuarioCtrl.invalid || this.correoCtrl.invalid || this.contraseniaCtrl.invalid || this.confirmacionCtrl.invalid || this.banderaContrasenia==false){
      alert('faltan datos por agregar')
    }else{

      var usuario = {
        Nombre: this.nombreCtrl.value + '',
        Apellido: this.apellidoCtrl.value + '',
        Celular: this.telefonoCtrl.value + '',
        DNI: this.dniCtrl.value + '',
        Nick: this.usuarioCtrl.value + '',
        Correo: this.correoCtrl.value + '',
        Contrasenia: this.contraseniaCtrl.value + '',
        ID_Perfil: 3, /* usuario */
        ID_Estado: 10,/* activo */
      }
      this.vaciarFormulario();
      

    /*   this.serviceRegistro.postRegistrarUsuario(usuario).subscribe(
        (data) => {
          alert('Usuario registrado: ' + data)
          this.banderaAlertaRegistro
        },
        (error) =>{
          alert('ocurrio un error al registarr el usuario: ' + error)
        }
      ) */
    }
    
  } /* registararUsuario */

  vaciarFormulario(){
    this.nombreCtrl.reset();
    this.apellidoCtrl.reset();
    this.telefonoCtrl.reset();
    this.dniCtrl.reset();
    this.usuarioCtrl.reset();
    this.correoCtrl.reset();
    this.contraseniaCtrl.reset();
  }

}
