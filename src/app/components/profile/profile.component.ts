import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  currentUserId: number = 0;
  currentUser: User = new User;
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
  }

}
