import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, LugaresResponse } from 'src/app/Views/Mapas/maps/interfaces/lugares';



@Injectable({
  providedIn: 'root'
})
export class LugaresService {

  public userLocation?: [number, number] | undefined;
  
  //obtener los lugares previamente de la busqueda
  public isLoadingPlaces: boolean = false;
  public lugares: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor(private http: HttpClient) {
    this.getUserLocation();
  }


  public async getUserLocation(): Promise<[number, number]> {

    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];

          resolve(this.userLocation);
        },
        (err) => {
          alert('No se puede obtener la geolocalizacioin'),
            console.log(err);
          reject();
        }
      )

    })
  }

  //getPlacesByQuery
  getLugaresPorBusqueda(query: string = '') {
    // todo: evaluar cuando el query es nulo

    this.isLoadingPlaces=true;

    this.http.get<LugaresResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?country=ar&proximity=-73.990593%2C40.740121&access_token=pk.eyJ1Ijoib21hcmQ5NyIsImEiOiJjbGhpdGE4d3MwMGNtM2dwc3lnZjc0ZTk3In0.OdWECTi0zDbRihpSeWKSOg`).subscribe(resp => {

    console.log(resp.features)
    this.isLoadingPlaces = false;
    this.lugares = resp.features;

    })
  }
}
