import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-update',
  standalone: false,
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {
  public updateUserForm!: FormGroup;
  currentUser: User = new User;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.initializeForm();
  }

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

      //preload the form with currentUser data
      this.updateUserForm.patchValue({
        email: this.currentUser.email,
        //password: this.currentUser.password,
        name: this.currentUser.name,
        bankAccount: this.currentUser.bankAccount
      });
    });


  }


  private initializeForm(): void {
    this.updateUserForm = new FormGroup({
      password: new FormControl('', [
        Validators.minLength(6)
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      bankAccount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{9}$')
      ])
    });
  }

  onSubmit() {
    if (this.updateUserForm.valid) {
      this.currentUser.email = this.updateUserForm.value.email;
      if(this.updateUserForm.value.password !== ''){
        this.currentUser.password = this.updateUserForm.value.password;
      }
      this.currentUser.name = this.updateUserForm.value.name;
      this.currentUser.bankAccount = this.updateUserForm.value.bankAccount;
    }

    if(this.updateUserForm.value.password == '') {
      this.userService.updateUserInfo(this.currentUser.id, this.currentUser).subscribe(() => {
        this.router.navigate(['/profile']);
      });
    } else {
      this.userService.updateUserPassWord(this.currentUser.id, this.currentUser).subscribe(() => {
        this.router.navigate(['/profile']);
      });
    }
      
  }


  public getFormValidationErrors(controlName: string): string[] {
    const control = this.updateUserForm.get(controlName);
    const errors = [];

    if (control?.errors) {
      if (control.errors['required']) {
        errors.push(`${controlName} is required`);
      }
      if (control.errors['minlength']) {
        errors.push(`${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`);
      }
      if (control.errors['email']) {
        errors.push('Please enter a valid email address');
      }
      if (control.errors['pattern']) {
        errors.push('Bank account must be exactly 9 digits');
      }
      if (control.errors['min']) {
        errors.push('Balance must be greater than or equal to 0');
      }
    }
    return errors;
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.updateUserForm.get(fieldName);
    return field?.invalid && (field.dirty || field.touched) || false;
  }

}
