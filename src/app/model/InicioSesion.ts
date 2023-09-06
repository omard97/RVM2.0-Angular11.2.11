export interface inicioSesion {
  IDSesion?: number;
  fechaInicio?: string;
  fechaFin?: string;
  horaInicio?: string;
  horaFin?: string;
  ID_Usuario?: number;
}

/* se utiliza para obtener el id de sesion (el ultimo que esta logueado) y utilizarlo al crear el reclamo, ya que necesita el id de sesion */
export class idInicioSesionUsuario {
  idSesion: number = 0; 
}

export class formulario{
  correo : string = '';
  contrasenia : string = '';
}