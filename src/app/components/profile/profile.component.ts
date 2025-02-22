import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Crypto } from '../../models/crypto';


@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  currentUserId: number = 0;
  currentUser: User = new User;
  user: any = null;
  purchased: Crypto[] = []
  
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser')  ?? "");
    this.currentUserId = parseFloat(user.user.id);
    this.userService.getUserById(this.currentUserId).subscribe(result => {
      this.currentUser = result;
    })
    
   
  }
}
