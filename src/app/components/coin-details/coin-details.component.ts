import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { ActivatedRoute } from '@angular/router';


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
  coinOHLC: any = null;
  TwitterFeed: any[] = []

  constructor(private cryptoService: CryptoService, private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentCoinId = this.actRoute.snapshot.paramMap.get('coinId') ?? "";
    this.cryptoService.getCoinById(this.currentCoinId).subscribe(result => {
      this.coin = result;
    });
    this.cryptoService.getOHLCById(this.currentCoinId).subscribe(result => {
      console.log(result);
      this.coinOHLC = result;
      const closeValueToString = this.coinOHLC.quotes.USD.price.toFixed(2);
      this.closeValue = parseFloat(closeValueToString);

    });
    this.cryptoService.getTwitter(this.currentCoinId).subscribe(result => {
      this.TwitterFeed = result;
    
    });

  }

}
