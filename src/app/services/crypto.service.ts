import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Crypto } from '../models/crypto';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  baseUrl: string = 'https://api.coinpaprika.com/v1';

  constructor(private http: HttpClient) { }

  getCoins(): Observable<Crypto[]> {
    return this.http.get<Crypto[]>(`${this.baseUrl}/tickers`)
  }

  getCoinById(coinId: string) {
    return this.http.get<Crypto>(`${this.baseUrl}/coins/${coinId}`)
  }

  getOHLCById(coinId: string) {
    return this.http.get<any>(`${this.baseUrl}/tickers/${coinId}`)
  }

  getTwitter(coinId: string) {
    return this.http.get<any>(`${this.baseUrl}/coins/${coinId}/twitter`)
  }

}
