import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Crypto } from '../../models/crypto';
import { ScrollDispatcher, ScrollingModule } from '@angular/cdk/scrolling'

@Component({
  selector: 'app-market',
  standalone: false,
  templateUrl: './market.component.html',
  styleUrl: './market.component.css'
})
export class MarketComponent implements OnInit{

  cryptoList: Crypto[] = [];

  constructor(private cryptoService: CryptoService, private scrollDispatcher: ScrollDispatcher) { }

  ngOnInit(): void {
    this.cryptoService.getCoins().subscribe(result => {
      this.cryptoList = result
      this.cryptoList.length = 10;
    })
  }

}
