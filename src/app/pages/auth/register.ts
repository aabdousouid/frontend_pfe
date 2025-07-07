import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { first } from 'rxjs';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ToastModule, MessageModule,CardModule],
    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img alt="logo" style="width: 40%;height:30%;" class="image-center" src="./../../../assets/images/logo-actia.jpg"/>
                            
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Join ACTIA ES!</div>
                            <span class="text-muted-color font-medium">Create your account</span>
                        </div>
                        <p-toast></p-toast>
                        
                        @if (!isRegistered) {
                        <form class="register-form"
                            name="form"
                            (ngSubmit)="f.form.valid && onSubmit()"
                            #f="ngForm"
                            novalidate>
                            <div>
                                <!-- Username Field -->
                                <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                                <input pInputText id="username" name="username" type="text" placeholder="Username" 
                                       class="w-full md:w-[30rem] mb-4" [(ngModel)]="form.username" required #username="ngModel" />
                                @if (username.errors && f.submitted) {
                                    <p-message severity="error" class="mb-4">Username is required</p-message>
                                }



                                <label for="firstname" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                                <input pInputText id="firstname" name="firstname" type="text" placeholder="First Name" 
                                       class="w-full md:w-[30rem] mb-4" [(ngModel)]="form.firstname" required #firstname="ngModel" />
                                @if (firstname.errors && f.submitted) {
                                    <p-message severity="error" class="mb-4">firstname is required</p-message>
                                }



                                <label for="lastname" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                                <input pInputText id="lastname" name="lastname" type="text" placeholder="First Name" 
                                       class="w-full md:w-[30rem] mb-4" [(ngModel)]="form.lastname" required #lastname="ngModel" />
                                @if (lastname.errors && f.submitted) {
                                    <p-message severity="error" class="mb-4">lastname is required</p-message>
                                }

                                <!-- Email Field -->
                                <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                <input pInputText id="email" name="email" type="email" placeholder="Email" 
                                       class="w-full md:w-[30rem] mb-4" [(ngModel)]="form.email" required email #email="ngModel" />
                                @if (email.errors && f.submitted) {
                                    <div class="mb-4">
                                        @if (email.errors['required']) {
                                            <p-message severity="error">Email is required</p-message>
                                        }
                                        @if (email.errors['email']) {
                                            <p-message severity="error">Please enter a valid email</p-message>
                                        }
                                    </div>
                                }
                                
                                <!-- Password Field -->
                                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                                <p-password id="password" [(ngModel)]="form.password" placeholder="Password" name="password" 
                                           [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="true" 
                                           required minlength="6" #password="ngModel"></p-password>
                                @if (password.errors && f.submitted) {
                                    <div class="invalid-feedback mb-4">
                                        @if (password.errors['required']) {
                                            <p-message severity="error">Password is required</p-message>
                                        }
                                        @if (password.errors['minlength']) {
                                            <p-message severity="warn">Password must be at least 6 characters</p-message>
                                        }
                                    </div>
                                }

                                <!-- Confirm Password Field -->
                                <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirm Password</label>
                                <p-password id="confirmPassword" [(ngModel)]="form.confirmPassword" placeholder="Confirm Password" 
                                           name="confirmPassword" [toggleMask]="true" styleClass="mb-4" [fluid]="true" 
                                           [feedback]="false" required #confirmPassword="ngModel"></p-password>
                                @if (confirmPassword.errors && f.submitted) {
                                    <p-message severity="error" class="mb-4">Please confirm your password</p-message>
                                }
                                @if (form.password !== form.confirmPassword && f.submitted && form.confirmPassword) {
                                    <p-message severity="error" class="mb-4">Passwords do not match</p-message>
                                }

                                <!-- Terms and Conditions -->
                                <div class="flex items-center mt-4 mb-8">
                                    <p-checkbox [(ngModel)]="acceptTerms" name="acceptTerms" id="acceptTerms" binary class="mr-2" required #terms="ngModel"></p-checkbox>
                                    <label for="acceptTerms" class="text-sm">I agree to the <span class="text-primary cursor-pointer">Terms and Conditions</span></label>
                                </div>
                                @if (terms.errors && f.submitted) {
                                    <p-message severity="error" class="mb-4">You must accept the terms and conditions</p-message>
                                }

                                <!-- Submit Button -->
                                <p-button label="Create Account" styleClass="w-full mb-4" type="submit" 
                                         [disabled]="!acceptTerms || (form.password !== form.confirmPassword && form.confirmPassword)"></p-button>
                                
                                <!-- Login Link -->
                                <div class="flex items-center justify-center">
                                    <p class="block text-surface-900 dark:text-surface-0 text-s font-small mb-2">Already have an account?</p>
                                </div>
                                <div class="flex items-center justify-center">
                                    <p-button label="Sign In" severity="secondary" text (onClick)="navigateToLogin()"></p-button>
                                </div>
                                
                                @if (f.submitted && isRegistrationFailed) {
                                    <p-message severity="error" class="mt-4">Registration Failed: {{errorMessage}}</p-message>
                                }
                            </div>
                        </form>
                        } @else {
                            <div class="text-center">
    <!-- Success Card -->
    <p-card styleClass="mb-6 border-0 shadow-2">
        <ng-template pTemplate="content">
            <div class="flex flex-col items-center gap-4">
                <!-- Success Icon -->
                <div class="bg-green-100 dark:bg-green-900/20 rounded-full p-4 mb-2">
                    <i class="pi pi-check-circle text-green-600 dark:text-green-400 text-4xl"></i>
                </div>
                
                <!-- Success Message -->
                <div class="text-center">
                    <h3 class="text-surface-900 dark:text-surface-0 text-2xl font-semibold mb-2">
                        Registration Successful!
                    </h3>
                    <p class="text-surface-600 dark:text-surface-300 text-lg mb-4">
                        Please check your email to verify your account and complete the registration process.
                    </p>
                </div>
                
                <!-- Primary Action Button -->
                <p-button 
                    label="Go to Login" 
                    icon="pi pi-sign-in"
                    styleClass="w-full sm:w-auto"
                    size="large"
                    (onClick)="navigateToLogin()">
                </p-button>
            </div>
        </ng-template>
    </p-card>

    <!-- Resend Email Section -->
    <p-card styleClass="border-0 shadow-1">
        <ng-template pTemplate="content">
            <div class="flex flex-col items-center gap-3">
                <!-- Info Icon -->
                <div class="bg-orange-100 dark:bg-orange-900/20 rounded-full p-3">
                    <i class="pi pi-info-circle text-orange-600 dark:text-orange-400 text-2xl"></i>
                </div>
                
                <!-- Info Message -->
                <div class="text-center">
                    <p class="text-surface-700 dark:text-surface-200 mb-3">
                        Didn't receive the verification email?
                    </p>
                    <p class="text-surface-500 dark:text-surface-400 text-sm mb-4">
                        Check your spam folder or click below to resend
                    </p>
                </div>
                
                <!-- Secondary Action Button -->
                <p-button 
                    label="Resend Verification Email" 
                    icon="pi pi-send"
                    severity="secondary"
                    outlined
                    styleClass="w-full sm:w-auto"
                    (onClick)="resendverificationEmail()">
                </p-button>
            </div>
        </ng-template>
    </p-card>
</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .image-center {
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
    `],
    providers: [MessageService]
})
export class Register implements OnInit {
    
    form: any = {
        username: null,
        firstname:null,
        lastname:null,
        email: null,
        password: null,
        confirmPassword: null
    };
    
    acceptTerms: boolean = false;
    isRegistered = false;
    isRegistrationFailed = false;
    errorMessage = '';

    constructor(
        private authService: AuthService, 
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Component initialization logic
    }
    
    onSubmit(): void {
        const { username,firstname,lastname, email, password, confirmPassword } = this.form;

        // Client-side validation
        if (password !== confirmPassword) {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Registration failed!', 
                detail: 'Passwords do not match!' 
            });
            return;
        }

        if (!this.acceptTerms) {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Registration failed!', 
                detail: 'Please accept the terms and conditions!' 
            });
            return;
        }

        // Call the register service (you'll need to implement this in your AuthService)
        console.log(this.form)
        this.authService.register(username, firstname,lastname,email, password).subscribe({
            next: data => {
                this.isRegistrationFailed = false;
                this.isRegistered = true;
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Registration successful', 
                    detail: `Account created for ${username}` 
                });
            },
            error: err => {
                this.errorMessage = err.error.message || 'Registration failed';
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Registration failed!', 
                    detail: this.errorMessage 
                });
                this.isRegistrationFailed = true;
            }
        });
    }

    navigateToLogin(): void {
        this.router.navigate(['/login']);
    }

    resendverificationEmail(): void {
        this.authService.resendVerificationEmail(this.form.email).subscribe({
            next: () => {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Verification email sent', 
                    detail: 'Please check your inbox.' 
                });
            },
            error: err => {
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: err.error.message || 'Failed to send verification email' 
                });
            }
        });
    }
}