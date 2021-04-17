import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl: string = environment.host + 'orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any> {
    let url = this.baseUrl;
    return this.http.get<any>(url);
  }

  
  rejectOrder(orderId: string): Observable<any> {
    let url = this.baseUrl + orderId+ "/reject";
    return this.http.put<any>(url,null);
  }
  shipOrder(orderId: string): Observable<any> {
    let url = this.baseUrl + orderId+ "/ship";
    return this.http.put<any>(url,null);
  }

  acceptOrder(orderId: string, batchNumber: string, expectedDeliveryDate: string): Observable<any> {
    const body = {
        batchNumber: batchNumber,
        expectedDeliveryDate: expectedDeliveryDate
    }
    let url = this.baseUrl + orderId+ "/reject";
    return this.http.put<any>(url,body);
  }


  order(vialsAmount: number, deliveryDate: string): Observable<any> {
    const body = {
        vialsAmount: vialsAmount.toString(),
        manufacturer: "Manufacturer",
        destination: "Border Control",
        requestedArrivalDate: deliveryDate
    }
    let url = this.baseUrl;
    return this.http.post<any>(url,body);
  }
}
