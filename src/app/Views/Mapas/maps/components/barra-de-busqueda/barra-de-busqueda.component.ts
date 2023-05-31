import { Component, OnInit } from '@angular/core';
import { LugaresService } from 'src/app/service/maps';


@Component({
  selector: 'app-barra-de-busqueda',
  templateUrl: './barra-de-busqueda.component.html',
  styleUrls: ['./barra-de-busqueda.component.css']
})
export class BarraDeBusquedaComponent implements OnInit {

  private debounceTimer?: NodeJS.Timeout;

  constructor(private lugaresService:LugaresService) { }

  ngOnInit(): void {
  }

  onQueryChanged(query: string = '') {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {

     this.lugaresService.getLugaresPorBusqueda( query );
      
    }, 1000)
  }



}
