export class nickUsuario {
    idUsuario: number = 0;
    nick: string = '';
    correo: string = '';
}


export interface usuarioConfig{

    idUsuario: number;
    nombreUsuario : string;
    apellido : string,
    telefono : string,
    dni : string,
    email : string,
    nick : string,
    foto? : string,

    idEstado : number,
    nombreEstado : string,
    idTipoEstado : number,
    nombreTipoEstado : string,
}

export class estadosUsuarios{
    idEstado : number = 0;
    nombre : string = '';
    idTipoEstado : number = 0;
    nombreTipoEstado : string = '';
}