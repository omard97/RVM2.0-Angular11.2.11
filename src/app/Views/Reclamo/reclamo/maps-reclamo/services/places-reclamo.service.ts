import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesReclamoApiClient } from '../api/placesReclamoApiClient';
import { MapReclamoService } from './map-reclamo.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesReclamoService {

  public userLocation: [number, number] | undefined;

  /* video 11 */
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }
  constructor(private http: HttpClient,
    private placesReclamoApiClient: PlacesReclamoApiClient,
    private mapReclamoService: MapReclamoService) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          console.log('hola')
          resolve(this.userLocation);
        },
        (err) => {
          alert('No se pudo obtener la geolocalización');
          console.log(err);
          reject();
        }
      );
    })
  }


  /* video 11 */
  getPlacesByQuery(query: string = '') {
    //todo: evaluar cuando el query es nulo

    if (!this.userLocation) throw Error('No hay userlocation');

    /* 11 - cuando empiezo a buscar digo que los lugares ya estan listos */
    this.isLoadingPlaces = true;

    // 11 - video
    // 12 - video
    this.placesReclamoApiClient.get<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: this.userLocation.join(',')
      }
    })
      .subscribe(resp => {


        console.log(resp.features)
        this.isLoadingPlaces = false;
        this.places = resp.features;
        /* llamo a la funcion para agregar los marcadores a los lugares encontrados */
        this.mapReclamoService.createMarkersFromPlaces(this.places);
      });
  }

  ocultarListaResultados(){
    this.places = [];
  }
}
