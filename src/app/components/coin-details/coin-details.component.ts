import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/coinPaprikaAPI.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Crypto } from '../../models/crypto';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction';
import { response } from 'express';



@Component({
  selector: 'app-coin-details',
  standalone: false,
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.css'
})
export class CoinDetailsComponent implements OnInit {

 
  currentUser: any = null;
  currentCoinId: string = "";
  coin: any = null;
  closeValue: any = null;
  Description: any = null;
  TwitterFeed: any[] = []
  newTransaction: Transaction = new Transaction;
  newCrypto: Crypto = new Crypto;
  amount: number = 0;

  constructor(private cryptoService: CryptoService, private actRoute: ActivatedRoute, private router: Router, private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.currentCoinId = this.actRoute.snapshot.paramMap.get('coinId') ?? "";
    this.cryptoService.getCoinById(this.currentCoinId).subscribe(result => {
      this.coin = result;
      this.closeValue = parseFloat(this.coin.quotes.USD.price.toFixed(2));
      
    });
      this.cryptoService.getDescriptionById(this.currentCoinId).subscribe(result => {
      console.log(result);
      this.Description = result;
    });
    this.cryptoService.getTwitter(this.currentCoinId).subscribe(result => {
      this.TwitterFeed = result;
    
    });

    this.currentUser = JSON.parse(localStorage.getItem("currentUser") ?? "");
    console.log(this.currentUser);

  }

  buy(coin: any) {
    
    

    this.newCrypto = {
      id: undefined,
      user_id: this.currentUser.user.user_id,
      name: coin.name,
      symbol: coin.symbol,
      amount: this.amount,
    }

    this.newTransaction = {
    id: undefined,
    user_id: this.currentUser.user.user_id,
    name: coin.name,
    symbol: coin.symbol,
    amount: this.amount,
    buyDate:  Date.now(),
    buyPrice: this.closeValue,
    sellDate: undefined,
    sellPrice: undefined,
    profitLoss: undefined,
    }

    console.log(this.newCrypto);
    console.log(this.newTransaction);

    this.transactionService.createNewCrypto(this.newCrypto).subscribe(response => {
      console.log(response);
    });

    this.transactionService.createNewTransaction(this.newTransaction).subscribe(response => {
      console.log(response);
    })

    let totalcost = this.amount * this.closeValue;

    this.currentUser.user.balance -= totalcost;
     
    this.router.navigate(["/profile"]);

  }

}
