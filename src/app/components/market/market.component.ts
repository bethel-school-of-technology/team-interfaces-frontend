import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';


@Component({
  selector: 'app-market',
  standalone: false,
  templateUrl: './market.component.html',
  styleUrl: './market.component.css'
})
export class MarketComponent implements OnInit{

  cryptoList: any[] = [];

  constructor(private cryptoService: CryptoService) { }

  ngOnInit(): void {
    this.cryptoService.getCoins().subscribe(result => {
      this.cryptoList = result
      this.cryptoList.length = 500;
    })
  }

  

}
