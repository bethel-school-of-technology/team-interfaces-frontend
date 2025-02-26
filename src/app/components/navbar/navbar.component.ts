import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {
  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  currentUser: User = new User;

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') ?? "");
    if (!user?.user?.id) {
      this.router.navigate(['/login']);
      return;
    }
    
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