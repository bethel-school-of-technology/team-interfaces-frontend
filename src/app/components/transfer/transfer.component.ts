import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-transfer',
  standalone: false,
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {


  currentUser: User = new User;
  selectedTransactionType: string = "0";
  transferAmount: number = 0;
  

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }


  ngOnInit(): void {
    
    //load user informantion
    const user = JSON.parse(localStorage.getItem('currentUser') ?? "");
      if (!user?.user?.id) {
        this.router.navigate(['/login']);
        return;
      }
    const userId = parseFloat(user.user.id);
    this.userService.getUserById(userId).subscribe(result => {
      this.currentUser = result;
    });


  }

  //display bank account number on form
  formatBankAccount(account: string): string {
    const accountLength = account.length;
    if (accountLength <= 4) {
      return account; // return as is if the account has 4 or fewer digits
    }
    const lastFour = account.slice(-4);
    const masked = 'x'.repeat(accountLength - 4); // mask the other digits
    return masked + lastFour;
  }

  // transfer method
  transfer() {

    //check for positive transfer amount
    if(this.transferAmount <= 0) {
      alert("Enter a transfer amount");
    }
    
    const selection = parseFloat(this.selectedTransactionType)
    console.log(this.selectedTransactionType);
    if(selection == 0) {
      alert("Select transaction type");
    }

    //If 1, withdraw funds
    if(selection == 1) {
      this.currentUser.balance -= this.transferAmount;
      this.userService.updateUserById(this.currentUser.id, this.currentUser).subscribe(() => {
      });
      this.router.navigate(['/profile']);
     
      // if 2, add funds
    } 
    if(selection == 2) {
      this.currentUser.balance += this.transferAmount;
      this.userService.updateUserById(this.currentUser.id, this.currentUser).subscribe(() => {
      });
      this.router.navigate(['/profile']);
    }
    

  }
}
