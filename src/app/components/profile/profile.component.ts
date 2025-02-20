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
  test: any = null;
  purchased: Crypto[] = []
  
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
   this.test = localStorage.getItem("currentUser");
   this.test = JSON.parse(this.test);
   this.currentUser = this.test.user;
   this.currentUser.coin = this.purchased;
   
  }
}
