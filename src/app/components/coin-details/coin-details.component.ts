import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/coinPaprikaAPI.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Crypto } from '../../models/crypto';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction';
import { response } from 'express';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-coin-details',
  standalone: false,
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.css'
})
export class CoinDetailsComponent implements OnInit {


  currentUser: User = new User;
  currentUserId: number = 0;
  currentCoinId: string = "";
  coin: any = null;
  closeValue: any = null;
  Description: any = null;
  TwitterFeed: any[] = []
  newTransaction: Transaction = new Transaction;
  newCrypto: Crypto = new Crypto;
  amount: number = 0;

  constructor(private cryptoService: CryptoService, private actRoute: ActivatedRoute, private router: Router, private transactionService: TransactionService, private userService: UserService) { }

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

    const user = JSON.parse(localStorage.getItem('currentUser')  ?? "");
    this.currentUserId = parseFloat(user.user.id);
    this.userService.getUserById(this.currentUserId).subscribe(result => {
      console.log(result)
      this.currentUser = result;
    })

  }





  buy(coin: any) {
    let totalCost = this.amount * this.closeValue;
    console.log(totalCost);
    if (this.currentUser.balance >= totalCost) {
      this.currentUser.balance -= totalCost;
      console.log(this.currentUser);
      this.userService.updateUserById(this.currentUser.id, this.currentUser).subscribe(() => {
      });
      
      this.newCrypto = {
        id: undefined,
        user_id: this.currentUser.id,
        name: coin.name,
        symbol: coin.symbol,
        amount: this.amount,
      }

      
      this.transactionService.createNewCrypto(this.newCrypto).subscribe(() => {
      });
    

      this.newTransaction = {
        id: undefined,
        user_id: this.currentUser.id,
        name: coin.name,
        symbol: coin.symbol,
        amount: this.amount,
        buyDate: Date.now(),
        buyPrice: this.closeValue,
        sellDate: undefined,
        sellPrice: undefined,
        profitLoss: undefined,
      }

      

      this.transactionService.createNewTransaction(this.newTransaction).subscribe(() => {
      });

      this.router.navigate(["/profile"]);
    }

  }

}
