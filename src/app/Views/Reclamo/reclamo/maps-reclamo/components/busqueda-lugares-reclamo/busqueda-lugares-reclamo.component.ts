import { Component, OnInit } from '@angular/core';
import { PlacesReclamoService } from '../../services';
import { ReclamoComponent } from '../../../reclamo.component';

@Component({
  selector: 'app-busqueda-lugares-reclamo',
  templateUrl: './busqueda-lugares-reclamo.component.html',
  styleUrls: ['./busqueda-lugares-reclamo.component.css']
})
export class BusquedaLugaresReclamoComponent  {

  private debounceTimer?: NodeJS.Timeout;
  constructor(private placesReclamoServices: PlacesReclamoService) { }

  /* Barra */
  onQueryChanged(query: string = '') {

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      
      this.placesReclamoServices.getPlacesByQuery( query );
      /* this.lugaresService.getLugaresPorBusqueda(query); */
      console.log('Enviar este query: ', query)

    }, 500)
  }

}
