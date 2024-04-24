import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { estadisticaGeneral } from 'src/app/model/Estadistica/EstPorcentajeCalleXLocalidad';
import { VE_CallesXlocalidad2 } from 'src/app/model/Estadistica/VE_CallesXlocalidad2';

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

  estadisticaGeneral: estadisticaGeneral[] = [];

  callesDeLaLocalidad: VE_CallesXlocalidad2[] = [];//grafico 2 de torta - visualiza las cantidad de reclamos que se hicieron en la localidad especificando la calle

  constructor( private titulo:Title,private serviceUsuario: MenuApiService, private service:BackenApiService, private serviceEstadistica:EstadisticaService) {

    titulo.setTitle('Estadísticas');
    this.ruta = window.location.pathname.split('/');
     this.usuario.idUsuario = this.ruta[2];
     this.getRolUsuario();
     this.getTarjetas();
     this.getPorcentajesLocalidades(); //utilizado para rellenar el grafico estilo torta general - el primer grafico
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
 //tarjetas en la cual 
  getTarjetas(){ 
    this.service.getReclamosXLocalidades(this.usuario.idUsuario).subscribe(
      (res) => {

       this.tarjetasLocalidades = res;
       console.log(this.tarjetasLocalidades)
       
        
      },
      (error) => {
        console.error(error);
      }
    )
  }

 

  
  //Estadisticas generales / usado para el usuario logueado

  getPorcentajesLocalidades(){
    this.serviceEstadistica.getEstadisticaGeneral(this.usuario.idUsuario).subscribe(
      (res) => {

       this.estadisticaGeneral= res;
       
       
        
      },
      (error) => {
        console.error(error);
      }
    )
  }

   // metodo click que rellena los graficos dependiendo de que localidad se seleccionoGrupos de barras 
   verEstadistica(IDUsuario:number, IDLocalidad:number){
    this.localidadXcalle = [];
    this.serviceEstadistica.getReclamosLocalidadesXCalle(IDLocalidad,IDUsuario).subscribe(
      (data) => {
        
        console.log(data)
        this.localidadXcalle = data;

        debugger
        //Crear un metodo en el cual rellene el segundo grafico de torta, visualize el nombre de la calle y su porcentaje de calles que es la cantidad
        this.getCallesXLocalidad2(IDUsuario,IDLocalidad);

      },
      (err) =>{
        console.log(err)
      }
    )
   
  }

  getCallesXLocalidad2(IDUsuario:number, IDLocalidad:number){
    debugger
    this.serviceEstadistica.getVE_CallesXlocalidad2(IDUsuario,IDLocalidad).subscribe(
      (data) => {
        debugger
        console.log(data)
        this.callesDeLaLocalidad = data;

        //segunda estadistica
 
      },
      (err) =>{
        console.log(err)
      }
    )
  }


  //Torta con porcentaje - es la general
  
  viewPieG1: any[] = [];

  // options
  gradientPie: boolean = true;
  showLegendPie: boolean = true;
  showLabelsPie: boolean = true;
  isDoughnutPie: boolean = true;
  animacionBarras:boolean= true;
  label1:string ='Total de Reclamos'
  colorSchemePie = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  //Segunda torta con porcentajes - visualiza el porcentaje de calles
  viewPie2: any[] = [];

  // options
  gradientPie2: boolean = true;
  showLegendPie2: boolean = true;
  showLabelsPie2: boolean = true;
  isDoughnutPie2: boolean = true;
  animacionBarras2:boolean= true;
  label2:string ='Total de Reclamos'
  colorSchemePie2 = {
    domain: [' #1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
    '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
    '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5',
    '#393b79', '#e6550d', '#637939', '#b5cf6b', '#8c6d31',
    '#843c39', '#d6616b', '#d7b5d8', '#7b4173', '#a55194',
    '#ce6dbd', '#de9ed6', '#17becf', '#9c9ede', '#7375b5',
    '#575757', '#1c1c1c', '#bcbd22', '#7f7f7f', '#bcbd22',
    '#17becf', '#ff9896', '#aec7e8', '#ffbb78', '#98df8a',
    '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b',
    '#e377c2', '#7f7f7f', '#c49c94', '#c7c7c7', '#f7b6d2',
    '#c5b0d5', '#dbdb8d', '#9edae5', '#393b79', '#e6550d',
    '#637939', '#b5cf6b', '#8c6d31', '#843c39', '#d6616b',
    '#d7b5d8', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6',
    '#9c9ede', '#7375b5', '#575757', '#1c1c1c', '#bcbd22',
    '#7f7f7f', '#bcbd22', '#17becf', '#ffbb78', '#98df8a',
    '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b',
    '#e377c2', '#7f7f7f', '#c49c94', '#c7c7c7', '#f7b6d2',
    '#c5b0d5', '#dbdb8d', '#9edae5', '#393b79', '#e6550d',
    '#637939', '#b5cf6b', '#8c6d31', '#843c39', '#d6616b',
    '#d7b5d8', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6',
    '#9c9ede', '#7375b5', '#575757', '#1c1c1c']
  };


 









}


