import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { RecuentoRecAmbiental } from 'src/app/model/Dashboard/V_CantidadRecAmbientalUsuario';
import { CantReclamoMesyAnio } from 'src/app/model/Dashboard/V_CantidadRecPorMesyAnio';
import { RecuentoTipReclamos } from 'src/app/model/Dashboard/V_CantidadTipReclamoUsuario';
import { RecuentoTarjetas } from 'src/app/model/Dashboard/V_RecuentoReclamos';
import { RecuentoTotal } from 'src/app/model/Dashboard/V_RecuentoTotal';
import { MenuApiService } from 'src/app/service/Menu/menu-api.service';
import { BackenApiService } from 'src/app/service/backen-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  txtAnio = new FormControl('', [Validators.required]);
  ruta: any;
  IDUsuario: any;
  IDRol: any;
  IDSesion: any;
  dataService = [];
  date = new Date();
  anio:any;
  
 
   

  recuentoTarjeta!: RecuentoTarjetas[]; /* cantidad de reclamos dependiendo del usuario */

  arregloRecuentoTotal!: RecuentoTotal[]; /* Cantidad total de reclamos */

  arregloTipoReclamos!:RecuentoTipReclamos[];

  arregloReclamosAmbientales!:RecuentoRecAmbiental[];

  arregloReclamosDeMesesyAnio!:CantReclamoMesyAnio[];

  usuario = {
    idUsuario: 0,
    nick: '',
    idRol: 0,
    rol: ''
  }
  constructor(private serviceUsuario: MenuApiService, private Estadistica: BackenApiService, private toastr: ToastrService, private titulo:Title) {
     /* Object.assign(this, { multi }); */
     titulo.setTitle('Dashboard')
     this.ruta = window.location.pathname.split('/');
     this.usuario.idUsuario = this.ruta[2];
     console.clear();
     this.getRolUsuario();
    
   }

  ngOnInit(): void {
    
  }

  /* grid circulares */
  
  colorScheme = {
    domain: ['#ff0000', '#a4c60d', '#db6a00', '#0b7010', '#CFC0BB'],
    /* Descartado, en revisión, Pendiente, Solucionado, total de reclamos */
  };
  cardColor: string = '#163543';
  fitContainerTarjetas=true;
  animationTarjeta=true;
  /* textColor="#ffffff"  *//* Para todos los contenedores */
  
 
  
  onSelect(event: any) {} 
/*----------------------------------------------------------------------------------------------------  */
  /* Nueva grafica - ggrafica de barras para tipos de reclamos */

    multi!: any[];
    
    /* viewBarratipos: any[] = [5000, 100]; */ /* Dimension - altura y ancho */
    fitContainerBarra=true;
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = true;
    showLegendBarra = false; /* ver la lista de barras */
    showXAxisLabel = true;
    xAxisLabel = 'Tipo De Reclamos Realizados';
    showYAxisLabel = true;
    yAxisLabel = 'Realizados';
    rotateXAxisTicks=true;
    showGridLines: boolean = false;
    colorScheme3 = {
      domain: ['#1f77b4', '#1f77b4']
    };


    view2: any[] = [,];
    showXAxis2 = true;
    showYAxis2 = true;
    gradient2 = true;
    showLegend2 = true;
    showXAxisLabel2 = true;
    xAxisLabel2 = 'Tipo De Reclamos Realizados';
    showYAxisLabel2 = true;
    yAxisLabel2 = 'Cantidad';
    showDataLabel2:boolean = true;
    colorScheme2 = {
      domain: ['#4CAF50', '#FFC107']
    };

  /*----------------------------------------------------------------------------------------------------  */

  /*----------------------------------------------------------------------------------------------------  */
  /* grafico de reclamo ambientales - utiliza las mismas opciones de diseño pero se modifican los colores y textos */
  colorSchemeBarraAmbiental="forest";
  yAxisLabelAmbiental = 'Realizados';
  xAxisLabelAmbiental = 'Reclamos Ambientales Realizados';
  showDataLabel1:boolean = true;







  /* Estaditicas formato Torta */
  /* viewTorta: any[] = [700, 900]; */

  // options
  gradientTorta: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  animations2: boolean = true;
  legendPosition: string = 'right';
  legendtitleTorta:string='Categorías';

  colorSchemeTorta = {
    domain: ['#5AA454', '#FFAE00', '#C7B42C', '#AAAAAA']
  };
  
  /*------------------------------------------------------------- */

  /* Estadisticas de torta - tipos de reclamos ambientales */

  // options
  vistaTorta3:any[]=[100,100]
  showLegend3: boolean = true;
  showLabels3: boolean = true;
  animations3: boolean = true;
  showlabels3: boolean=true;
  gradient3:   boolean=true;

  legendtitle: string='Causas';
  legendPosicion3: string = 'right';
  

  
  /*------------------------------------------------------------- */

  /* tabla vertical - cantidad de reclamos pormes del año */
 /*  viewTorta:[number,number] = [1000, 300]; */ /* ancho-alto */
  // options
  showXAxis5 = true;
  showYAxis5 = true;
  gradient5 = true;
  showLegend5 = false;
  showXAxisLabel5 = true;
  animacionBarras:boolean=true;
  xAxisLabel5 = `Reclamos del Año Realizados`;
  showYAxisLabel5 = true;
  yAxisLabel5 = 'Cantidad';
  tituloLeyenda:string="Mes"
