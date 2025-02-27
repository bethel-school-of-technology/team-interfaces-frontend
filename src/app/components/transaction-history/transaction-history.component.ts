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
}