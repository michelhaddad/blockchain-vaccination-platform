import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  baseUrl: string = environment.host + 'donations';

  constructor(private http: HttpClient) {}

  getAllDonations(): Observable<any> {
    let url = this.baseUrl;
    return this.http.get<any>(url);
  }

  redeemDonation(donationId: string): Observable<any> {
    let url = this.baseUrl + '/redeem?id=' + donationId;
    return this.http.put<any>(url, null);
  }

  getDonationByUser(): Observable<any> {
    let url = this.baseUrl + '/user';
    return this.http.get<any>(url);
  }

  donate(amount: number): Observable<any> {
    let url = this.baseUrl + '/donate?amount=' + amount;
    return this.http.post<any>(url,null);
  }

  getFunds(): Observable<any> {
    let url = environment.host + "MOPH/balance";
    return this.http.get(url);
  }
}
