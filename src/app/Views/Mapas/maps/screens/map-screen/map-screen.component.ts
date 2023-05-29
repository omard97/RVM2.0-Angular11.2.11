import { Component } from '@angular/core';
import { LugaresService } from 'src/app/service/maps';


@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.css']
})
export class MapScreenComponent {

  constructor(private ubicacionService: LugaresService) { 

   
  }

  

  get isUserLocationReady(){
    return this.ubicacionService.isUserLocationReady;
  }


}
