import { formatDate } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { estadisticaGeneral } from 'src/app/model/Estadistica/EstPorcentajeCalleXLocalidad';
import { VE_CallesXlocalidad2 } from 'src/app/model/Estadistica/VE_CallesXlocalidad2';

import { VE_ReclamosXLocalidades } from 'src/app/model/Estadistica/VE_ReclamosXLocalidades';
import { V_CantidadTipoReclamoDelMes } from 'src/app/model/Estadistica/V_CantidadTipoReclamoDelMes';
import { V_EstadisticaXmes } from 'src/app/model/Estadistica/V_EstadisticaXmes';
import { V_ReclamosEnElTiempo } from 'src/app/model/Estadistica/V_ReclamosEnElTiempo';
import { VeReclamosLocalidadXCalle } from 'src/app/model/Estadistica/VeReclamosLocalidadXCalle';
import { v_ReclamosEnLaSemana } from 'src/app/model/Estadistica/v_ReclamosEnLaSemana';
import { EstadisticaService } from 'src/app/service/Estadistica/estadistica.service';
import { MenuApiService } from 'src/app/service/Menu/menu-api.service';
import { BackenApiService } from 'src/app/service/backen-api.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EstadisticasComponent implements OnInit {
  localidadCtrl = new FormControl('', [Validators.required]);
  anioCtrl = new FormControl('', [Validators.required]);
  selectIDLocalidad = 0; /* Variable para capturar el valor del tipo de reclamo */
  selectAnioLocalidad = 0; //Variable para obtener el año para luego filtrar
  ruta: any;
  IDUsuario: any;
  IDRol: any;
  fecha:string;
  mesActual:string;
  idlocalidadInicio:number = 1 //1 = es Villa María por defecto
  nombrePieLocalidad:string = '';
  banderaFiltro:number=1; // 1 no se usa el filtro, 2 si se usa filtro
 
  nombreLocalidadSeleccionada: string=''  ;

  usuario = {
    idUsuario: 0,
    nick: '',
    idRol: 0,
    rol: ''
  }

  mes = [
    {
      name: "Enero",
      value: 0,
    },
    {
      name: "Febrero",
      value: 0,
    },
    {
      name: "Marzo",
      value: 0,
    },
    {
      name: "Abril",
      value: 0,
    },
    {
      name: "Mayo",
      value: 0,
    },
    {
      name: "Junio",
      value: 0,
    },
    {
      name: "Julio",
      value: 0,
    },

    {
      name: "Agosto",
      value: 0,
    },
    {
      name: "Septiembre",
      value: 0,
    },
    {
      name: "Octubre",
      value: 0,
    },
    {
      name: "Noviembre",
      value: 0,
    },
    {
      name: "Diciembre",
      value: 0,
    }

  ]


  localidadXcalle!:VeReclamosLocalidadXCalle[];
  

  tarjetasLocalidades:VE_ReclamosXLocalidades[] = [];

  estadisticaGeneral: estadisticaGeneral[] = [];

  callesDeLaLocalidad: VE_CallesXlocalidad2[] = [];//grafico 2 de torta - visualiza las cantidad de reclamos que se hicieron en la localidad especificando la calle
  V_EstadisticaXmess: V_EstadisticaXmes[] = [];
  v_ReclamosEnLaSemanaa: v_ReclamosEnLaSemana[] = [];
  V_CantidadTipoReclamoDelMess : V_CantidadTipoReclamoDelMes[] = [];
  V_ReclamosEnElTiempoo : V_ReclamosEnElTiempo[]=[];

  constructor( private titulo:Title,private serviceUsuario: MenuApiService, private service:BackenApiService, private serviceEstadistica:EstadisticaService) {
    
   
    titulo.setTitle('Estadísticas');
    this.fecha = new Date().getFullYear().toString();
    this.mesActual = (new Date().getMonth() + 1).toString();
    
    this.ruta = window.location.pathname.split('/');
    this.usuario.idUsuario = this.ruta[2];
     
     this.getRolUsuario();
     //this.getTarjetas();
     //this.getPorcentajesLocalidades(); //utilizado para rellenar el grafico estilo torta general - el primer grafico
     //this.V_EstadisticaXmes(this.usuario.idUsuario, this.usuario.idRol,this.fecha);
     
     //this.verEstadistica(this.usuario.idUsuario,this.idlocalidadInicio)
    

    /*  if(this.usuario.idUsuario==1){
      debugger
      this.v_ReclamosEnLaSemana(1,this.usuario.idUsuario,Number(this.mesActual),Number(this.fecha))
      
      this.V_CantidadTipoReclamoDelMes(1,this.usuario.idUsuario,Number(this.mesActual),Number(this.fecha))
      this.V_ReclamosEnElTiempo(1,this.usuario.idUsuario,Number(this.mesActual),Number(this.fecha))
     }else{
      debugger
      this.v_ReclamosEnLaSemana(3,this.usuario.idUsuario,Number(this.mesActual),Number(this.fecha))
      this.V_CantidadTipoReclamoDelMes(3,this.usuario.idUsuario,Number(this.mesActual),Number(this.fecha))
      this.V_ReclamosEnElTiempo(3,this.usuario.idUsuario,Number(this.mesActual),Number(this.fecha))
     } */
   }

  ngOnInit(): void {
    this.localidadCtrl.valueChanges.subscribe(idLocalidad => {
      const selectedLocalidad = this.tarjetasLocalidades.find(item => item.idLocalidad === idLocalidad);
      this.nombreLocalidadSeleccionada = selectedLocalidad ? selectedLocalidad.localidad : '';
    });
  }

  //select localidades, selecciona una localidad y se actualiza el grafico
  obtenerIDLocalidad(ev: any) { 
    this.selectIDLocalidad = ev.target.value;
    const idLocalidad = (ev.target as HTMLSelectElement).value;
    console.log(this.selectIDLocalidad);
    
    this.verEstadistica(this.usuario.idUsuario,this.selectIDLocalidad, this.usuario.idRol)
  }

  obtenerAnio(ev: any) {
    this.selectAnioLocalidad = ev.target.value;
    console.log(this.selectAnioLocalidad);
      
  }

  getRolUsuario() {
    
    this.serviceUsuario.getRolUsuario(this.usuario.idUsuario).subscribe (
      (data) => {
        this.usuario.idUsuario = data[0].idUsuario,
          this.usuario.nick = data[0].nick,
          this.usuario.idRol = data[0].idRol,
          this.usuario.rol = data[0].rol     
          this.getTarjetas(); //Son tarjetas pero es el select de localidades
          
      },
      (error) => {
        console.error(error);
      }
    )
  }
 //Select que contiene todas las localidades tanto para administrador como usuario 
  getTarjetas(){ 
   
    this.service.getReclamosXLocalidades(this.usuario.idUsuario,this.usuario.idRol).subscribe(
      (res) => {

       this.tarjetasLocalidades = res;
       console.log(this.tarjetasLocalidades)
       
        this.getPorcentajesLocalidades();
      },
      (error) => {
        console.error(error);
      }
    )
  }

 

  
  //Estadisticas generales / usado para el usuario logueado / primer grafico
  getPorcentajesLocalidades(){
    
    this.serviceEstadistica.getEstadisticaGeneral(this.usuario.idUsuario, this.usuario.idRol).subscribe(
      (res) => {

       this.estadisticaGeneral= res;
       //muestro la barra de calles
       
       this.verEstadistica(this.usuario.idUsuario, 1, this.usuario.idRol)
        
      },
      (error) => {
        console.error(error);
      }
    )
  }

   // metodo click que rellena los graficos dependiendo de que localidad se seleccionoGrupos de barras 
   verEstadistica(IDUsuario:number, IDLocalidad:number,idrol:number){
    //2do grafico
    if(this.banderaFiltro==1){
      //si no se usa el filtro entonces actualiza el segundo grafico
      //No llamar al metodo, hacer el llamado a la peticion desde este mismo, sino se actualizan todos los graficos
      this.getCallesXLocalidad2(IDUsuario,IDLocalidad, idrol);
    }else{
      // cuando se usa el filtro que 
      //terminar esto
      this.serviceEstadistica.getVE_CallesXlocalidad2(IDUsuario,IDLocalidad,idrol).subscribe(
        (data) => {
        
          console.log(data)
        
          this.callesDeLaLocalidad = data;
  
          //3er grafico - por meses 
         
   
        },
        (err) =>{
          console.log(err)
        }
      )
    }
  
    /* this.localidadXcalle = [];
    
    this.serviceEstadistica.getReclamosLocalidadesXCalle(IDLocalidad,IDUsuario, this.usuario.idRol).subscribe(
      (data) => {
        
        console.log(data)
        this.localidadXcalle = data;

        debugger
        
       
        

      },
      (err) =>{
        console.log(err)
      }
    ) */
   
  }

  //2do grafico luego de seleccionar la localidad 
  getCallesXLocalidad2(IDUsuario:number, IDLocalidad:number, idrol:number){
  
    
    this.serviceEstadistica.getVE_CallesXlocalidad2(IDUsuario,IDLocalidad,idrol).subscribe(
      (data) => {
      
        console.log(data)
      
        this.callesDeLaLocalidad = data;

        //3er grafico - por meses 
        this.V_EstadisticaXmes(this.usuario.idUsuario, this.usuario.idRol,this.fecha);
 
      },
      (err) =>{
        console.log(err)
      }
    )
  }


  //Torta con porcentaje - es la general
  
  viewPieG1: number[] = [0,0];

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
  gradient: boolean = true;
  showLegendPie2: boolean = true;
  showLabelsPie2: boolean = true;
  isDoughnutPie2: boolean = true;
  animacionBarras2:boolean= true;
  label2:string = 'Reclamos realizados por calle'
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

  //3er grafico - tabla horizontal el cual muestra la cantidad de reclamos en el año
  V_EstadisticaXmes(IDUsuario:number, idRol:number, fecha:string){

    this.serviceEstadistica.V_EstadisticaXmes(IDUsuario,idRol,fecha).subscribe(
      (data) => {
        
        this.V_EstadisticaXmess = data;
        //4to grafico de reclamos en la semana
        
        this.v_ReclamosEnLaSemana(this.usuario.idRol,this.usuario.idUsuario,Number(this.mesActual),Number(this.fecha))
        //

      },
      (err) =>{
        console.log(err)
      }
    )
    
  }
  selectMes(event:any){
    
    if(this.banderaFiltro==1){
      //No se está usando los filtros, cuando el usuario abre la pantalla y quiere seleccionar los meses del grafico
      //metodos cuando solo se selecciona el mes deseado del grafico
      console.log('Mes seleccionado' + event.name) //nombre
      this.serviceEstadistica.V_ReclamoEnLaSemanaDelMes(this.usuario.idRol,this.usuario.idUsuario,event.name,Number(this.fecha)).subscribe(
        (data)=>{
          this.v_ReclamosEnLaSemanaa = []
          this.v_ReclamosEnLaSemanaa = data
          console.log(data)
        
        },
        (err)=>{
          console.log(err)
        }

      )
      
      //tipos de reclamos en ese mes seleccionado
      this.serviceEstadistica.V_CantidadTipoReclamoDelMesSelect(this.usuario.idRol,this.usuario.idUsuario,event.name,Number(this.fecha)).subscribe(
        (data)=>{
          this.V_CantidadTipoReclamoDelMess = []
          this.V_CantidadTipoReclamoDelMess = data
          console.log(data)
        
        },
        (err)=>{
          console.log(err)
        }

      )
    }else{

      //Se usaron los filtros, entonces el grafico de barras tiene que filtrar por filtros
      this.v_ReclamosEnLaSemanaFiltro(this.usuario.idRol,this.usuario.idUsuario,event.name,this.selectAnioLocalidad,this.selectIDLocalidad)

      this.V_CantidadTipoReclamoDelMesSelectFiltro(this.usuario.idRol,this.usuario.idUsuario,event.name,this.selectAnioLocalidad,this.selectIDLocalidad)
    }


    
    
    //crear un metodo que me busque el mes con los datos y mostrar las semanas 
    //his.v_ReclamosEnLaSemana(this.usuario.idRol,this.usuario.idUsuario,Number(this.mesActual),Number(this.fecha)) /* Number(this.mesActual) */
  }
  showXAxis3: boolean = true;
  showYAxis3: boolean = true;
  gradient3: boolean = true;
  showLegend3: boolean = false;
  showXAxisLabel3: boolean = true;
  yAxisLabel3: string = 'Mese/s';
  showYAxisLabel3: boolean = true;
  xAxisLabel3: string = 'Cantidad';
  showDataLabel3:boolean = true;

  colorScheme3 = {
    domain: [
      '#87CEEB',  // Enero: Azul claro
      '#0abfbc',  // Febrero: Rosa
      '#BFFF00',  // Marzo: Verde lima
      '#FFFF99',  // Abril: Amarillo pastel
      '#50C878',  // Mayo: Verde esmeralda
      '#FFA500',  // Junio: Naranja brillante
      '#DC143C',  // Julio: Rojo carmesí
      '#800080',  // Agosto: Morado profundo
      '#8B4513',  // Septiembre: Marrón tierra
      '#FF4500',  // Octubre: Anaranjado oscuro
      '#808000',  // Noviembre: Verde oliva
      '#4B0082'   // Diciembre: Azul índigo
    ]
  };

  v_ReclamosEnLaSemana(idRol:number, idUsuario:number, mes:number,anio:number){
    
    this.serviceEstadistica.v_ReclamosEnLaSemana(idRol,idUsuario,mes,anio).subscribe(
      (data)=>{
        this.v_ReclamosEnLaSemanaa = data
        console.log(this.v_ReclamosEnLaSemanaa)
        
        //5to grafico que muestra la cantidad de tipos de reclamos en el mes actual, cuando inicio la pantalla
        this.V_CantidadTipoReclamoDelMes(this.usuario.idRol,this.usuario.idUsuario,Number(this.mesActual),Number(this.fecha))
  
      },
      (err)=>{
        console.log(err)
      }
    )

  }

  //Grafico de dia de la semana
  view4: number[] = [200,300];
  showXAxis4 = true;
  showYAxis4 = true;
  gradient4 = true;
  showLegend4 = true;
  showXAxisLabel4 = true;
  xAxisLabel4 = 'Día/s';
  showYAxisLabel4 = true;
  yAxisLabel4 = 'Cantidad';
  showDataLabel:boolean = true;
  colorScheme = {
    domain: [' #1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2']
  };


  //grafico de tipos de reclamos en el mes y anio actual - cuando se abre la pantalla
  V_CantidadTipoReclamoDelMes(idRol:number, idUsuario:number, mes:number,anio:number){
    
    this.serviceEstadistica.V_CantidadTipoReclamoDelMes(idRol,idUsuario,mes,anio).subscribe(
      (data)=>{
        
        this.V_CantidadTipoReclamoDelMess = data
        //6to grafico, visualiza todos los reclamos con una hora promedio, muestra todos los que hiciste
        this.V_ReclamosEnElTiempo(this.usuario.idRol,this.usuario.idUsuario,Number(this.mesActual),Number(this.fecha))
       
      },
      (err)=>{
        console.log(err)
      }
    )

  }
  view5: number[] = [0,0];
  showXAxis5 = true;
  showYAxis5 = true;
  gradient5 = true;
  showLegend5 = false;
  showXAxisLabel5 = true;
  xAxisLabel5 = 'Tipo/s';
  showYAxisLabel5 = true;
  yAxisLabel5 = 'Cantidad';
  showDataLabel5= true;
 
  colorScheme5 = {
    domain: ['#4CAF50', '#FFC107']
  };





  V_ReclamosEnElTiempo(idRol:number, idUsuario:number, mes:number,anio:number){
    this.serviceEstadistica.V_ReclamosEnElTiempo(idRol,idUsuario,mes,anio).subscribe(
      (data)=>{
        
        this.V_ReclamosEnElTiempoo = data
       
      },
      (err)=>{
        console.log(err)
      }
    )

  }



  // options
  // ancho y alto
  view6: number[] = [0,0];
  showXAxis6 = true;
  showYAxis6 = true;
  gradient6 = true;
  showLegend6 = false;
  showXAxisLabel6 = true;
  xAxisLabel6 = 'Hora a.m - p.m';
  showYAxisLabel6 = true;
  yAxisLabel6 = 'Cantidad';
  showDataLabel6= true;
  

  colorScheme6 = {
    domain: ['#000000',
             '#000033',
             '#000066',
             '#000099',
             '#0000CC',
             '#0000FF', 
             '#FF6600', 
             '#FF8000',
             '#FF9900', 
             '#FFB266', 
             '#FFCC99', 
             '#FFE0B3', 
             '#FFFFCC', 
             '#FFFF99', 
             '#FFFF66', 
             '#FFFF33',
             '#FFFF00', 
             '#FFCC00', 
             '#FFB266', 
             '#FF9933', 
             '#FF8000', 
             '#CC6600', 
             '#993300', 
             '#660000']
};





