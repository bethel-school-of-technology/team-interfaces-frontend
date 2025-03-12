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
  usdAmount: number = 0;
  conversionRate: number = 0;
  showPrompt: boolean = false;
  buyingTransaction: Transaction = new Transaction

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
      this.conversionRate = this.closeValue;
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


  updateUsDollars() {
    this.usdAmount = this.amount * this.conversionRate;
  }
  
  // This method is called when the USD field is updated
  updateAmount() {
    this.amount = this.usdAmount / this.conversionRate;
  }

    // Open the prompt box
    openPrompt(coin: any): void {
      this.buyingTransaction = coin;
      this.showPrompt = true;
    }
  
    // Handle the confirmation action
    onConfirm(): void {
      this.showPrompt = false;  // Close the prompt
      console.log(this.buyingTransaction);
      this.buy(this.buyingTransaction);
    }
  
    // Handle the cancel action
    onCancel(): void {
      this.showPrompt = false;  // Close the prompt
      console.log('Transaction cancelled');
      // Handle cancelation logic here
    }

  buy(coin: any): void {
    let totalCost = parseFloat((this.amount * this.closeValue).toFixed(2));  
    if(this.currentUser.balance < totalCost) {
      return alert("Insuffient funds to complete this purchase");
    }

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
          buyPrice: parseFloat((this.closeValue).toFixed(2)),
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

  
}