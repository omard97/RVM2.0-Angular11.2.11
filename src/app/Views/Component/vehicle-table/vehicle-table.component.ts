import { Component, Input, OnInit } from '@angular/core';
import { ReclamoApiService } from 'src/app/service/Reclamo/reclamo-api.service';
import { BackenApiService } from 'src/app/service/backen-api.service';

@Component({
  selector: 'app-vehicle-table',
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.css']
})
export class VehicleTableComponent implements OnInit {
  rutaURL:any;
  idDetalleReclamoRuta:number =0;
  arregloDetalleReclamo:any;

  constructor(private service:BackenApiService) {
    debugger
    this.rutaURL = window.location.pathname.split('/');
    this.idDetalleReclamoRuta = this.rutaURL[4];
    this.getDetalleVehicularParaActualizar(this.idDetalleReclamoRuta);
   }

  ngOnInit(): void {

  }

  getDetalleVehicularParaActualizar(idDetalleReclamoRuta: number) {

    
    this.service.getDetalleReclamoVehicular(idDetalleReclamoRuta).subscribe(
      (info) => {
        debugger
        this.arregloDetalleReclamo = info;
      
      },
      (error) => {
        console.log(error);
      }
    );
  }

  

}
