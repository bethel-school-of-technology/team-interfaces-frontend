import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private isBrowser: boolean;
  
  constructor(
    public userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) { this.isBrowser = isPlatformBrowser(platformId); }

  currentUser: User = new User();

  get currentUrl(): string {
    return this.router.url;
  }

  logClick(event: Event): void {
    console.log('Transaction History clicked:', event);
    console.log('Current URL before nav:', this.router.url);
  }

  ngOnInit(): void {
    const user = this.isBrowser? JSON.parse(localStorage.getItem('currentUser') ?? ""):"";
    if (!user?.user?.id) {
      this.router.navigate(['/login']);
      return;
    }

    // Enhanced navigation debugging
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Starting navigation to:', (<NavigationStart>event).url);
      } else if (event instanceof NavigationEnd) {
        console.log('Successfully navigated to:', event.url);
        console.log('Full router config:', JSON.stringify(this.router.config));
      }
    });

    let currentUserID = parseFloat(user.user.id);
    this.userService.getUserById(currentUserID).subscribe(result => {
      this.currentUser = result;
    });
  }

  logout(): void {
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      }
    });
  }
}