import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlacesApiClient } from 'src/app/Views/Mapas/maps/api/placesApiClient';

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

  constructor(private placesApiClient: PlacesApiClient) {
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
    if( query.length === 0 ){
      this.lugares = [];
      this.isLoadingPlaces = false;
      return;
    }

    if (!this.userLocation) throw Error('No hay userlocation');

    this.isLoadingPlaces = true;

    this.placesApiClient.get<LugaresResponse>(`/${query}.json`, {
      params: {
        proximity: this.userLocation.join(','),
      }
    }).subscribe(resp => {

      
      this.isLoadingPlaces = false;
      this.lugares = resp.features;

    });
  };
}
