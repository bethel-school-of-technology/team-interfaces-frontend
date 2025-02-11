import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: false
})
export class SignupComponent implements OnInit {
  userList: User[] = [];
  title: string = "";

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userList = this.userService.listOfUsers;
    this.title = this.userService.title;
  }
}