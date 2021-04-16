import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseModel } from 'src/app/shared/models/api-response.model';
import { DonationByUserModel, DonationModel } from 'src/app/shared/models/donations.model';
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
    let url = this.baseUrl + '/redeem?donationId=' + donationId;
    return this.http.put<any>(url, null);
  }

  getDonationByUser(): Observable<any> {
    let url = this.baseUrl + '/user';
    return this.http.post<any>(url, null);
  }

  donate(amount: number): Observable<any> {
    let url = this.baseUrl + '/donate?amount=' + amount;
    return this.http.get<any>(url);
  }
}
