import { Component, OnInit, ViewChild, ElementRef, asNativeElements } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { StorageService } from '../../shared/services/storage.service';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { UserService } from '../../shared/services/user.service';
import { EducationHistoryItem, UserProfile, WorkHistoryItem } from '../../shared/models/user-profile';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { JobsService } from '../../shared/services/jobs.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ChipsModule,
    TagModule,
    AvatarModule,
    DividerModule,
    PanelModule,
    
    TabViewModule,
    ProgressBarModule,
    BadgeModule,
    TooltipModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  profile: UserProfile = new UserProfile();
  user: any;
  editMode = false;
  originalProfile: UserProfile | null = null;
  githubLink = '';
  linkedinLink = '';
  selectedCVFile: File | null = null;
  uploading = false;

  constructor(
    private storageService: StorageService, 
    private userService: UserService,
    private messageService: MessageService,
    private jobService:JobsService
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.userService.getUser(this.user.id).subscribe({
      next: (data) => {
        this.profile = data.profile ? data.profile : new UserProfile();
        this.extractLinks();
      }
    });
  }

  extractLinks() {
    this.linkedinLink = '';
    this.githubLink = '';

    this.profile.links?.forEach(link => {
      if (link.includes('linkedin')) this.linkedinLink = link;
      if (link.includes('github')) this.githubLink = link;
    });
  }

  toggleEditMode() {
    if (!this.editMode) {
      this.originalProfile = structuredClone(this.profile);
    }
    this.editMode = !this.editMode;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (optional)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        this.selectedCVFile = file;
        this.messageService.add({
          severity: 'success',
          summary: 'File Selected',
          detail: `${file.name} selected for upload`
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid File Type',
          detail: 'Please select a PDF or Word document'
        });
        event.target.value = ''; // Reset file input
      }
    }
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  saveChanges() {
    this.profile.userId = this.user.id;

    // Update links
    this.profile.links = [];
    if (this.linkedinLink) this.profile.links.push(this.linkedinLink);
    if (this.githubLink) this.profile.links.push(this.githubLink);

    this.uploading = true;

    this.userService.getProfileByUser(this.user.id).subscribe({
      next: (existingProfile) => {
        if (existingProfile) {
          // Update existing profile
          if (this.selectedCVFile) {
            // Update with CV
            this.userService.updateProfileWithCV(existingProfile.profileId, this.profile, this.selectedCVFile).subscribe({
              next: (updatedProfile) => {
                this.profile = updatedProfile;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Profile and CV updated successfully'
                });
                this.finishSaving();
              },
              error: (err) => {
                console.error("Error updating profile with CV:", err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to update profile with CV'
                });
                this.uploading = false;
              }
            });
          } else {
            // Update without CV
            this.userService.updateProfile(existingProfile.profileId, this.profile).subscribe({
              next: (updatedProfile) => {
                this.profile = updatedProfile;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Profile updated successfully'
                });
                this.finishSaving();
              },
              error: (err) => {
                console.error("Error updating profile:", err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to update profile'
                });
                this.uploading = false;
              }
            });
          }
        } else {
          // Create new profile
          if (this.selectedCVFile) {
            // Create with CV
            this.userService.addProfileWithCV(this.profile, this.selectedCVFile).subscribe({
              next: (newProfile) => {
                this.profile = newProfile;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Profile created with CV successfully'
                });
                this.finishSaving();
              },
              error: (err) => {
                console.error("Error creating profile with CV:", err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to create profile with CV'
                });
                this.uploading = false;
              }
            });
          } else {
            // Create without CV
            this.userService.addProfile(this.profile).subscribe({
              next: (newProfile) => {
                this.profile = newProfile;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Profile created successfully'
                });
                this.finishSaving();
              },
              error: (err) => {
                console.error("Error creating profile:", err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to create profile'
                });
                this.uploading = false;
              }
            });
          }
        }
      },
      error: (err) => {
        console.error("Error checking existing profile:", err);
        this.uploading = false;
      }
    });
  }

  private finishSaving() {
    this.editMode = false;
    this.uploading = false;
    this.selectedCVFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }


  downloadCV(){
       if (this.profile.profileId && this.profile.cvFilePath) {
    // Method 1: Direct window.open (bypasses CORS for downloads)
    const downloadUrl = `http://localhost:8080/api/profile/${this.profile.profileId}/download-cv`;
    window.open(downloadUrl, '_blank');
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'CV download started'
    });
  } else {
    this.messageService.add({
      severity: 'warn',
      summary: 'No CV Available',
      detail: 'No CV file has been uploaded yet'
    });
  }
  }

  

  cancelEdit() {
    if (this.originalProfile) {
      this.profile = structuredClone(this.originalProfile);
    }
    this.editMode = false;
    this.selectedCVFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  addExperience() {
    this.profile.workHistory.unshift({ company: '', title: '', duration: '', description: '' });
  }

  removeExperience(index: number) {
    this.profile.workHistory.splice(index, 1);
  }

  addEducation() {
    this.profile.education.unshift({ degree: '', school: '', duration: '' });
  }

  removeEducation(index: number) {
    this.profile.education.splice(index, 1);
  }
}