import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/coinPaprikaAPI.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Crypto } from '../../models/crypto';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction';
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
  existinCrypto: Crypto = new Crypto;
  currentUserId: number = 0;
  currentCoinId: string = "";
  coin: any = null;
  closeValue: any = null;
  Description: any = null;
  TwitterFeed: any[] = []
  newTransaction: Transaction = new Transaction;
  newCrypto: Crypto = new Crypto;
  amount: number = 0;

  constructor(
    private cryptoService: CryptoService, 
    private actRoute: ActivatedRoute, 
    private router: Router, 
    private transactionService: TransactionService, 
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.currentCoinId = this.actRoute.snapshot.paramMap.get('coinId') ?? "";
    
    // Get coin details
    this.cryptoService.getCoinById(this.currentCoinId).subscribe(result => {
      this.coin = result;
      this.closeValue = parseFloat(this.coin.quotes.USD.price.toFixed(2));
    });

    // Get description and Twitter feed
    this.cryptoService.getDescriptionById(this.currentCoinId).subscribe(result => {
      console.log(result);
      this.Description = result;
    });
    
    this.cryptoService.getTwitter(this.currentCoinId).subscribe(result => {
      this.TwitterFeed = result;
    });

    // Initialize user data
    const user = JSON.parse(localStorage.getItem('currentUser') ?? "");
    this.currentUserId = parseFloat(user.user.id);
    this.userService.getUserById(this.currentUserId).subscribe(result => {
      console.log(result);
      this.currentUser = result;
    });
  }

  buy(coin: any): void {
    let totalCost = this.amount * this.closeValue;
    console.log(totalCost);

    if (this.currentUser.balance >= totalCost) {
      this.currentUser.balance -= totalCost;
      this.userService.updateUserById(this.currentUser.id, this.currentUser).subscribe(() => {
        // Handle crypto holdings
        this.transactionService.getCryptoBySymbolAndUserId(this.currentUser.id, coin.symbol).subscribe(result => {
          this.existinCrypto = (result[0]);
          
          if (!this.existinCrypto) {
            this.newCrypto = {
              id: undefined,
              user_id: this.currentUser.id,
              crypto_id: coin.id,
              name: coin.name,
              symbol: coin.symbol,
              amount: this.amount,
            }
            this.transactionService.createNewCrypto(this.newCrypto).subscribe();
          } else {
            this.existinCrypto.amount += this.amount;
            this.transactionService.editCryptoById(this.existinCrypto.id, this.existinCrypto).subscribe();
          }
        });

        // Create transaction record
        this.newTransaction = {
          id: undefined,
          user_id: this.currentUser.id,
          crypto_id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          amount: this.amount,
          buyDate: Date.now(),
          buyPrice: this.closeValue,
          sellDate: undefined,
          sellPrice: undefined,
          profitLoss: undefined,
          currentValue: undefined,
          closeValue: undefined
        }
        this.transactionService.createNewTransaction(this.newTransaction).subscribe();

        this.router.navigate(["/profile"]);
      });
    }
  }

  sell(coin: any): void {
    // Validate if user has enough crypto to sell
    this.transactionService.getCryptoBySymbolAndUserId(this.currentUser.id, coin.symbol).subscribe(result => {
        this.existinCrypto = result[0];
        
        if (!this.existinCrypto) {
            alert('You don\'t own any of this cryptocurrency.');
            return;
        }

        if (this.existinCrypto.amount < this.amount) {
            alert('Insufficient funds to sell this amount.');
            return;
        }

        // Calculate sale revenue
        const saleRevenue = this.amount * this.closeValue;
        
        // Update user balance
        this.currentUser.balance += saleRevenue;
        this.userService.updateUserById(this.currentUser.id, this.currentUser).subscribe(() => {
            // Update crypto holdings
            if (this.existinCrypto.amount === this.amount) {
                // Update crypto amount to 0 instead of deleting
                this.existinCrypto.amount = 0;
                this.transactionService.editCryptoById(this.existinCrypto.id, this.existinCrypto).subscribe();
            } else {
                // Update crypto amount for partial sale
                this.existinCrypto.amount -= this.amount;
                this.transactionService.editCryptoById(this.existinCrypto.id, this.existinCrypto).subscribe();
            }

            // Find original buy transaction
            this.transactionService.getCryptoBySymbolAndUserId(
                this.currentUser.id, 
                coin.symbol
            ).subscribe(result => {
                if (result[0] && result[0].id === this.existinCrypto.id) {
                    // Update transaction with sell details
                    const profitLoss = (saleRevenue - (this.amount * this.closeValue));
                    
                    const updatedTransaction = {
                        ...this.newTransaction,
                        sellDate: Date.now(),
                        sellPrice: this.closeValue,
                        profitLoss: profitLoss
                    };
                    
                    this.transactionService.editCryptoById(updatedTransaction.id, updatedTransaction).subscribe();
                }
            });

            this.router.navigate(['/profile']);
        });
    });
}
}