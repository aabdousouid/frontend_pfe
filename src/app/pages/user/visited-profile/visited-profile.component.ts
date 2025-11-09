import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { UserService } from '../../../shared/services/user.service';
import { UserProfile } from '../../../shared/models/user-profile';

@Component({
  selector: 'app-visited-profile',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
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
  templateUrl: './visited-profile.component.html',
  styleUrl: './visited-profile.component.scss'
})
export class VisitedProfileComponent implements OnInit {
  
  userId!: number;
  user: any;
  profile: UserProfile = new UserProfile();
  githubLink = '';
  linkedinLink = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;

    this.userService.getUser(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.profile = data.profile ? data.profile : new UserProfile();
        this.extractLinks();
        console.log('User data:', data);
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user profile'
        });
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

  downloadCV() {
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
        detail: 'No CV file has been uploaded for this profile'
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}