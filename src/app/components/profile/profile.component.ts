import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Crypto } from '../../models/crypto';
import Chart from 'chart.js/auto';
import { ChartDataPoint } from '../../models/chart-data-point';
import { TransactionService } from '../../services/transaction.service';
import { CryptoService } from '../../services/coinPaprikaAPI.service';
import { forkJoin, map } from 'rxjs';
import { Transaction } from '../../models/transaction';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private isBrowser: boolean;
  private currentUserID!: number;
  currentUserId: number = 0;
  currentUser: User = new User;
  user: any = null;
  purchased: Crypto[] = [];
  chartData: ChartDataPoint[] = [];
  chart: Chart | null = null;
  assets: Crypto[] = [];
  valueMap = new Map<string, number>();
  transactions: Transaction[] = [];
  transactionDates = new Map<string, Date>();

  constructor(
    private userService: UserService,
    private router: Router,
    private transactionService: TransactionService,
    private coinPaprikaAPI: CryptoService,
    @Inject(PLATFORM_ID) private platformId: object
      ) { this.isBrowser = isPlatformBrowser(platformId); }

  ngOnInit(): void {
    const user = this.isBrowser? JSON.parse(localStorage.getItem('currentUser') ?? ""):"";
    if (!user?.user?.id) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUserID = parseFloat(user.user.id);
    this.userService.getUserById(this.currentUserID).subscribe(result => {
      this.currentUser = result;
      // Load crypto assets and transactions
      this.loadCryptoAssets();
      // Load chart data
      this.loadChartData();
    });
  }

  private loadCryptoAssets() : void {
    const userId = this.userService.getCurrentUser()?.id ?? this.currentUserID;
    forkJoin([
      this.transactionService.getCryptoByUserId(userId),
      this.transactionService.getTransactionUserId(userId)
    ]).subscribe({
      next: ([assets, transactions]) => {
        this.assets = assets;
        this.transactions = transactions;
        // Create a mapping of crypto_id to latest transaction date
        this.transactionDates = new Map(
          transactions.map(t => [t.crypto_id, new Date(t.buyDate)])
        );
      }
    });
  }

  private loadChartData(): void {
    const userId = this.userService.getCurrentUser()?.id ?? this.currentUserID;
    this.userService.GetChartInfo(userId).subscribe({
      next: (results: ChartDataPoint[]) => {
        const requests = results.map(current =>
          this.coinPaprikaAPI.getCoinById(current.crypto_id).pipe(
            map(crypto => {
              current.value = parseFloat((crypto.quotes.USD.price * current.amount).toFixed(2));
              this.valueMap.set(current.crypto_id, current.value);
              return current;
            })
          )
        );
        forkJoin(requests).subscribe({
          next: (finalResults) => {
            this.chartData = finalResults;
            this.createChart();
          },
          error: (err) => console.error('Error fetching coin data', err)
        });
      },
      error: (error) => {
        console.error('Error fetching chart data:', error);
        if (error.message === 'No user logged in') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private createChart(): void {
    const canvasElement = document.getElementById('profile-chart') as HTMLCanvasElement | null;
    if (!canvasElement) {
      console.error('Canvas element not found');
      return;
    }
    this.chart = new Chart(canvasElement, {
      type: 'pie',
      data: {
        labels: this.chartData.map(point => point.name),
        datasets: [{
          label: 'USD',
          data: this.chartData.map(point => point.value),
          backgroundColor: this.generateColors(this.chartData.length),
          hoverOffset: 4
        }]
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  private generateColors(count: number): string[] {
    const colors: string[] = [];
    const hueStep = 360 / count;
    
    for (let i = 0; i < count; i++) {
        const hue = (i * hueStep) % 360;
        colors.push(`hsl(${hue}, 100%, 50%)`);
    }
    
    return colors;
  }
}