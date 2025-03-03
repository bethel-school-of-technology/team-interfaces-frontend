import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CryptoService } from '../../services/coinPaprikaAPI.service';
import { User } from '../../models/user';


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
  saleRevenue: number = 0;

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private router: Router,
    private coinPaprikaAPI: CryptoService
  ) {}

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

  async sell(transaction: Transaction): Promise<void> {
    console.log(transaction);
    // Validate if user has enough crypto to sell
    const existingCrypto = await this.transactionService.getCryptoBySymbolAndUserId(
      this.currentUser.id,
      transaction.symbol
    ).toPromise();
  
    if (!existingCrypto || existingCrypto.length === 0) {
      throw new Error('You don\'t own any of this cryptocurrency.');
    }
  
    if (existingCrypto[0].amount < transaction.amount) {
      throw new Error('Insufficient funds to sell this amount.');
    }

    this.coinPaprikaAPI.getCoinById(transaction.crypto_id).subscribe(result => {
      const coin = result;
      
      // Calculate sale revenue

      this.saleRevenue = transaction.amount * (coin.closeValue);
    })
  
    
    
  
    try {
      // Update user balance
      this.currentUser.balance += this.saleRevenue;
      await this.userService.updateUserById(this.currentUser.id, this.currentUser).toPromise();
  
      // Update crypto holdings
      const updatedCrypto = { ...existingCrypto[0] };
      if (updatedCrypto.amount === transaction.amount) {
        updatedCrypto.amount = 0;
      } else {
        updatedCrypto.amount -= transaction.amount;
      }
      await this.transactionService.editCryptoById(updatedCrypto.id, updatedCrypto).toPromise();
  
      // Update transaction with sell details
      const profitLoss = this.saleRevenue - (transaction.amount * transaction.buyPrice);
      const updatedTransaction = {
        ...transaction,
        sellDate: Date.now(),
        sellPrice: transaction.sellPrice,
        profitLoss: profitLoss,
        id: transaction.id ?? 0,
        user_id: transaction.user_id ?? 0,
      };
      await this.transactionService.editTransactionById(updatedTransaction.id, updatedTransaction).toPromise();

  
      this.router.navigate(['/profile']);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to complete sale: ${error.message}`);
      }
      throw new Error(`Failed to complete sale: An unknown error occurred`);
    }
  }
}