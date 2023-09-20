import { Component, OnInit } from '@angular/core';
import { ReclamoApiService } from 'src/app/service/Reclamo/reclamo-api.service';

@Component({
  selector: 'app-vehicle-table',
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.css']
})
export class VehicleTableComponent implements OnInit {
  public dataVehicular: any; /* se utiliza luego de cambiar de historial a editar reclamo */
  constructor(private servRecVehicular : ReclamoApiService) {


    
   }

  ngOnInit(): void {

    
  }

  recibirDatosVehicular(){
   

    /* this.dataVehicular = this.servRecVehicular.envioDatosVehicular; */
  }

}
