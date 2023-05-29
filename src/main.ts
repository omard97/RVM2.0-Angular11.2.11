import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
 
mapboxgl.accessToken = 'pk.eyJ1Ijoib21hcmQ5NyIsImEiOiJjbGhpdGE4d3MwMGNtM2dwc3lnZjc0ZTk3In0.OdWECTi0zDbRihpSeWKSOg';


if(!navigator.geolocation){
  alert('El navegador no sosporta la Geolocalizacion')
  throw new Error('El navegador no sosporta la Geolocalizacion')
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
