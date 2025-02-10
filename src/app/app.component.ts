import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  title: string = '';
  userList: User[] = [];

  constructor (private myUserService: UserService) {}

  ngOnInit(): void {
    this.title = this.myUserService.title;
    this.userList = this.myUserService.listOfUsers;
  }
}
