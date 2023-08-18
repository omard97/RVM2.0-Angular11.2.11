/* cuando es ambiental */
export interface DetalleReclamo {
  IDDetalleReclamo?: number;
  descripcion?: string;
  direccion?: string;
  altura: number;
  dominio?: string;
  ID_ReclamoAmbiental?: number;
  ID_Reclamo?: number;
  longitud?: string,
  latitud?: string,
}

/* cuando es vehicular */
export interface vehiculoXDetalle {
  IDVehiculoXDetalle?: number;
  ID_Vehiculo?: number;
  ID_DetalleReclamo?: number;
}

export interface DetalleReclamoActualizar {
  idDetalleReclamo: number;
  descripcion: string;
  altura: number;
  direccion: string;
  iD_Reclamo: number;
  fecha: string;
  hora: string;
  idSesion: number;
  estadoR: string; //nombre
  idEstado: number;
  nombreTRec: string;
  idTipoRec: number;
  idRecAmb: number;
  nombreRecAmbiental: string;
  dominio: null;
  nick: string;
  foto: string;
  longitud?: string,
  latitud?: string,
}

export interface DetalleReclamoVehicularActualizar{
  idDetalleReclamo: number;
  descripcion: string;
  altura: number;
  direccion: string;
  iD_Reclamo: number;
  fecha: string;
  hora: string;
  idSesion: number;
  iD_estadoRec:number;
  
  nombreMarca:string,
  iD_Vehiculo:number;
  colorAuto:string,
  numeroChasis:string,
  numeroMotor:string,
  iD_marca: number,
  iD_EstadoVehiculo: number;
  iD_Tipovehiculo:number;
  estadoVehiculo: string;
  nombreTRec: string;
  idTipoRec: number;
  idRecAmb: number;
  nombreRecAmbiental: string;
  dominio: null;
  nick: string;
  foto: string;
}
