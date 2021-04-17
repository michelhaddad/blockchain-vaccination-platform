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
      storageID: storage,
      hospitalID: hospitalID,
      batchNumber: batchNumber,
      numberOfVials: numberVials,
      arrivalDateTime: arrivalDateTime
  }
    let url = this.baseUrl;
    return this.http.post<any>(url, body);
  }

  sendToStorage(deliveryId: string): Observable<any> {
    let url = this.baseUrl + 'deliveries/' + deliveryId +'/settostorage';
    return this.http.put<any>(url,null);
  }

  receivedInStorage(deliveryId: string): Observable<any> {
    let url = this.baseUrl + 'deliveries/' + deliveryId +'/setinstorage';
    return this.http.put<any>(url,null);
  }

  sendToHospital(deliveryId: string): Observable<any> {
    let url = this.baseUrl + 'deliveries/' + deliveryId +'/settohospital';
    return this.http.put<any>(url,null);
  }
  
  receivedInHospital(deliveryId: string): Observable<any> {
    let url = this.baseUrl + 'deliveries/' + deliveryId +'/setinhospital';
    return this.http.put<any>(url,null);
  }
}
