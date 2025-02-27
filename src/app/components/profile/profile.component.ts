import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Crypto } from '../../models/crypto';
import Chart from 'chart.js/auto';
import { ChartDataPoint } from '../../models/chart-data-point';
import { TransactionService } from '../../services/transaction.service';
import { CryptoService } from '../../services/coinPaprikaAPI.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  private currentUserID!: number;
  currentUserId: number = 0;
  currentUser: User = new User;
  user: any = null;
  purchased: Crypto[] = [];
  chartData: ChartDataPoint[] = [];
  chart: Chart | null = null;
  assets: Crypto[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private transactionService: TransactionService,
    private coinPaprikaAPI: CryptoService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') ?? "");
    if (!user?.user?.id) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUserID = parseFloat(user.user.id);
    this.userService.getUserById(this.currentUserID).subscribe(result => {
      this.currentUser = result;
      
      // Load crypto assets
      this.loadCryptoAssets();
      
      // Load chart data
      this.loadChartData();
    });
  }

  private loadCryptoAssets() : void {
    const userId = this.userService.getCurrentUser()?.id ?? this.currentUserID;
    this.transactionService.getCryptoByUserId(userId).subscribe(result => {
      this.assets = result
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
    for (let i = 0; i < count; i++) {
      colors.push(`#${Math.floor(Math.random()*16000000).toString(16)}`);
    }
    return colors;
  }

}