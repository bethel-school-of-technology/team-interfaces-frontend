import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Crypto } from '../../models/crypto';


@Component({
  selector: 'app-coin-details',
  standalone: false,
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.css'
})
export class CoinDetailsComponent implements OnInit {

  currentCoinId: string = "";
  coin: any = null;
  closeValue: any = null;
  Description: any = null;
  TwitterFeed: any[] = []

  constructor(private cryptoService: CryptoService, private actRoute: ActivatedRoute, private router: Router) { }

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

  }

  buy(coin: any) {
    
    
    let purchasedCoin: Crypto = {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      rank: coin.rank,
      price: parseFloat(coin.quotes.USD.price.toFixed(2)),
      user_id: undefined,
      amount: 0
    }
    
    let user = JSON.parse(localStorage.getItem("currentUser") ?? "");
    user.user.coin.push(purchasedCoin);
    
    this.router.navigate(["/profile"]);

  }

}
