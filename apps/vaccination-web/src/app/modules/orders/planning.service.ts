import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlanningService {
  baseUrl: string = environment.host + 'deliveries';

  constructor(private http: HttpClient) {}

  getAllDeliveryPlans(): Observable<any> {
    let url = this.baseUrl;
    return this.http.get<any>(url);
  }

  addDeliveryPlans(orderId: string, storage: string, hospitalID: number, batchNumber: string, numberVials: number, arrivalDateTime: string): Observable<any> {
    const body = {
      orderID: orderId,
      storageID: "storage",
      hospitalID: "1",
      batchNumber: batchNumber,
      numberOfVials: numberVials.toString(),
      arrivalDateTime: arrivalDateTime
  }
    let url = this.baseUrl;
    return this.http.post<any>(url, body);
  }

  sendToStorage(deliveryId: string): Observable<any> {
    let url = this.baseUrl + '/' + deliveryId +'/settostorage';
    return this.http.put<any>(url,null);
  }

  receivedInStorage(deliveryId: string): Observable<any> {
    let url = this.baseUrl + '/' + deliveryId +'/setinstorage';
    return this.http.put<any>(url,null);
  }

  sendToHospital(deliveryId: string): Observable<any> {
    let url = this.baseUrl + '/' + deliveryId +'/settohospital';
    return this.http.put<any>(url,null);
  }
  
  receivedInHospital(deliveryId: string): Observable<any> {
    let url = this.baseUrl + '/' + deliveryId +'/setinhospital';
    return this.http.put<any>(url,null);
  }

  vaccinate(batchId: string, patientCount: number): Observable<any> {
    const body = {
      patientCount: patientCount,
      batchID: batchId
  }
    let url = environment.host + 'hospitals/1/inoculate';
    return this.http.put<any>(url, body);
  }
}
