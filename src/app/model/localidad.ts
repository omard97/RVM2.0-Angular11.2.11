export class localidad {
    IDLocalidad?: number = 0;
    nombre: string = '';
    provincia: string = '';
    ID_Pais: number = 0;
    pais: string = '';
    iD_EstadoLocalidad: number = 0;
}

export class bajaLoc {
    IDLocalidad: number = 0;

    iD_EstadoLocalidad: number = 0;
}


export class nombreLoc {
    IDLocalidad: number = 0;
    nombre: string = "";
}


export class getLocalidadRec {
    idLocalidad: number = 0;
    Nombre: string = "";
    Provincia: string = "";
}

export class postLocalidad{
   
    nombre: string = '';
    provincia: string = '';
    ID_Pais: number = 0;
    iD_EstadoLocalidad: number = 0;
}