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
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { first } from 'rxjs';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        ButtonModule, 
        CheckboxModule, 
        InputTextModule, 
        PasswordModule, 
        FormsModule, 
        RouterModule, 
        RippleModule, 
        ToastModule, 
        MessageModule,
        CardModule,
        DividerModule,
        ProgressBarModule,
        FloatLabelModule
    ],
    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden p-4">
        <div class="flex flex-col items-center justify-center w-full max-w-md">
            <div class="register-container">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-8 px-6 sm:px-8 register-card">
                    <!-- Header with Back Button -->
                    <div class="flex justify-between items-center mb-6">
                        <p-button 
                            variant="text" 
                            icon="pi pi-arrow-left" 
                            severity="secondary" 
                            size="small"
                            [rounded]="true"
                            (click)="navigateToLanding()" 
                            class="hover:bg-surface-100 dark:hover:bg-surface-800" />
                    </div>

                    <!-- Logo and Title Section -->
                    <div class="text-center mb-8">
                        <div class="logo-container mb-6">
                            <img 
                                alt="ACTIA ES Logo" 
                                class="logo-image mx-auto" 
                                src="./../../../assets/images/logo-actia.jpg"/>
                        </div>
                        <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-bold mb-2">
                            Rejoignez ACTIA ES !
                        </h1>
                        <p class="text-surface-600 dark:text-surface-300 text-base font-medium">
                            Créez votre compte pour commencer
                        </p>
                    </div>

                    <p-toast></p-toast>
                    
                    @if (!isRegistered) {
                    <!-- Registration Form -->
                    <form class="register-form space-y-6"
                        name="form"
                        (ngSubmit)="f.form.valid && onSubmit()"
                        #f="ngForm"
                        novalidate>
                        
                        <!-- Progress Bar -->
                        <div class="mb-6">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm text-surface-600 dark:text-surface-300">Progression de l'inscription</span>
                                <span class="text-sm text-surface-600 dark:text-surface-300">{{getProgressPercentage()}}%</span>
                            </div>
                            <p-progressBar [value]="getProgressPercentage()" [showValue]="false" styleClass="h-2"></p-progressBar>
                        </div>

                        <!-- Form Fields -->
                        <div class="space-y-5">
                            <!-- First Row: Username and First Name -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <!-- Username Field -->
                                <div class="form-field">
                                    <p-floatLabel>
                                        <input 
                                            pInputText 
                                            id="username" 
                                            name="username" 
                                            type="text" 
                                            class="w-full input-field" 
                                            [(ngModel)]="form.username" 
                                            required 
                                            #username="ngModel"
                                            [class.p-invalid]="username.errors && f.submitted" />
                                        <label for="username">Nom d'utilisateur *</label>
                                    </p-floatLabel>
                                    @if (username.errors && f.submitted) {
                                        <small class="p-error mt-1 block">Le nom d'utilisateur est obligatoire.</small>
                                    }
                                </div>

                                <!-- First Name Field -->
                                <div class="form-field">
                                    <p-floatLabel>
                                        <input 
                                            pInputText 
                                            id="firstname" 
                                            name="firstname" 
                                            type="text" 
                                            class="w-full input-field" 
                                            [(ngModel)]="form.firstname" 
                                            required 
                                            #firstname="ngModel"
                                            [class.p-invalid]="firstname.errors && f.submitted" />
                                        <label for="firstname">Prénom *</label>
                                    </p-floatLabel>
                                    @if (firstname.errors && f.submitted) {
                                        <small class="p-error mt-1 block">Le prénom est obligatoire.</small>
                                    }
                                </div>
                            </div>

                            <!-- Second Row: Last Name and Email -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <!-- Last Name Field -->
                                <div class="form-field">
                                    <p-floatLabel>
                                        <input 
                                            pInputText 
                                            id="lastname" 
                                            name="lastname" 
                                            type="text" 
                                            class="w-full input-field" 
                                            [(ngModel)]="form.lastname" 
                                            required 
                                            #lastname="ngModel"
                                            [class.p-invalid]="lastname.errors && f.submitted" />
                                        <label for="lastname">Nom de famille *</label>
                                    </p-floatLabel>
                                    @if (lastname.errors && f.submitted) {
                                        <small class="p-error mt-1 block">Le nom de famille est obligatoire.</small>
                                    }
                                </div>

                                <!-- Email Field -->
                                <div class="form-field">
                                    <p-floatLabel>
                                        <input 
                                            pInputText 
                                            id="email" 
                                            name="email" 
                                            type="email" 
                                            class="w-full input-field" 
                                            [(ngModel)]="form.email" 
                                            required 
                                            email 
                                            #email="ngModel"
                                            [class.p-invalid]="email.errors && f.submitted" />
                                        <label for="email">Adresse e-mail *</label>
                                    </p-floatLabel>
                                    @if (email.errors && f.submitted) {
                                        <div class="mt-1">
                                            @if (email.errors['required']) {
                                                <small class="p-error block">Une adresse e-mail est obligatoire.</small>
                                            }
                                            @if (email.errors['email']) {
                                                <small class="p-error block">Veuillez saisir une adresse e-mail valide.</small>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            
                            <!-- Third Row: Password and Confirm Password -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <!-- Password Field -->
                                <div class="form-field">
                                    <p-floatLabel>
                                        <p-password 
                                            id="password" 
                                            [(ngModel)]="form.password" 
                                            name="password" 
                                            [toggleMask]="true" 
                                            [fluid]="true" 
                                            [feedback]="true" 
                                            required 
                                            minlength="6" 
                                            #password="ngModel"
                                            [class.p-invalid]="password.errors && f.submitted"
                                            promptLabel="Enter a password"
                                            weakLabel="Too simple"
                                            mediumLabel="Average complexity"
                                            strongLabel="Complex password">
                                        </p-password>
                                        <label for="password">Mot de passe *</label>
                                    </p-floatLabel>
                                    @if (password.errors && f.submitted) {
                                        <div class="mt-1">
                                            @if (password.errors['required']) {
                                                <small class="p-error block">Un mot de passe est requis.</small>
                                            }
                                            @if (password.errors['minlength']) {
                                                <small class="p-error block">Le mot de passe doit comporter au moins 6 caractères.</small>
                                            }
                                        </div>
                                    }
                                </div>

                                <!-- Confirm Password Field -->
                                <div class="form-field">
                                    <p-floatLabel>
                                        <p-password 
                                            id="confirmPassword" 
                                            [(ngModel)]="form.confirmPassword" 
                                            name="confirmPassword" 
                                            [toggleMask]="true" 
                                            [fluid]="true" 
                                            [feedback]="false" 
                                            required 
                                            #confirmPassword="ngModel"
                                            [class.p-invalid]="(confirmPassword.errors && f.submitted) || (form.password !== form.confirmPassword && f.submitted && form.confirmPassword)">
                                        </p-password>
                                        <label for="confirmPassword">Confirmer le mot de passe *</label>
                                    </p-floatLabel>
                                    @if (confirmPassword.errors && f.submitted) {
                                        <small class="p-error mt-1 block">Veuillez confirmer votre mot de passe.</small>
                                    }
                                    @if (form.password !== form.confirmPassword && f.submitted && form.confirmPassword) {
                                        <small class="p-error mt-1 block">Les mots de passe ne correspondent pas.</small>
                                    }
                                </div>
                            </div>
                        </div>

                        <!-- Terms and Conditions -->
                        <div class="flex items-start gap-3 mt-6">
                            <p-checkbox 
                                [(ngModel)]="acceptTerms" 
                                name="acceptTerms" 
                                id="acceptTerms" 
                                binary 
                                required 
                                #terms="ngModel"
                                [class.p-invalid]="terms.errors && f.submitted">
                            </p-checkbox>
                            <label for="acceptTerms" class="text-sm text-surface-700 dark:text-surface-200 leading-relaxed cursor-pointer">
                                J'accepte les
                                <span class="text-primary-600 hover:text-primary-700 font-medium underline cursor-pointer">
                                    Conditions générales
                                </span> 
                                and 
                                <span class="text-primary-600 hover:text-primary-700 font-medium underline cursor-pointer">
                                    Politique de confidentialité
                                </span>
                            </label>
                        </div>
                        @if (terms.errors && f.submitted) {
                            <small class="p-error block">Vous devez accepter les conditions générales.</small>
                        }

                        <!-- Submit Button -->
                        <div class="mt-8">
                            <p-button 
                                label="Create Account" 
                                icon="pi pi-user-plus"
                                styleClass="w-full submit-button" 
                                type="submit" 
                                size="large"
                                [loading]="isRegistering"
                                [disabled]="!acceptTerms || (form.password !== form.confirmPassword && form.confirmPassword)">
                            </p-button>
                        </div>
                        
                        <!-- Divider -->
                        <p-divider align="center" styleClass="my-6">
                            <span class="text-surface-500 dark:text-surface-400 text-sm px-3 bg-surface-0 dark:bg-surface-900">
                                Vous avez déjà un compte ?
                            </span>
                        </p-divider>
                        
                        <!-- Login Link -->
                        <div class="text-center">
                            <p-button 
                                label="Se connecter" 
                                icon="pi pi-sign-in"
                                severity="secondary" 
                                [text]="true"
                                size="large"
                                styleClass="login-link-button"
                                (onClick)="navigateToLogin()">
                            </p-button>
                        </div>
                        
                        <!-- Error Message -->
                        @if (f.submitted && isRegistrationFailed) {
                            <div class="mt-4">
                                <p-message 
                                    severity="error" 
                                    [closable]="true"
                                    (onClose)="isRegistrationFailed = false">
                                    <span>Échec de l'enregistrement: {{errorMessage}}</span>
                                </p-message>
                            </div>
                        }
                    </form>
                    } @else {
                        <!-- Success State -->
                        <div class="text-center space-y-6">
                            <!-- Success Card -->
                            <p-card styleClass="success-card border-0 shadow-lg">
                                <ng-template pTemplate="content">
                                    <div class="flex flex-col items-center gap-4">
                                        <!-- Success Icon with Animation -->
                                        <div class="success-icon-container">
                                            <div class="bg-green-100 dark:bg-green-900/20 rounded-full p-6 mb-2 success-icon-bg">
                                                <i class="pi pi-check-circle text-green-600 dark:text-green-400 text-5xl success-icon"></i>
                                            </div>
                                        </div>
                                        
                                        <!-- Success Message -->
                                        <div class="text-center">
                                            <h2 class="text-surface-900 dark:text-surface-0 text-2xl font-bold mb-3">
                                                Bienvenue chez ACTIA ES !
                                            </h2>
                                            <p class="text-surface-600 dark:text-surface-300 text-base mb-2">
                                                Votre compte a été créé avec succès.
                                            </p>
                                            <p class="text-surface-500 dark:text-surface-400 text-sm">
                                                Veuillez consulter votre messagerie électronique pour vérifier votre compte et terminer le processus d'inscription.
                                            </p>
                                        </div>
                                        
                                        <!-- Primary Action Button -->
                                        <p-button 
                                            label="Aller à la page de login" 
                                            icon="pi pi-sign-in"
                                            styleClass="w-full success-button"
                                            size="large"
                                            (onClick)="navigateToLogin()">
                                        </p-button>
                                    </div>
                                </ng-template>
                            </p-card>

                            <!-- Resend Email Section -->
                            <p-card styleClass="resend-card border-0 shadow-sm">
                                <ng-template pTemplate="content">
                                    <div class="flex flex-col items-center gap-3">
                                        <!-- Info Icon -->
                                        <div class="bg-orange-100 dark:bg-orange-900/20 rounded-full p-3">
                                            <i class="pi pi-info-circle text-orange-600 dark:text-orange-400 text-2xl"></i>
                                        </div>
                                        
                                        <!-- Info Message -->
                                        <div class="text-center">
                                            <p class="text-surface-700 dark:text-surface-200 mb-2 font-medium">
                                                Vous n'avez pas reçu l'e-mail de vérification ?
                                            </p>
                                            <p class="text-surface-500 dark:text-surface-400 text-sm mb-4">
                                                Vérifiez votre dossier spam ou cliquez ci-dessous pour renvoyer le message.
                                            </p>
                                        </div>
                                        
                                        <!-- Secondary Action Button -->
                                        <p-button 
                                            label="Renvoyer l'e-mail de vérification" 
                                            icon="pi pi-send"
                                            severity="secondary"
                                            [outlined]="true"
                                            styleClass="w-full resend-button"
                                            [loading]="isResending"
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
        .register-container {
            border-radius: 56px;
            padding: 0.3rem;
            background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            width: 100%;
            max-width: 480px;
            max-width: 600px;
        }

        .register-card {
            border-radius: 53px;
            backdrop-filter: blur(10px);
        }

        .logo-container {
            width: 120px;
            height: 120px;
            margin: 0 auto;
            border-radius: 50%;
            padding: 20px;
            background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .logo-image {
            width: 80px;
            height: auto;
            object-fit: contain;
            border-radius: 8px;
        }

        .form-field {
            position: relative;
            margin-bottom: 1.5rem;
        }

        .input-field {
            transition: all 0.3s ease;
            border-radius: 12px !important;
            height: 3.5rem;
        }

        .input-field:focus {
            box-shadow: 0 0 0 3px rgba(var(--primary-500), 0.2) !important;
        }

        .submit-button {
            background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%) !important;
            border: none !important;
            border-radius: 12px !important;
            height: 3.5rem !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
        }

        .submit-button:hover:not(:disabled) {
            background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%) !important;
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(var(--primary-500), 0.3);
        }

        .login-link-button {
            color: var(--primary-600) !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
        }

        .login-link-button:hover {
            background: var(--primary-50) !important;
            transform: translateY(-1px);
        }

        .success-card {
            background: linear-gradient(135deg, var(--green-50) 0%, var(--surface-0) 100%) !important;
            border-radius: 16px !important;
        }

        .success-icon-container {
            position: relative;
        }

        .success-icon-bg {
            animation: pulse 2s infinite;
        }

        .success-icon {
            animation: checkmark 0.6s ease-in-out;
        }

        .success-button {
            background: linear-gradient(135deg, var(--green-600) 0%, var(--green-700) 100%) !important;
            border: none !important;
            border-radius: 12px !important;
            height: 3.5rem !important;
            font-weight: 600 !important;
        }

        .success-button:hover {
            background: linear-gradient(135deg, var(--green-700) 0%, var(--green-800) 100%) !important;
            transform: translateY(-1px);
        }

        .resend-card {
            background: var(--surface-50) !important;
            border-radius: 16px !important;
        }

        .resend-button {
            border-radius: 12px !important;
            height: 3rem !important;
            font-weight: 500 !important;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes checkmark {
            0% { transform: scale(0) rotate(0deg); }
            50% { transform: scale(1.2) rotate(180deg); }
            100% { transform: scale(1) rotate(360deg); }
        }

        /* Dark mode adjustments */
        :host-context(.dark) .logo-container {
            background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%);
        }

        :host-context(.dark) .success-card {
            background: linear-gradient(135deg, var(--green-900) 0%, var(--surface-900) 100%) !important;
        }

        :host-context(.dark) .resend-card {
            background: var(--surface-800) !important;
        }

        /* Responsive improvements */
        @media (max-width: 640px) {
            .register-container {
                border-radius: 24px;
                padding: 0.2rem;
                margin: 1rem;
                max-width: 480px
            }

            .register-card {
                border-radius: 22px;
                padding: 1.5rem !important;
            }

            .logo-container {
                width: 100px;
                height: 100px;
                padding: 15px;
            }

            .logo-image {
                width: 70px;
            }
        }
    `],
    providers: [MessageService]
})
export class Register implements OnInit {
    
    form: any = {
        username: null,
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        confirmPassword: null
    };
    
    acceptTerms: boolean = false;
    isRegistered = false;
    isRegistrationFailed = false;
    isRegistering = false;
    isResending = false;
    errorMessage = '';

    constructor(
        private authService: AuthService, 
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Component initialization logic
    }

    getProgressPercentage(): number {
        let filledFields = 0;
        const totalFields = 6; // username, firstname, lastname, email, password, confirmPassword
        
        if (this.form.username) filledFields++;
        if (this.form.firstname) filledFields++;
        if (this.form.lastname) filledFields++;
        if (this.form.email) filledFields++;
        if (this.form.password) filledFields++;
        if (this.form.confirmPassword) filledFields++;
        
        return Math.round((filledFields / totalFields) * 100);
    }
    
    onSubmit(): void {
        const { username, firstname, lastname, email, password, confirmPassword } = this.form;

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

        this.isRegistering = true;

        // Call the register service
        console.log(this.form);
        this.authService.register(username, firstname, lastname, email, password).subscribe({
            next: data => {
                this.isRegistrationFailed = false;
                this.isRegistered = true;
                this.isRegistering = false;
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Registration successful!', 
                    detail: `Welcome to ACTIA ES, ${firstname}!`,
                    life: 5000
                });
            },
            error: err => {
                this.isRegistering = false;
                this.errorMessage = err.error.message || 'Registration failed. Please try again.';
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
        this.router.navigate(['/auth/login']);
    }

    navigateToLanding(): void {
        this.router.navigate(['/']);
    }

    resendverificationEmail(): void {
        if (!this.form.email) {
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Email required', 
                detail: 'Please provide your email address.' 
            });
            return;
        }

        this.isResending = true;
        this.authService.resendVerificationEmail(this.form.email).subscribe({
            next: () => {
                this.isResending = false;
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Verification email sent!', 
                    detail: 'Please check your inbox and spam folder.',
                    life: 5000
                });
            },
            error: err => {
                this.isResending = false;
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: err.error.message || 'Failed to send verification email' 
                });
            }
        });
    }
}