/*   colorScheme5 = {
    domain: [ '#87CEEB',  // Enero: Azul claro
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
  }; */
  view4: any[] = [,];
  showXAxis4: boolean = true;
  showYAxis4: boolean = true;
  gradient4: boolean = true;
  showLegend4: boolean = true;
  showXAxisLabel4: boolean = true;
  yAxisLabel4: string = 'Meses';
  showYAxisLabel4: boolean = true;
  xAxisLabel4: string = 'Cantidad';
  showDataLabel4:boolean = true;

  colorScheme5 = {
    domain: [
     
        // Verano
        '#d9d65c',  // Junio: Amarillo oro
        '#FFA500',  // Julio: Naranja
        '#FF6347',  // Agosto: Rosa coral
    
        // Otoño
        '#8B4513',  // Septiembre: Marrón
        '#FF4500',  // Octubre: Rojo anaranjado
        '#8A2BE2',  // Noviembre: Azul púrpura
    
        // Invierno
        '#4682B4',  // Diciembre: Azul acero
        '#778899',  // Enero: Gris azulado
        '#87CEEB',  // Febrero: Azul cielo
    
        // Primavera
        '#7FFF00',  // Marzo: Verde lima
        '#00FF7F',  // Abril: Verde primavera
        '#d9d65c'   // Mayo: Amarillo oro
    
    ]
  };




  /* utilizado solamente para visualizar etiquetas que dependen del rol del usuario */
    getRolUsuario() {
    this.serviceUsuario.getRolUsuario(this.usuario.idUsuario).subscribe (
      (data) => {
        this.usuario.idUsuario = data[0].idUsuario,
          this.usuario.nick = data[0].nick,
          this.usuario.idRol = data[0].idRol,
          this.usuario.rol = data[0].rol
        
         this.getRecuentoRecAmbientales();

      },
      (error) => {
        console.error(error);
      }
    )

  }

  getRecuentoTarjetas() {
    /* Admin */
    if(this.usuario.idRol ==1 || this.usuario.idRol ==2){
      this.Estadistica.getRecuentoReclamos().subscribe(
        (data) => {
          
         this.recuentoTarjeta=data;
         this.getRecuentoTotal();
         
        },
        (error) => {
          console.log(error);
        }
      );
    }else{
      this.Estadistica.getCantidadReclamosUsuario(this.usuario.idUsuario).subscribe(
        (data) => {
          
         this.recuentoTarjeta=data;
         this.getRecuentoTotal();
        },
        (error) => {
          console.log(error);
        }
      );
    }  
  }
   /* tarjeta con el total de reclamos */
  getRecuentoTotal() {
    /* Admin */
    if(this.usuario.idRol ==1 || this.usuario.idRol ==2){
      
      this.Estadistica.getReclamosTotales(0,this.usuario.idRol ).subscribe(
        (resp) => {
          
          this.arregloRecuentoTotal=resp;

          /* Se le adjunta el total a las tarjetas */
          this.recuentoTarjeta = this.recuentoTarjeta.concat(this.arregloRecuentoTotal);
          this.getRecuentoTiposReclamos();
          
        },
        (error) => {
          console.log(error);
        }
      );

    }else{
      this.Estadistica.getReclamosTotales(this.usuario.idUsuario,this.usuario.idRol ).subscribe(
        (resp) => {
          this.arregloRecuentoTotal=resp;

          /* Se le adjunta el total a las tarjetas */
          this.recuentoTarjeta = this.recuentoTarjeta.concat(this.arregloRecuentoTotal);
          this.getRecuentoTiposReclamos();
          
        },
        (error) => {
          console.log(error);
        }
      );
    }
    
  }

  /* Grafico Torta - cantidad de reclamos */
  getRecuentoTiposReclamos(){
    /* Administrador */
    if(this.usuario.idRol ==1 || this.usuario.idRol ==2){

      this.Estadistica.getRecuentoTiposReclamosUsuario(0,this.usuario.idRol ).subscribe(
        (info)=>{
          this.arregloTipoReclamos=info;
          this.getCantidadReclamosMesyAnio();
        },
        (error) => {
          console.log(error);
        }
      )
    }else{
      /* Usuario */
      this.Estadistica.getRecuentoTiposReclamosUsuario(this.usuario.idUsuario,0).subscribe(
        (info)=>{
          this.arregloTipoReclamos=info;
          this.getCantidadReclamosMesyAnio();
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  /* grafico de torta tipos de reclamos ambientales */
  getRecuentoRecAmbientales(){
    if(this.usuario.idRol ==1 || this.usuario.idRol ==2){

      this.Estadistica.getRecuentoReclamosAmbientalesUsuario(0,this.usuario.idRol ).subscribe(
        (dato)=>{
          this.arregloReclamosAmbientales=dato;
          this.getRecuentoTarjetas();
        },
        (error) => {
          console.log(error);
        }
      )

    }else{
      this.Estadistica.getRecuentoReclamosAmbientalesUsuario(this.usuario.idUsuario,this.usuario.idRol ).subscribe(
        (dato)=>{
          this.arregloReclamosAmbientales=dato;
          this.getRecuentoTarjetas();
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  /* Grafico de barras verticales al abrir pantalla */
  getCantidadReclamosMesyAnio(){
    
      this.anio=this.date.getFullYear();

      this.Estadistica.getRecuentoReclamosDelAnio(this.usuario.idUsuario,this.anio+'',this.usuario.idRol ).subscribe(
        (dato)=>{
          
          this.arregloReclamosDeMesesyAnio=dato;
        },
        (error) => {
          console.log(error);
        }
      ) 

  }

  btnBuscarReclamosAnio(){
    if(this.txtAnio.value=='' || (this.txtAnio.value<2019 || this.txtAnio.value>this.anio)){
      this.toastr.info(
        'Ingrese un año valido.',
        'Atención',
        {
          timeOut: 5000,
          progressBar: true,
        }
      );

    }else{
     
        
        this.Estadistica.getRecuentoReclamosDelAnio(this.usuario.idUsuario,this.txtAnio.value,this.usuario.idRol ).subscribe(
          (dato)=>{
            
            this.arregloReclamosDeMesesyAnio=dato;
            if(dato.length==0){
              this.toastr.info(
                'No se encuentran datos registrados para el año ingresado',
                'Atención',
                {
                  timeOut: 5000,
                  progressBar: true,
                }
              );
            }
          },
          (error) => {
            this.toastr.warning(
              'Ocurrio un error al ingresar el año deseado',
              'Atención',
              {
                timeOut: 5000,
                progressBar: true,
              }
            );
          }
        )
      
     
    }
    

  }

}
