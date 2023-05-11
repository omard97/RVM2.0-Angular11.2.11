/* import { Byte } from '@angular/compiler/src/util'; */
import { DetalleReclamo } from './detalleReclamo';


export interface Reclamo {
  IDReclamo?: number;
  fecha?: string;
  foto?: string;
  hora?: string;
  ID_Sesion?: number;
  ID_TipoReclamo?: number;
  ID_Estado?: number;
}
