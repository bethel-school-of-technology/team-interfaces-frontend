import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { Crypto } from '../models/crypto';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  transactionURL: string = "http://207.244.251.209:3000/transactions";
  cryptoURL: string = "http://207.244.251.209:3000/cryptos";

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionURL);
  }

  getTransactionsbyCryptoAndUserId(cryptoId: string, UserId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.transactionURL}?crypto_id=${cryptoId}&user_id=${UserId}`);
  }

  getTransactionById(TransactionId: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.transactionURL}/${TransactionId}`);
  }

  createNewTransaction(NewTransaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.transactionURL, NewTransaction);
  }

  editTransactionById(TransactionId: number, edittedTransaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.transactionURL}/${TransactionId}`, edittedTransaction);
  }

  getTransactionUserId(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.transactionURL}?user_id=${userId}`);
  }

  getCryptoByUserId(userId: number | undefined): Observable<Crypto[]> {
    return this.http.get<Crypto[]>(`${this.cryptoURL}?user_id=${userId}`);
  }

  createNewCrypto(NewCrypto: Crypto): Observable<Crypto> {
    return this.http.post<Crypto>(this.cryptoURL, NewCrypto)
  }

  editCryptoById(cryptoId: number | undefined, edittedCrypto: Crypto): Observable<Crypto> {
    return this.http.put<Crypto>(`${this.cryptoURL}/${cryptoId}`, edittedCrypto);
  }

  getCryptoBySymbolAndUserId(userId: number|undefined, CryptoSymbol: string): Observable<Crypto[]> {
    return this.http.get<Crypto[]>(`${this.cryptoURL}/?user_id=${userId}&symbol=${CryptoSymbol}`);
  }

  sellTransaction(transactionId: number, sellPrice: number): Observable<Transaction> {
    return this.http.put<Transaction>(
      `${this.transactionURL}/${transactionId}/sell`,
      { sellPrice }
    );
  }
}