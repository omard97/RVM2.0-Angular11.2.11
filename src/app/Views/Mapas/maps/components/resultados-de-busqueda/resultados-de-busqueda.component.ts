import { Component, OnInit } from '@angular/core';
import { LugaresService, MapaService } from 'src/app/service/maps';
import { Feature } from '../../interfaces/lugares';

@Component({
  selector: 'app-resultados-de-busqueda',
  templateUrl: './resultados-de-busqueda.component.html',
  styleUrls: ['./resultados-de-busqueda.component.css']
})
export class ResultadosDeBusquedaComponent  {

  public selectedId:  string = '';

  constructor( private lugaresService: LugaresService, private mapService: MapaService,) { }

  /* ver la lista */
  get isLoadingPlaces(): boolean{
    return this.lugaresService.isLoadingPlaces;
  }

  /* cargar la lista de lugares que busque */
  get places() : Feature[]{
    return this.lugaresService.lugares;
  }

  /* moverse entre lugares */
  flyTo( place : Feature ){
    this.selectedId = place.id; /* ya se que id de ubicacion es */
    
    const[ lng , lat ] = place.center;
    this.mapService.flyTo([lng , lat])
  }
}
