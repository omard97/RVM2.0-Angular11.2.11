import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { VE_ReclamosXLocalidades } from 'src/app/model/Estadistica/VE_ReclamosXLocalidades';
import { VeReclamosLocalidadXCalle } from 'src/app/model/Estadistica/VeReclamosLocalidadXCalle';
import { EstadisticaService } from 'src/app/service/Estadistica/estadistica.service';
import { MenuApiService } from 'src/app/service/Menu/menu-api.service';
import { BackenApiService } from 'src/app/service/backen-api.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  ruta: any;
  IDUsuario: any;
  IDRol: any;

  usuario = {
    idUsuario: 0,
    nick: '',
    idRol: 0,
    rol: ''
  }

  localidadXcalle!:VeReclamosLocalidadXCalle[];
  

  tarjetasLocalidades:VE_ReclamosXLocalidades[] = [];

  constructor( private titulo:Title,private serviceUsuario: MenuApiService, private service:BackenApiService, private serviceEstadistica:EstadisticaService) {

    titulo.setTitle('Estadísticas');
    this.ruta = window.location.pathname.split('/');
     this.usuario.idUsuario = this.ruta[2];
     this.getRolUsuario();
     this.getTarjetas();
   }

  ngOnInit(): void {
  }

  getRolUsuario() {
    this.serviceUsuario.getRolUsuario(this.usuario.idUsuario).subscribe (
      (data) => {
        this.usuario.idUsuario = data[0].idUsuario,
          this.usuario.nick = data[0].nick,
          this.usuario.idRol = data[0].idRol,
          this.usuario.rol = data[0].rol        
          
      },
      (error) => {
        console.error(error);
      }
    )
  }

  getTarjetas(){ 
    this.service.getReclamosXLocalidades(this.usuario.idUsuario).subscribe(
      (res) => {

       this.tarjetasLocalidades = res;
       console.log(this.tarjetasLocalidades)
       debugger
        
      },
      (error) => {
        console.error(error);
      }
    )
  }


  verEstadistica(IDUsuario:number, IDLocalidad:number){
    debugger
    this.serviceEstadistica.getReclamosLocalidadesXCalle(IDLocalidad,IDUsuario).subscribe(
      (data) => {
        debugger
        console.log(data)
        this.localidadXcalle = data;
      },
      (err) =>{
        console.log(err)
      }
    )
   
  }



/* 
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendPosition: string = 'below';
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };
  schemeType: string = 'linear'; */






}


