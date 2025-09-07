import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { StorageService } from '../../shared/services/storage.service';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'app-login',
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
        FloatLabelModule
    ],
    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden p-4">
            <div class="flex flex-col items-center justify-center w-full max-w-md">
                <div class="login-container">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-8 px-6 sm:px-8 login-card">
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
                                Bienvenue chez ACTIA ES !
                            </h1>
                            <p class="text-surface-600 dark:text-surface-300 text-base font-medium">
                                Connectez-vous pour continuer
                            </p>
                        </div>

                        <p-toast></p-toast>
                        
                        @if (!isLoggedIn) {
                            <!-- Login Form -->
                            <form class="login-form space-y-6"
                                name="form"
                                (ngSubmit)="f.form.valid && onSubmit()"
                                #f="ngForm"
                                novalidate>
                                
                                <!-- Form Fields -->
                                <div class="space-y-5">
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

                                    <!-- Password Field -->
                                    <div class="form-field">
                                        <p-floatLabel>
                                            <p-password 
                                                id="password" 
                                                [(ngModel)]="form.password" 
                                                name="password" 
                                                [toggleMask]="true" 
                                                [fluid]="true" 
                                                [feedback]="false" 
                                                required 
                                                minlength="6" 
                                                #password="ngModel"
                                                [class.p-invalid]="password.errors && f.submitted">
                                            </p-password>
                                            <label for="password">Mot de passe *</label>
                                        </p-floatLabel>
                                        @if (password.errors && f.submitted) {
                                            <div class="mt-1">
                                                @if (password.errors['required']) {
                                                    <small class="p-error block">Le mot de passe est requis.</small>
                                                }
                                                @if (password.errors['minlength']) {
                                                    <small class="p-error block">Le mot de passe doit comporter au moins 6 caractères.</small>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>

                                <!-- Remember Me and Forgot Password -->
                                <div class="flex items-center justify-between mt-6">
                                    <div class="flex items-center gap-3">
                                        <p-checkbox 
                                            [(ngModel)]="checked" 
                                            name="checked" 
                                            id="rememberme" 
                                            binary>
                                        </p-checkbox>
                                        <label for="rememberme" class="text-sm text-surface-700 dark:text-surface-200 cursor-pointer">
                                            Se souvenir de moi
                                        </label>
                                    </div>
                                    <span class="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer underline">
                                        Mot de passe oublié ?
                                    </span>
                                </div>

                                <!-- Submit Button -->
                                <div class="mt-8">
                                    <p-button 
                                        label="Se connecter" 
                                        icon="pi pi-sign-in"
                                        styleClass="w-full submit-button" 
                                        type="submit" 
                                        size="large"
                                        [loading]="isLoggingIn">
                                    </p-button>
                                </div>
                                
                                <!-- Divider -->
                                <p-divider align="center" styleClass="my-6">
                                    <span class="text-surface-500 dark:text-surface-400 text-sm px-3 bg-surface-0 dark:bg-surface-900">
                                        Ou
                                    </span>
                                </p-divider>
                                
                                <!-- Register Link -->
                                <div class="text-center">
                                    <p class="text-surface-600 dark:text-surface-300 text-sm mb-4">
                                        Vous n'avez pas de compte ?
                                    </p>
                                    <p-button 
                                        label="Créer un compte" 
                                        icon="pi pi-user-plus"
                                        severity="secondary" 
                                        [outlined]="true"
                                        size="large"
                                        styleClass="register-link-button w-full"
                                        (onClick)="navigateToRegister()">
                                    </p-button>
                                </div>
                                
                                <!-- Error Message -->
                                @if (f.submitted && isLoginFailed) {
                                    <div class="mt-4">
                                        <p-message 
                                            severity="error" 
                                            [closable]="true"
                                            (onClose)="isLoginFailed = false">
                                            <span>Échec de la connexion: {{errorMessage}}</span>
                                        </p-message>
                                    </div>
                                }
                            </form>
                        } @else {
                            <!-- Success State - Logged In -->
                            <div class="text-center space-y-6">
                                <p-card styleClass="success-card border-0 shadow-lg">
                                    <ng-template pTemplate="content">
                                        <div class="flex flex-col items-center gap-4">
                                            <!-- Success Icon -->
                                            <div class="success-icon-container">
                                                <div class="bg-green-100 dark:bg-green-900/20 rounded-full p-6 mb-2 success-icon-bg">
                                                    <i class="pi pi-check-circle text-green-600 dark:text-green-400 text-5xl success-icon"></i>
                                                </div>
                                            </div>
                                            
                                            <!-- Success Message -->
                                            <div class="text-center">
                                                <h2 class="text-surface-900 dark:text-surface-0 text-2xl font-bold mb-3">
                                                    Connexion réussie !
                                                </h2>
                                                <p class="text-surface-600 dark:text-surface-300 text-base mb-2">
                                                    Vous êtes connecté en tant que :
                                                </p>
                                                <div class="flex flex-wrap justify-center gap-2 mb-4">
                                                    @for (role of roles; track role) {
                                                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200">
                                                            {{role}}
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                            
                                            <!-- Primary Action Button -->
                                            <p-button 
                                                label="Continuer vers le tableau de bord" 
                                                icon="pi pi-arrow-right"
                                                styleClass="w-full success-button"
                                                size="large"
                                                (onClick)="navigateAfterLogin()">
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
        .login-container {
            border-radius: 56px;
            padding: 0.3rem;
            background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            width: 100%;
            max-width: 480px;
        }

        .login-card {
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

        .register-link-button {
            border-radius: 12px !important;
            height: 3.5rem !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
            border-color: var(--primary-600) !important;
            color: var(--primary-600) !important;
        }

        .register-link-button:hover {
            background: var(--primary-50) !important;
            transform: translateY(-1px);
            border-color: var(--primary-700) !important;
            color: var(--primary-700) !important;
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

        :host-context(.dark) .register-link-button {
            background: transparent !important;
        }

        :host-context(.dark) .register-link-button:hover {
            background: var(--primary-900) !important;
        }

        /* Responsive improvements */
        @media (max-width: 640px) {
            .login-container {
                border-radius: 24px;
                padding: 0.2rem;
                margin: 1rem;
            }

            .login-card {
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
export class Login implements OnInit {
    
    form: any = {
        username: null,
        password: null
    };
    
    checked: boolean = false;
    isLoggedIn = false;
    isLoginFailed = false;
    isLoggingIn = false;
    errorMessage = '';
    roles: string[] = [];
    
    constructor(
        private route: ActivatedRoute,
        private authService: AuthService, 
        private storageService: StorageService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (this.storageService.isLoggedIn()) {
            this.isLoggedIn = true;
            this.roles = this.storageService.getUser().roles;
        }
    }
    
    onSubmit(): void {
        const { username, password } = this.form;
        
        this.isLoggingIn = true;

        this.authService.login(username, password).subscribe({
            next: data => {
                this.storageService.saveUser(data);
                this.isLoginFailed = false;
                this.isLoggedIn = true;
                this.isLoggingIn = false;
                this.roles = this.storageService.getUser().roles;
                
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Connexion réussie!', 
                    detail: `Bienvenue ${username}`,
                    life: 5000
                });
                
                // Navigate after a short delay to show success state
                setTimeout(() => {
                    this.navigateAfterLogin();
                }, 2000);
            },
            error: err => {
                this.isLoggingIn = false;
                this.errorMessage = err.error.message || 'Vérifiez vos identifiants';
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Échec de la connexion!', 
                    detail: 'Vérifiez vos identifiants!' 
                });
                this.isLoginFailed = true;
            }
        });
    }

    navigateAfterLogin(): void {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
    }

    navigateToLanding(): void {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
    }
    
    navigateToRegister(): void {
        this.router.navigate(['/auth/register']);
    }
}