filtrarEstadistica(idUsuario:number,IdRol:number, anio:number,idLocalidad:number){
  //Cuando se aprieta el boton de buscar por filtros
  this.banderaFiltro=2; // se usa el filtro
  

  if(IdRol==1){
  // Realizar funcionalidad para el administrador - front y back
  // Los filtros ya estan creados, solo queda realizar los metodos en angular y modificar la consulta de la api

    this.verEstadisticaFiltro(idUsuario,IdRol , anio,idLocalidad)
    this.V_ReclamosEnElTiempoFiltro(IdRol,idUsuario,IdRol,anio,idLocalidad)

  }else{
    this.verEstadisticaFiltro(idUsuario,IdRol , anio,idLocalidad)

    //Se paso el idrol a 0 asi entra en el metodo
    this.V_ReclamosEnElTiempoFiltro(IdRol,idUsuario,IdRol,anio,idLocalidad)
  }
}

  verEstadisticaFiltro(idUsuario:number,IdRol:number , anio:number,idLocalidad:number){
    this.V_EstadisticaXmess=[]
    this.serviceEstadistica.V_EstadisticaXmesFiltro(idUsuario,IdRol,anio,idLocalidad).subscribe(
      (data)=>{
        
        if(data.length == 0){



          this.V_EstadisticaXmess = this.mes 
        }else{
          this.V_EstadisticaXmess = data 
        }
          
      },
      (err)=>{
        console.log(err)
      }
    )
  }

  v_ReclamosEnLaSemanaFiltro(idRol:number,idUsuario:number, nombreMes:string,anio:number,idLocalidad:number){
    
    this.serviceEstadistica.v_ReclamosEnLaSemanaFiltro(idRol,idUsuario,nombreMes,anio,idLocalidad).subscribe(

      (data)=>{
        
        this.v_ReclamosEnLaSemanaa = []
          this.v_ReclamosEnLaSemanaa = data
      },
      (err)=>{
        console.log(err)
      }


    )
  }

  V_CantidadTipoReclamoDelMesSelectFiltro(idRol:number,idUsuario:number, nombreMes:string,anio:number,idLocalidad:number){
    this.serviceEstadistica.V_CantidadTipoReclamoDelMesSelectFiltro(idRol,idUsuario,nombreMes,anio,idLocalidad).subscribe(

      (data)=>{
        
        this.V_CantidadTipoReclamoDelMess = []
          this.V_CantidadTipoReclamoDelMess = data
      },
      (err)=>{
        console.log(err)
      }


    )


  }

  V_ReclamosEnElTiempoFiltro(idRol:number,idUsuario:number, mes:number,anio:number,idLocalidad:number){

    this.serviceEstadistica.V_ReclamosEnElTiempoFiltro(idRol,idUsuario,mes,anio,idLocalidad).subscribe(

      (data)=>{
        
        this.V_ReclamosEnElTiempoo = [];
        this.V_ReclamosEnElTiempoo = data;

      },
      (err)=>{
        console.log(err)
      }
    )
  }
  





}


