import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONSTANTS } from '../Constants/app.constants';
import { ICasas } from '../Models/inmueble.model';

@Injectable({
  providedIn: 'root',
})
export class InmueblesServices {

  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = APP_CONSTANTS.URL_LOCAL; 

  Casas : ICasas[];



constructor(private http: HttpClient) {
  this.Casas = [];
}

  getInmuebles(): Observable<ICasas[]> {
    var url = this._apiUrl + 'GetHouses';
    return this._http.get<ICasas[]>(url);
  }
}
