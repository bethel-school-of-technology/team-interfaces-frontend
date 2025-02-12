import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    standalone: false
})
export class SignupComponent {
  public signupForm!: FormGroup;

  constructor(
      private userService: UserService,
      private router: Router
  ) {
      this.initializeForm();
  }

  private initializeForm(): void {
      this.signupForm = new FormGroup({
          username: new FormControl('', [
              Validators.required,
              Validators.minLength(3)
          ]),
          password: new FormControl('', [
              Validators.required,
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
          ]),
          balance: new FormControl(0, [
              Validators.required,
              Validators.min(0)
          ])
      });
  }

  public onSubmit(): void {
      if (this.signupForm.valid) {
          const newUser: User = {
              id: Date.now(),
              ...this.signupForm.value,
              ballance: this.signupForm.get('balance')?.value
          };

          this.userService.signUp(newUser).subscribe({
              next: (addedUser) => {
                  console.log('User added successfully:', addedUser);
                  this.signupForm.reset();
                  this.router.navigate(['/login']);  // Add this line
              },
              error: (error) => {
                  console.error('Error adding user:', error);
              }
          });
      }
  }


    public getFormValidationErrors(controlName: string): string[] {
        const control = this.signupForm.get(controlName);
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
}