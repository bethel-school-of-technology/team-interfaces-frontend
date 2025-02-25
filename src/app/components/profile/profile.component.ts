import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Crypto } from '../../models/crypto';
import Chart from 'chart.js/auto';
import { ChartDataPoint } from '../../models/chart-data-point';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private currentUserID!: number;  // Non-null assertion since we'll initialize it
  currentUser: User = new User;
  user: any = null;
  purchased: Crypto[] = [];
  chartData: ChartDataPoint[] = [];
  chart: Chart | null = null;  // Add type declaration here

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') ?? "");
    if (!user?.user?.id) {
      // Redirect to login if no user is logged in
      this.router.navigate(['/login']);
      return;
    }
    this.currentUserID = parseFloat(user.user.id);
    this.userService.getUserById(this.currentUserID).subscribe(result => {
      this.currentUser = result;
      this.loadChartData();
    });
  }

  private loadChartData(): void {
    this.userService.GetChartInfo(this.userService.getCurrentUser()?.id ?? 0).subscribe({
      next: (results: ChartDataPoint[]) => {
        // Group and sum transactions with the same name
        const groupedData = results.reduce((acc: ChartDataPoint[], current: ChartDataPoint) => {
          const existingIndex = acc.findIndex(item => item.name === current.name);
          if (existingIndex !== -1) {
            acc[existingIndex].amount += current.amount;
          } else {
            acc.push(current);
          }
          return acc;
        }, [] as ChartDataPoint[]);
        
        this.chartData = groupedData;
        this.createChart();
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
          label: 'Number Of Coins',
          data: this.chartData.map(point => point.amount),
          backgroundColor: this.generateColors(this.chartData.length),
          hoverOffset: 4
        }]
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
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