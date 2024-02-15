export interface EstadoReclamo {
  IDEstado?: number;
  nombre?: string;
  ID_TipoEstado?: string;
}


export class estadoReclamoAdmin{

  idEstado: number =0;
  estadoNombre : string ='';
  idTipoEstado: number =0;
  tipoEstadoNombre : string ='';
}


export class tipoEstadoHistorial{
  idTipoEstado: number = 0;
  nombreTipoEstado: string='';
  
}

export class estadoReclamoPost{

  idEstado: number =0;
  estadoNombre : string ='';
  idTipoEstado: number =0;
  tipoEstadoNombre : string ='';
}