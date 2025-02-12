import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    standalone: false
})
export class LoginComponent {
    public loginForm!: FormGroup;
    public errorMessage: string = '';

    constructor(
        private userService: UserService,
        private router: Router
    ) {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.loginForm = new FormGroup({
            username: new FormControl('', [
                Validators.required,
                Validators.minLength(3)
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(6)
            ])
        });
    }

    public onSubmit(): void {
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;
            
            // Find user by username
            const user = this.userService.listOfUsers.find(u => 
                u.username === username && u.password === password
            );

            if (user) {
                console.log('Login successful:', user);
                this.router.navigate(['/market']);
            } else {
                this.errorMessage = 'Invalid username or password.  Please try again'
                console.error('Invalid username or password');
            }
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
        }
        
        return errors;
    }
}