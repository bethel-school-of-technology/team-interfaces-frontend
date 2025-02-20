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

  transactionURL: string = "http://localhost:3000/transactions";
  cryptoURL: string = "http://localhost:3000/cryptos";

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionURL);
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

  getTransactionByCustomId(userId: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.transactionURL}?user_id=${userId}`);
  }

  getCryptoByUserId(userId: number): Observable<Crypto> {
    return this.http.get<Crypto>(`${this.cryptoURL}?user_id=${userId}`);
  }

  createNewCrypto(NewCrypto: Crypto): Observable<Crypto> {
    return this.http.post<Crypto>(this.cryptoURL, NewCrypto)
  }
}
