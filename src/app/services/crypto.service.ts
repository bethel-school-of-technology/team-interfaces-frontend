import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  baseUrl: string = 'https://api.coinpaprika.com/v1';

  constructor(private http: HttpClient) { }

  getCoins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tickers`)
  }

  getCoinById(coinId: string) {
    return this.http.get<any>(`${this.baseUrl}/tickers/${coinId}`)
  }

  getDescriptionById(coinId: string) {
    return this.http.get<any>(`${this.baseUrl}/coins/${coinId}`)
  }

  getTwitter(coinId: string) {
    return this.http.get<any>(`${this.baseUrl}/coins/${coinId}/twitter`)
  }

}
