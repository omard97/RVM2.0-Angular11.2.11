export interface datosperfil {
  IDUsuario?: number;
  nombrePersona?: string;
  apellidoPersona?: string;
  dniUsuario?: number;
  correoUsuario?: string;
  nombreUsuario?: string;
  telefonoUsuario?: number;
  nombrePerfil?: string;
  nombreEstado?: string;
}

export interface putUsuario{
  IDUsuario?: number;
  Nombre: string;
  Apellido: string;
  DNI: string;
  Correo: string;
  Nick: string;
  Celular: string;
  Contrasenia:string;
 
  id_Perfil:number;
  id_Estado:number;
}