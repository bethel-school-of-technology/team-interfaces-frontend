import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CryptoService } from '../../services/coinPaprikaAPI.service';
import { User } from '../../models/user';
import { Crypto } from '../../models/crypto';


@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
  standalone: false
})
export class TransactionHistoryComponent implements OnInit {

  public currentUserID!: number;
  public currentUser: User = new User();
  transactions: Transaction[] = [];
  openTransactions: Transaction[] = [];
  closedTransactions: Transaction[] = [];
  loading = false;
  error?: string;



  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private router: Router,
    private coinPaprikaAPI: CryptoService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.loading = true;
    const user = JSON.parse(localStorage.getItem('currentUser') ?? "");
    if (!user?.user?.id || !user?.user?.name) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserID = parseFloat(user.user.id);
    this.currentUser = {
      id: user.user.id,
      name: user.user.name,
      email: user.user.email,
      bankAccount: user.user.bankAccount,
      balance: user.user.balance,
      password: user.user.password
    };
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.transactionService.getTransactionUserId(this.currentUserID).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.splitTransactions();
        this.openTransactions.forEach(t => this.getCurrentValue(t, t.crypto_id))
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        this.loading = false;
      }
    });
  }

  private splitTransactions(): void {
    this.openTransactions = this.transactions.filter(t => !t.sellDate);
    this.closedTransactions = this.transactions.filter(t => t.sellDate);
  }

  getCurrentValue(transaction: Transaction, cryptoId: string) {
    this.coinPaprikaAPI.getCoinById(cryptoId).subscribe(result => {
      transaction.currentValue = parseFloat((result.quotes.USD.price).toFixed(2));
    })
  }

  sell(transaction: Transaction) {
    console.log("user balance at beginnig of sell transaction", this.currentUser.balance);
    console.log("current user 1st: ", this.currentUser)
    this.coinPaprikaAPI.getCoinById(transaction.crypto_id).subscribe(result => {
      console.log(transaction);
      let sellPrice = Math.round(result.quotes.USD.price * 100) / 100;
      let saleTotal = parseFloat((sellPrice * transaction.amount).toFixed(2));
      let saleRevenue = (saleTotal - (transaction.buyPrice * transaction.amount)).toFixed(2);
      console.log(saleRevenue);
      //get exisiting crypto and edit amount
      this.transactionService.getCryptoBySymbolAndUserId(transaction.user_id, transaction.symbol).subscribe(result => {
        let existinCrypto = result[0];
        if (existinCrypto.amount < transaction.amount) {
          alert(`You have do not have enough ${transaction.name} to complete this transaction`)
        }
        existinCrypto.amount -= transaction.amount;
        console.log(existinCrypto);

        this.transactionService.editCryptoById(existinCrypto.id, existinCrypto).subscribe(() => {

        });

        //update user balance
        console.log(saleTotal);
        console.log("user balance before adding sales total: ", this.currentUser.balance);
        this.currentUser.balance += saleTotal;
        console.log(this.currentUser.balance);

        this.userService.updateUserById(this.currentUserID, this.currentUser).subscribe(() => {

        });

        //close transaction
        transaction.sellDate = Date.now();
        transaction.sellPrice = sellPrice;
        transaction.profitLoss = parseFloat(saleRevenue);
        this.transactionService.editTransactionById(transaction.id ?? 0, transaction).subscribe(() => {

          this.router.navigate(['/profile']);
        });

      });
    });
  }


}