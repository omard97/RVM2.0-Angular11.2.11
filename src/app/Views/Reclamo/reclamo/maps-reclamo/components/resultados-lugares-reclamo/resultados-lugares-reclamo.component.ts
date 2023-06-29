import { Component, OnInit } from '@angular/core';
import { MapReclamoService, PlacesReclamoService } from '../../services';
import { Feature } from '../../interfaces/places';
import { ReclamoComponent } from '../../../reclamo.component';

@Component({
  selector: 'app-resultados-lugares-reclamo',
  templateUrl: './resultados-lugares-reclamo.component.html',
  styleUrls: ['./resultados-lugares-reclamo.component.css']
})
export class ResultadosLugaresReclamoComponent implements OnInit {
  public selectedId:  string = '';
  constructor(private placesReclamoService: PlacesReclamoService,
    private mapReclamoService: MapReclamoService,
    private reclamoService: ReclamoComponent) { }

  ngOnInit(): void {
  }

  /* ver la lista */
  get isLoadingPlaces(): boolean{
    return this.placesReclamoService.isLoadingPlaces;
  }

  /* cargar la lista de lugares que busque */
  get places() : Feature[]{
    return this.placesReclamoService.places;
  }

  /* moverse entre lugares */
  flyTo( place : Feature ){
    this.selectedId = place.id; /* ya se que id de ubicacion es */
    console.log('ID Selecionado: ', this.selectedId)
    const[ lng , lat ] = place.center;
    this.reclamoService.almacenarUbicacion(lng,lat); /* se lo envio al componente reclamo para luego poder guardar la ubicacion en el mapa */
    this.mapReclamoService.flyTo([lng , lat])
    
    this.placesReclamoService.ocultarListaResultados();

  }

}
