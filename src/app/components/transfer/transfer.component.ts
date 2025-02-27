import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  selectedTransactionType: string = '';
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

  onTransactionChange(value: string) {
    console.log('Selected Transaction Type:', value);  // Check what value is being emitted
    this.selectedTransactionType = value;
  }

  

  // transfer method
  transfer() {
    console.log(this.selectedTransactionType);
    console.log(this.transferAmount);
    //If false, withdraw funds
    if(this.selectedTransactionType == "deposit") {
      this.currentUser.balance -= this.transferAmount;
      this.userService.updateUserById(this.currentUser.id, this.currentUser).subscribe(() => {
      });
      this.router.navigate(['/profile']);
      // if true, add funds
    } else {
      this.currentUser.balance += this.transferAmount;
      this.userService.updateUserById(this.currentUser.id, this.currentUser).subscribe(() => {

      });
    }
    

  }
}
