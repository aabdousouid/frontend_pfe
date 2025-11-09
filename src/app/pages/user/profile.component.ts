import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as NgFormsModule } from '@angular/forms';

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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';

import { StorageService } from '../../shared/services/storage.service';
import { UserService } from '../../shared/services/user.service';
import { JobsService } from '../../shared/services/jobs.service';
import { EducationHistoryItem, UserProfile, WorkHistoryItem } from '../../shared/models/user-profile';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    // Angular Forms
    NgFormsModule,

    // PrimeNG
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    CardModule,
    ButtonModule,
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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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
    private jobService: JobsService
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.userService.getUser(this.user.id).subscribe({
      next: (data) => {
        this.profile = data?.profile ? data.profile : new UserProfile();
        this.normalizeProfile();
        this.extractLinks();
      },
      error: () => {
        // Ensure we always work with a normalized object
        this.profile = new UserProfile();
        this.normalizeProfile();
      }
    });
  }

  /** Ensure arrays are never null to avoid unshift/splice errors */
  private normalizeProfile(): void {
    this.profile.skills = this.profile.skills ?? [];
    this.profile.links = this.profile.links ?? [];
    this.profile.workHistory = this.profile.workHistory ?? [];
    this.profile.education = this.profile.education ?? [];
  }

  extractLinks(): void {
    this.linkedinLink = '';
    this.githubLink = '';

    for (const link of this.profile.links ?? []) {
      const lower = (link || '').toLowerCase();
      if (!this.linkedinLink && lower.includes('linkedin')) this.linkedinLink = link;
      if (!this.githubLink && lower.includes('github')) this.githubLink = link;
    }
  }

  toggleEditMode(): void {
    if (!this.editMode) {
      this.originalProfile = structuredClone(this.profile);
    }
    this.editMode = !this.editMode;
    if (this.editMode) this.normalizeProfile();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

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
      input.value = ''; // Reset file input
    }
  }

  triggerFileUpload(): void {
    this.fileInput?.nativeElement?.click();
  }

  saveChanges(): void {
    this.profile.userId = this.user.id;

    // Recompute links from the two inputs
    this.profile.links = [];
    if (this.linkedinLink) this.profile.links.push(this.linkedinLink);
    if (this.githubLink) this.profile.links.push(this.githubLink);

    // Safety: ensure arrays exist before sending
    this.normalizeProfile();

    this.uploading = true;

    this.userService.getProfileByUser(this.user.id).subscribe({
      next: (existingProfile) => {
        if (existingProfile) {
          // Update existing profile
          if (this.selectedCVFile) {
            this.userService.updateProfileWithCV(existingProfile.profileId, this.profile, this.selectedCVFile).subscribe({
              next: (updatedProfile) => {
                this.profile = updatedProfile ?? this.profile;
                this.normalizeProfile();
                this.extractLinks();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Profile and CV updated successfully'
                });
                this.finishSaving();
              },
              error: (err) => {
                console.error('Error updating profile with CV:', err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to update profile with CV'
                });
                this.uploading = false;
              }
            });
          } else {
            this.userService.updateProfile(existingProfile.profileId, this.profile).subscribe({
              next: (updatedProfile) => {
                this.profile = updatedProfile ?? this.profile;
                this.normalizeProfile();
                this.extractLinks();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Profile updated successfully'
                });
                this.finishSaving();
              },
              error: (err) => {
                console.error('Error updating profile:', err);
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
            this.userService.addProfileWithCV(this.profile, this.selectedCVFile).subscribe({
              next: (newProfile) => {
                this.profile = newProfile ?? this.profile;
                this.normalizeProfile();
                this.extractLinks();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Profile created with CV successfully'
                });
                this.finishSaving();
              },
              error: (err) => {
                console.error('Error creating profile with CV:', err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to create profile with CV'
                });
                this.uploading = false;
              }
            });
          } else {
            this.userService.addProfile(this.profile).subscribe({
              next: (newProfile) => {
                this.profile = newProfile ?? this.profile;
                this.normalizeProfile();
                this.extractLinks();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Profile created successfully'
                });
                this.finishSaving();
              },
              error: (err) => {
                console.error('Error creating profile:', err);
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
        console.error('Error checking existing profile:', err);
        this.uploading = false;
      }
    });
  }

  private finishSaving(): void {
    this.editMode = false;
    this.uploading = false;
    this.selectedCVFile = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  downloadCV(): void {
    if (this.profile.profileId && this.profile.cvFilePath) {
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

  cancelEdit(): void {
    if (this.originalProfile) {
      this.profile = structuredClone(this.originalProfile);
      this.normalizeProfile();
      this.extractLinks();
    }
    this.editMode = false;
    this.selectedCVFile = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  /** === Experience / Education CRUD (null-safe) === */

  addExperience(): void {
    (this.profile.workHistory ??= []).unshift({
      company: '',
      title: '',
      duration: '',
      description: ''
    } as WorkHistoryItem);
  }

  removeExperience(index: number): void {
    (this.profile.workHistory ??= []);
    if (index > -1 && index < this.profile.workHistory.length) {
      this.profile.workHistory.splice(index, 1);
    }
  }

  addEducation(): void {
    (this.profile.education ??= []).unshift({
      degree: '',
      school: '',
      duration: ''
    } as EducationHistoryItem);
  }

  removeEducation(index: number): void {
    (this.profile.education ??= []);
    if (index > -1 && index < this.profile.education.length) {
      this.profile.education.splice(index, 1);
    }
  }
}
