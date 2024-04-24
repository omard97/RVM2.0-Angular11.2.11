import { Component, OnInit } from '@angular/core';
import { MapReclamoService, PlacesReclamoService } from '../../services';
import { Feature } from '../../interfaces/places';
import { ReclamoComponent } from '../../../reclamo.component';
import { concat } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resultados-lugares-reclamo',
  templateUrl: './resultados-lugares-reclamo.component.html',
  styleUrls: ['./resultados-lugares-reclamo.component.css']
})
export class ResultadosLugaresReclamoComponent implements OnInit {
  public selectedId:  string = '';
  constructor(private placesReclamoService: PlacesReclamoService, private mapReclamoService: MapReclamoService, private reclamoService: ReclamoComponent, private toastr:ToastrService) {
    

    
  }

  calle: string = ''; // variable que se usa para registrar el reclamo
  altura: string =''; // variable que se usa para registrar el reclamo
  localidad: string = '';
  ubicacionCompleta : string = '';
  localidadUnica : string = '';

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
    debugger
    this.localidadUnica = place.context[1].text; // localidad para validar en reclamo y si se registra o no
    this.calle = place.text.toUpperCase(); //Nombre de la calle que seleccioné
    this.altura = place.address;// altura de la calle que seleccioné
    this.localidad = place.place_name;
    this.ubicacionCompleta = this.calle + ' ' + this.altura; 
    debugger
    if(this.localidad.includes('Villa María') || this.localidad.includes('Villa María')){
      if(this.altura !=undefined && this.calle!=undefined){

      
        this.reclamoService.rellenarUbicacion(this.calle, this.altura, this.localidad , this.ubicacionCompleta, this.localidadUnica);
  
        this.selectedId = place.id; /* ya se que id de ubicacion es */
        console.log('ID Selecionado: ', this.selectedId)
        const[ lng , lat ] = place.center;
        this.reclamoService.almacenarUbicacion(lng,lat); /* se lo envio al componente reclamo para luego poder guardar la ubicacion en el mapa */
        this.mapReclamoService.flyTo([lng , lat])
    
        
        
        this.placesReclamoService.ocultarListaResultados();
      } else{
        this.toastr.info(
          'Ingrese la altura de la dirección deseada',
          ''
        );
      }
    }else{
      this.toastr.info(
        'Realice la busqueda dentro de la provincia de Córdoba',
        ''
      );
    }


   
   

  }

}
