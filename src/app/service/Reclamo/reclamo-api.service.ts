import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamoApiService {

   objetoRecibido : any ;
  //cabeceras http
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http:HttpClient) { }


  envioDatosVehicular(data:any){
    
   /*  this.objetoRecibido = data;
    console.log('Datos en reclamo-api: ', this.objetoRecibido)
 */
  }


}
