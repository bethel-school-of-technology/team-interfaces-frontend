import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.errorMessage = '';
  }

  private initializeForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      if (!email || !password) {
        this.errorMessage = 'Email and password are required';
        this.isSubmitting = false;
        return;
      }

      this.userService.login(email, password).subscribe({
        next: (user: User) => {
          console.log('Login successful:', user);
          this.router.navigate(['/market']);
        },
        error: (error: any) => {
          console.error('Login failed:', error);
          if (error.status === 400) {
            this.errorMessage = 'Invalid email or password. Please try again.';
          } else {
            this.errorMessage = 'An error occurred while logging in.';
          }
          this.isSubmitting = false;
        }
      });
    }
  }

  public getFormValidationErrors(controlName: string): string[] {
    const control = this.loginForm.get(controlName);
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
    }
    return errors;
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field?.invalid && (field.dirty || field.touched) || false;
  }
}