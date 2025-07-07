import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipsModule } from 'primeng/chips';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';

import { StorageService } from '../../shared/services/storage.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { TabsModule } from 'primeng/tabs';

interface UserProfile {
  profileId?: number;
  title?: string;
  phoneNumber?: string;
  address?: string;
  links?: { [key: string]: string };
  summary?: string;
  skills?: string;
  experienceYears?: number;
  languages?: string[];
  certifications?: string[];
  education?: string;
  cvFilePath?: string;
  workHistory?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ChipsModule,
    FileUploadModule,
    MessageModule,
    MessagesModule,
    ToastModule,
    ConfirmDialogModule,
    TabsModule,
    DividerModule,
    SkeletonModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="profile-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
      
      <!-- Header -->
      <div class="profile-header">
        <div class="header-content">
          <h1 class="profile-title">My Profile</h1>
          <p class="profile-subtitle">Complete your profile to get better job matches</p>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <p-card>
          <p-skeleton height="2rem" class="mb-2"></p-skeleton>
          <p-skeleton height="4rem" class="mb-3"></p-skeleton>
          <p-skeleton height="2rem" width="50%" class="mb-2"></p-skeleton>
          <p-skeleton height="2rem" width="75%"></p-skeleton>
        </p-card>
      </div>

      <!-- Profile Content -->
      <div *ngIf="!loading" class="profile-content">
        
        <!-- Basic Information -->
        
        <div class="card">
    <p-tabs value="0"> 
        <p-tablist>
            <p-tab value="0">
            <i class="pi pi-user"></i>  
            Aperçu général </p-tab>
            <p-tab value="1">
            <i class="pi pi-briefcase"></i>   
            Experience
            </p-tab>
            <p-tab value="2">
            <i class="pi pi-cog"></i>
                
            Skills</p-tab>
            <p-tab value="3">
            <i class="pi pi-book"></i>    
            Education</p-tab>
        </p-tablist>
        <p-tabpanels>
            <p-tabpanel value="0" leftIcon="pi pi-user">
            
            @if(editing==true){
                <p-card header="Basic Information" class="section-card">
                    <div class="form-grid">
                        <div class="form-field">
                        <label for="title">Professional Title</label>
                        <input 
                            pInputText 
                            id="title"
                            [(ngModel)]="userProfile.title" 
                            placeholder="e.g., Software Engineer, Marketing Manager"
                            class="w-full">
                        </div>
                        
                        <div class="form-field">
                        <label for="phone">Phone Number</label>
                        <input 
                            pInputText 
                            id="phone"
                            [(ngModel)]="userProfile.phoneNumber" 
                            placeholder="+1 (555) 123-4567"
                            class="w-full">
                        </div>
                        
                        <div class="form-field full-width">
                        <label for="address">Address</label>
                        <input 
                            pInputText 
                            id="address"
                            [(ngModel)]="userProfile.address" 
                            placeholder="City, State, Country"
                            class="w-full">
                        </div>
                    </div>
                </p-card>}
            </p-tabpanel>
            <p-tabpanel value="1">
                <p class="m-0">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                    dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius
                    modi.
                </p>
            </p-tabpanel>
            <p-tabpanel value="2">
                <p class="m-0">
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
                    atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
                    sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum
                    facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
                    impedit quo minus.
                </p>
            </p-tabpanel>

            <p-tabpanel value="3">
                <p class="m-0">
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
                    atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
                    sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum
                    facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
                    impedit quo minus.
                </p>
            </p-tabpanel>
        </p-tabpanels>
    </p-tabs>
</div>
        

  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .profile-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .profile-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }

    .profile-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem 2rem;
    }

    .loading-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .section-card {
      margin-bottom: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      border: none;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .form-field {
      display: flex;
      flex-direction: column;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .form-field label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-help {
      color: #6b7280;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .cv-upload-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .current-cv {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f0f9ff;
      border-radius: 8px;
      border: 1px solid #0ea5e9;
    }

    .cv-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      color: #0369a1;
    }

    .cv-filename {
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    /* PrimeNG Customizations */
    ::ng-deep .p-card .p-card-header {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      color: #1e293b;
      font-weight: 600;
      border-radius: 8px 8px 0 0;
    }

    ::ng-deep .save-btn {
      background: #10b981;
      border-color: #10b981;
    }

    ::ng-deep .save-btn:hover {
      background: #059669;
      border-color: #059669;
    }

    ::ng-deep .p-fileupload-basic .p-button {
      background: #6366f1;
      border-color: #6366f1;
    }

    ::ng-deep .p-fileupload-basic .p-button:hover {
      background: #4f46e5;
      border-color: #4f46e5;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .profile-content {
        padding: 0 1rem 2rem;
      }
      
      .profile-title {
        font-size: 2rem;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .current-cv {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class AddProfileComponent implements OnInit {
  userProfile: UserProfile = {};
  loading = false;
  saving = false;
  user: any;
  editing:boolean=true;
  
  // Helper properties for links
  linkedinUrl = '';
  githubUrl = '';
  portfolioUrl = '';
  websiteUrl = '';

  constructor(
    private storageService: StorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.user = this.storageService.getUser();
    
    if (this.user) {
      // Here you would typically call your profile service
      // For now, we'll simulate loading
      setTimeout(() => {
        this.initializeProfile();
        this.loading = false;
      }, 1000);
    } else {
      this.loading = false;
    }
  }

  initializeProfile(): void {
    // Initialize with empty profile or loaded data
    this.userProfile = {
      title: '',
      phoneNumber: '',
      address: '',
      links: {},
      summary: '',
      skills: '',
      experienceYears: 0,
      languages: [],
      certifications: [],
      education: '',
      cvFilePath: '',
      workHistory: ''
    };
    
    // Initialize link URLs
    if (this.userProfile.links) {
      this.linkedinUrl = this.userProfile.links['linkedin'] || '';
      this.githubUrl = this.userProfile.links['github'] || '';
      this.portfolioUrl = this.userProfile.links['portfolio'] || '';
      this.websiteUrl = this.userProfile.links['website'] || '';
    }
  }

  updateLink(platform: string, url: string): void {
    if (!this.userProfile.links) {
      this.userProfile.links = {};
    }
    this.userProfile.links[platform] = url;
  }

  saveProfile(): void {
    this.saving = true;
    
    // Here you would call your profile service to save the data
    // Simulate API call
    setTimeout(() => {
      this.saving = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile saved successfully!'
      });
    }, 1500);
  }

  resetProfile(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset all changes?',
      header: 'Confirm Reset',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.initializeProfile();
        this.messageService.add({
          severity: 'info',
          summary: 'Reset',
          detail: 'Profile has been reset'
        });
      }
    });
  }

  onCVSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      // Here you would upload the file to your backend
      // For now, we'll just update the filename
      this.userProfile.cvFilePath = file.name;
      this.messageService.add({
        severity: 'info',
        summary: 'CV Selected',
        detail: `${file.name} selected for upload`
      });
    }
  }

  downloadCV(): void {
    if (this.userProfile.cvFilePath) {
      // Here you would implement the download logic
      this.messageService.add({
        severity: 'info',
        summary: 'Download',
        detail: 'CV download started'
      });
    }
  }

  getCVFileName(): string {
    if (this.userProfile.cvFilePath) {
      return this.userProfile.cvFilePath.split('/').pop() || this.userProfile.cvFilePath;
    }
    return '';
  }
}