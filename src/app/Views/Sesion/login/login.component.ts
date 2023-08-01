import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { inicioSesion } from 'src/app/model/InicioSesion';
import { LoginApiService } from 'src/app/service/Login/login-api.service';
import { RegistroApiService } from 'src/app/service/Registro/registro-api.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /* ---- Loguear usuario */
  userLogCtrl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  pasworLogCtrl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  /*------ Registrar Usuario ------ */
  nombreCtrl = new FormControl('', [Validators.required]);
  apellidoCtrl = new FormControl('', [Validators.required,]);
  telefonoCtrl = new FormControl('', [Validators.required]);
  contraseniaCtrl = new FormControl('', [Validators.required]);
  confirmacionCtrl = new FormControl('', [Validators.required]);
  dniCtrl = new FormControl('', [Validators.required]);
  correoCtrl = new FormControl('', [Validators.required]);
  usuarioCtrl = new FormControl('', [Validators.required]);


  constructor(private serviceLogin: LoginApiService, private serviceRegistro: RegistroApiService, private router: Router, private toastr:ToastrService) {
    this.fechadehoy();
  }

  /*------ Banderas ------ */
  banderaContrasenia: boolean = false; /* bandera para habilitar el boton de registrarme */
  banderaAlerta: boolean = false;
  banderaAlertaRegistro: boolean = false; /* Avisa que el usuario a sigo registrado con exito */

  listUsuariodata: any;

  /* Datos post inicio sesion */
  date: Date = new Date();
  fechaLogin: any;
  hora: string = '';

  ReginicioSesion = {
    idInicioSesion: 0,
    fechaInicio: '',
    fechaFin: ' - ',
    horaInicio: '',
    horaFin: ' - ',

    ID_Usuario: 0,
  }

  ngOnInit(): void { }

  /* ----- Login ----- */
  validarUsuario() {
    debugger
    var usuarioLogeado = {
      email: this.userLogCtrl.value,
      password: this.pasworLogCtrl.value,
    };

    this.serviceLogin.getValidacionUsuario(usuarioLogeado.email, usuarioLogeado.password).subscribe(
      (data) => {

        if(data.length==0){
          this.toastr.warning(
            'El correo/contraseña no coinciden, intentelo de nuevo.',
            'Atención',
            {
              timeOut: 5000,
              positionClass:'toast-bottom-center'
            }
          );
        }else{
          console.log('el usuario se logueo con exito')
        console.log(data)

        this.listUsuariodata = data;
        console.log('Informacion usuario: ', this.listUsuariodata[0].idUser); /* obtengo el id del usuario y lo envio para postearlo */
        this.postInicioSesionUsuario(this.listUsuariodata[0].idUser);
        }
        debugger
        


      },
      (error) => {
        this.toastr.warning(
          'no hay conecxiónn con la BD',
          'Atención',
          {
            timeOut: 5000,
            positionClass:'toast-bottom-center'
          }
        );
       
        console.log(error)

      }
    )

  }

  public postInicioSesionUsuario(idUsua: any) {
    debugger
    this.ReginicioSesion.fechaInicio = this.fechaLogin,
      this.ReginicioSesion.fechaFin = ' - ',
      this.ReginicioSesion.horaInicio = this.hora,
      this.ReginicioSesion.horaFin = ' - ',
      this.ReginicioSesion.ID_Usuario = idUsua,


      this.serviceLogin.postInicioSesionUsuario(this.ReginicioSesion).subscribe(
        (data) => {
          /* desde aca ya se para al menu principal, despues de registrar la sesion */
          this.ReginicioSesion.idInicioSesion = data.idSesion;
          /* this.router.navigate([ */
          /* 'main-nav', */
          /* this.IDusuario, */ /* lo saco directamente del menu */
          /* this.IDRol, */ /* lo obtengo mediante un metodo get del menu */
          /* this.IDsesion, */
          /* 'principal',
        ]); */ /* this.router.navigate(['main-nav', data[0].idUser]); */
          debugger
          this.router.navigate(['menu', this.listUsuariodata[0].idUser,'dashboard']); /* this.router.navigate(['main-nav', data[0].idUser]); */
        },
        (err) => {
          
        }
      );
  }

  fechadehoy() {
    

    this.fechaLogin = formatDate(new Date(), 'yyyy-MM-dd', 'en-US')
    this.hora = String(this.date.getHours() + ':' + this.date.getMinutes());
  }

  /* ----- Modal Registrar usuario --- */
  validarContrasenia() {
    var contrasenia = this.contraseniaCtrl.value + '';
    var confirmacion = this.confirmacionCtrl.value + '';

    if ((contrasenia.length === confirmacion.length) && (contrasenia === confirmacion)) {
      debugger
      this.banderaContrasenia = true; /* si las contraseñas son iguales */
      this.toastr.success(
        'Las contraseñas coinciden',
        'Atención',
        {
          timeOut: 1000,
          positionClass:'toast-bottom-center'
        }
      );

    } else if ((contrasenia != confirmacion) && (contrasenia.length === confirmacion.length)) {
      this.banderaContrasenia = false; /* si las contraseñas no son iguales */
      this.toastr.warning(
        'Las contraseñas NO coinciden',
        'Atención',
        {
          timeOut: 1000,
          positionClass:'toast-bottom-center'
        }
      );
    }
  }

  /* ----- Modal Registrar usuario --- */
  registrarUsuario() {
    debugger
    if (this.nombreCtrl.invalid || this.apellidoCtrl.invalid || this.telefonoCtrl.invalid || this.dniCtrl.invalid || this.usuarioCtrl.invalid || this.correoCtrl.invalid || this.contraseniaCtrl.invalid || this.confirmacionCtrl.invalid || this.banderaContrasenia == false) {
      
      this.toastr.warning(
        'Complete el formulario para registrarse',
        'Atención',
        {
          timeOut: 5000,
          positionClass:'toast-bottom-center'
        }
      );
    } else {

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


      this.serviceRegistro.postRegistrarUsuario(usuario).subscribe(
        (data) => {
          
          this.toastr.success(
            usuario.Nick+' inicia sesion para comenzar a usar la app',
            'Atención',
            {
              timeOut: 4000,
              positionClass:'toast-bottom-full-width'
            }
          );
          this.banderaAlertaRegistro
          
        },
        (error) => {
          alert('ocurrio un error al registarr el usuario: ' + error)
          this.toastr.info(
            'Ocurrío un problema, usuario no registrado',
            'Atención',
            {
              timeOut: 5000,
              positionClass:'toast-bottom-center'
            }
          );
        }
      )
    }

  } /* registararUsuario */

  vaciarFormulario() {
    this.nombreCtrl.reset();
    this.apellidoCtrl.reset();
    this.telefonoCtrl.reset();
    this.dniCtrl.reset();
    this.usuarioCtrl.reset();
    this.correoCtrl.reset();
    this.contraseniaCtrl.reset();
    this.confirmacionCtrl.reset();
  }


}
