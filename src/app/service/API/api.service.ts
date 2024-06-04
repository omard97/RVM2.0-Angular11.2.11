import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  
  constructor() { }

  private baseUrl: string = environment.apiUrl;

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
