export class DatosVehiculo{
    idVehiculo: number=0;
    dominio: string="";
    color: string="";
    chasis: number=0;
    numMotor: number=0;
    id_TipoVehiculo: number=0;
    id_Estado: number=0;
    id_MarcaVehiculo: number=0;
    nombreTipoVehiculo: string="";
    marcaAuto: string="";
    id_ModeloV: number=0;
    nombreModelo: number=0;
    nombreEstado: string="";
}

export class autoPost{
    idVehiculo?: number=0;
    dominio: string="";
    color: string="";
    numeroChasis: string="";
    numeroMotor: string="";
    id_MarcaVehiculo: number=0;
    id_Estado: number=0;
    id_TipoVehiculo: number=0;
    id_modelo:number=0;
}

export class putVehiculo {
    IDVehiculo:number=0;
    dominio:string='';
    color:string='';
    numeroChasis:string='';
    numeroMotor:string='';
    ID_MarcaVehiculo:number = 0;
    ID_Estado:number = 0;
    ID_TipoVehiculo:number = 0;
    ID_Modelo:number = 0;
  }