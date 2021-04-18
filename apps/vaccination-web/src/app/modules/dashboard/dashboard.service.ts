import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl: string = environment.host;

  constructor(private http: HttpClient) {}

  getHospitalDailyAdministrations(){
    let url = this.baseUrl + 'hospitals/dailyadministrations';
    return this.http.get<any>(url);
  }
  getDailyAdministrations(){
    let url = this.baseUrl + 'dailyadministrations';
    return this.http.get<any>(url);
  }
  getHospitalRemainingVials(){
    let url = this.baseUrl + 'hospitals/dosesData';
    return this.http.get<any>(url);
  }
  getRemainingVialsDistribution(){
    let url = this.baseUrl + 'vaccineorgdistribution';
    return this.http.get<any>(url);
  }
  getManufacturerDosesData(){
    let url = this.baseUrl + 'dosesdatapermanufacturer';
    return this.http.get<any>(url);
  }
}