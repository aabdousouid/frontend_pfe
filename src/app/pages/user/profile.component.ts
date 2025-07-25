import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
//import { InputTextareaModule } from 'primeng/inputtextarea';
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

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
  current: boolean;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

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
    //InputTextareaModule,
    DropdownModule,
    ChipsModule,
    TagModule,
    AvatarModule,
    DividerModule,
    PanelModule,
    TabViewModule,
    ProgressBarModule,
    BadgeModule,
    TooltipModule
  ],
  template: `
    <div class="profile-container" *ngIf="profile">
      <!-- Header Section -->
      <div class="profile-header">
        <div class="header-content">
          <div class="profile-avatar-section">
           <!--  [image]="userProfile.avatar"  -->
            <p-avatar 
              icon="pi pi-user" 
              size="xlarge" 
              shape="circle"
              [style]="{'width': '120px', 'height': '120px'}"
              class="profile-avatar">
            </p-avatar>
            <div class="upload-overlay">
              <i class="pi pi-camera"></i>
            </div>
          </div>
          
          <div class="profile-info">
            <h1 class="profile-name" *ngIf="!editMode">{{user.firstname}} {{user.lastname}}</h1>
            <input *ngIf="editMode" pInputText [(ngModel)]="user.firstname" placeholder="First Name" [style]="{'margin': '1%'}">

            <input *ngIf="editMode" pInputText [(ngModel)]="user.lastname" placeholder="Last Name">

            <p class="profile-title" *ngIf="!editMode">{{profile.title}}</p>
            <input *ngIf="editMode" pInputText [(ngModel)]="profile.title" class=" w-full" placeholder="Current Position" [style]="{'margin': '1%'}">
            <div class="profile-location" [style]="{'marginTop': '3%'}">
              <i *ngIf="!editMode" class="pi pi-map-marker"></i>
              <span *ngIf="!editMode">{{profile.address}}</span>
              <!-- <input *ngIf="editMode" pInputText [(ngModel)]="userProfile.location" placeholder="Location"> -->
              <p-iconfield *ngIf="editMode" class="w-full">
                        <p-inputicon class="pi pi-map-marker" />
                        <input pInputText type="text" [(ngModel)]="profile.address" placeholder="Location" />
                    </p-iconfield>
            </div>
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-number" *ngIf="!editMode">{{profile.experienceYears}}</span>
                <p-inputnumber *ngIf="editMode" [(ngModel)]="profile.experienceYears" showButtons mode="decimal"></p-inputnumber>
                <span class="stat-label">Années d'expérience</span>
                
              </div>
              <!-- <div class="stat-item">
                <span class="stat-number" *ngIf="!editMode">{{userProfile.projectsCompleted}}</span>
                <p-inputnumber *ngIf="editMode" [(ngModel)]="userProfile.projectsCompleted" showButtons mode="decimal"></p-inputnumber>
                <span class="stat-label">Projets</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" *ngIf="!editMode">{{userProfile.skills.length}}</span>
                <p-inputnumber *ngIf="editMode" [(ngModel)]="userProfile.skills.length" showButtons mode="decimal"></p-inputnumber>
                <span class="stat-label">Skills</span>
              </div> -->
            </div>
          </div>
          
          <div class="profile-actions">
            <p-button 
              label="Edit Profile" 
              icon="pi pi-pencil" 
              class="edit-btn"
              (onClick)="toggleEditMode()">
            </p-button>
            <p-button *ngIf="!editMode"
              label="Download CV" 
              icon="pi pi-download" 
              severity="secondary"
              outlined="true"
              >
            </p-button>
            <!-- <p-button *ngIf="editMode"
              label="Upload CV" 
              icon="pi pi-upload" 
              severity="primary"
              outlined="true"
              (change)="onFileSelected($event)"
              >
              
            </p-button> -->
          
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="profile-content">
        <p-tabView>
          <!-- Overview Tab -->
          <p-tabPanel header="Overview" leftIcon="pi pi-user">
            <div class="tab-content">
              <!-- About Section -->
              <p-card header="About" class="section-card" [style]="{'marginBottom': '1.5rem'}">
                <div *ngIf="!editMode" class="about-content">
                  <p>{{profile.summary}}</p>
                </div>
                <div *ngIf="editMode" class="edit-about">
                  <textarea 
                    pInputTextarea 
                    [(ngModel)]="profile.summary"
                    rows="4" 
                    class="w-full">
                  </textarea>
                </div>
              </p-card>

              <!-- Contact Information -->
              <p-card header="Contact Information" class="section-card">
                <div class="contact-grid">
                  <div class="contact-item">
                    <i class="pi pi-envelope contact-icon"></i>
                    <div>
                      <label>Email</label>
                      <p *ngIf="!editMode">{{user.email}}</p>
                      <input *ngIf="editMode" pInputText [(ngModel)]="user.email" class="w-full">
                    </div>
                  </div>
                  <div class="contact-item">
                    <i class="pi pi-phone contact-icon"></i>
                    <div>
                      <label>Phone</label>
                      <p *ngIf="!editMode">{{profile.phoneNumber}}</p>
                      <input *ngIf="editMode" pInputText [(ngModel)]="profile.phoneNumber" class="w-full">
                    </div>
                  </div>
                  <div class="contact-item">
                    <i class="pi pi-linkedin contact-icon"></i>
                    <div>
                      <label>LinkedIn</label>
                      <p *ngIf="!editMode">{{linkedinLink}}</p>
                      <input *ngIf="editMode" pInputText [(ngModel)]="linkedinLink" class="w-full">
                    </div>
                  </div>
                  <div class="contact-item">
                    <i class="pi pi-github contact-icon"></i>
                    <div>
                      <label>GitHub</label>
                      <p *ngIf="!editMode">{{githubLink}}</p>
                      <input *ngIf="editMode" pInputText [(ngModel)]="githubLink" class="w-full">
                    </div>
                  </div>
                </div>
              </p-card>
            </div>
          </p-tabPanel>

          <!-- Experience Tab -->
          <p-tabPanel header="Experience" leftIcon="pi pi-briefcase">
            <div class="tab-content">
              <div class="section-header">
                <h3>Work Experience</h3>
                <p-button 
                  *ngIf="editMode"
                  icon="pi pi-plus" 
                  label="Add Experience"
                  size="small"
                  (onClick)="addExperience()">
                </p-button>
              </div>
              
              <div class="experience-list">
                <p-card *ngFor="let exp of profile.workHistory; let i = index" class="experience-card">
                  <div class="experience-header">
                    <div class="experience-info" *ngIf="!editMode">
                      <h4>{{exp.title}}</h4>
                      <h5>{{exp.company}}</h5>
                      <p class="duration">{{exp.duration}}</p>
                      <!-- <p-tag *ngIf="exp.current" severity="success" value="Current"></p-tag> -->
                    </div>

                    <div class="experience-info" *ngIf="editMode">
                      
                      <input *ngIf="editMode" pInputText [(ngModel)]="exp.title" class="w-full contact-item" style="margin-bottom: 1rem;" placeholder="Position">
                      
                      <input *ngIf="editMode" pInputText [(ngModel)]="exp.company" class="w-full contact-item" style="margin-bottom: 1rem;" placeholder="Company">

                    
                      <input *ngIf="editMode" pInputText [(ngModel)]="exp.duration" class="w-full contact-item" style="margin-bottom: 1rem;" placeholder="Duration">


                      <!-- <p-tag *ngIf="exp.current" severity="success" value="Current"></p-tag> -->
                    </div>
                    <p-button 
                      *ngIf="editMode"
                      icon="pi pi-times" 
                      severity="danger"
                      text="true"
                      size="small"
                      (onClick)="removeExperience(i)">
                    </p-button>
                  </div>
                  <p-divider></p-divider>

                  <p *ngIf="!editMode">{{exp.description}}</p>

                  <div *ngIf="editMode" class="edit-about">
                    <textarea 
                      pInputTextarea 
                      [(ngModel)]="exp.description"
                      placeholder="Describe your experience"
                      rows="4" 
                      class="w-full">
                    </textarea>
                  </div>


                </p-card>
              </div>
            </div>
          </p-tabPanel>

          <!-- Skills Tab -->
         <!--  <p-tabPanel header="Skills" leftIcon="pi pi-cog">
            <div class="tab-content">
              <div class="section-header">
                <h3>Technical Skills</h3>
                <p-button 
                  *ngIf="editMode"
                  icon="pi pi-plus" 
                  label="Add Skill"
                  size="small"
                  (onClick)="addSkill()">
                </p-button>
              </div>

              <div class="skills-container">
                <div *ngFor="let skillCategory of getSkillCategories()" class="skill-category">
                  <h4>{{skillCategory}}</h4>
                  <div class="skills-grid">
                    <div *ngFor="let skill of getSkillsByCategory(skillCategory); let i = index" 
                         class="skill-item">
                      <div class="skill-header">
                        <span class="skill-name contact-item" *ngIf="!editMode">{{skill.name}}</span>
                        <input *ngIf="editMode" pInputText [(ngModel)]="skill.name" placeholder="Skill Name" class="w-full contact-item" style="margin-bottom: 1rem;">

                        <span class="skill-percentage" *ngIf="!editMode">
                         
                           <i class="pi pi-star" style="color: #4ade80;"></i>
                        </span>
                        <p-button 
                          *ngIf="editMode"
                          icon="pi pi-times" 
                          severity="danger"
                          text="true"
                          size="small"
                          (onClick)="removeSkill(skill)">
                        </p-button>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </p-tabPanel> -->

          <!-- Education Tab -->
          <p-tabPanel header="Education" leftIcon="pi pi-book">
            <div class="tab-content">
              <div class="section-header">
                <h3>Education</h3>
                <p-button 
                  *ngIf="editMode"
                  icon="pi pi-plus" 
                  label="Add Education"
                  size="small"
                  (onClick)="addEducation()">
                </p-button>
              </div>

              <div class="education-list">
                <p-card *ngFor="let edu of profile.education; let i = index" class="education-card">
                  <div class="education-header">
                    <div class="education-info" *ngIf="!editMode">
                      <h4>{{edu.degree}}</h4>
                      <h5>{{edu.school}}</h5>
                      <p class="year">{{edu.duration}}</p>
                      <!-- <p-tag *ngIf="edu.gpa" severity="info" [value]="'GPA: ' + edu.gpa"></p-tag> -->
                    </div>

                    <div class="education-info" *ngIf="editMode">

                      <input *ngIf="editMode" pInputText [(ngModel)]="edu.degree" class="w-full contact-item" style="margin-bottom: 1rem;" placeholder="Degree">
                      
                      <input *ngIf="editMode" pInputText [(ngModel)]="edu.school" class="w-full contact-item" style="margin-bottom: 1rem;" placeholder="Initution">

                    
                      <input *ngIf="editMode" pInputText [(ngModel)]="edu.duration" class="w-full contact-item" style="margin-bottom: 1rem;" placeholder="Duration">
                      <!-- <p-tag *ngIf="edu.gpa" severity="info" [value]="'GPA: ' + edu.gpa"></p-tag> -->
                    </div>


                    <p-button 
                      *ngIf="editMode"
                      icon="pi pi-times" 
                      severity="danger"
                      text="true"
                      size="small"
                      (onClick)="removeEducation(i)">
                    </p-button>
                  </div>
                </p-card>
              </div>
            </div>
          </p-tabPanel>
        </p-tabView>
      </div>

      <!-- Save/Cancel Actions for Edit Mode -->
      <div *ngIf="editMode" class="edit-actions">
        <p-button 
          label="Save Changes" 
          icon="pi pi-check"
          (onClick)="saveChanges()">
        </p-button>
        <p-button 
          label="Cancel" 
          icon="pi pi-times"
          severity="secondary"
          outlined="true"
          (onClick)="cancelEdit()">
        </p-button>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafb 0%, #e8f2f6 100%);
      padding: 0;
    }

    .profile-header {
      background: linear-gradient(135deg, #2d5a87 0%, #1e3a5f 100%);
      //background: linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%);
      color: white;
      padding: 2rem 2rem;
      position: relative;
      box-shadow: 0 4px 4px rgba(0,0,0,0.1);
      border-radius: 12px 12px 12px 12px;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .profile-avatar-section {
      position: relative;
    }

    .profile-avatar {
      border: 4px solid rgba(255,255,255,0.2);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }

    .upload-overlay {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #4ade80;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 3px solid white;
    }

    .upload-overlay:hover {
      background: #22c55e;
      transform: scale(1.1);
    }

    .profile-info {
      flex: 1;
      min-width: 300px;
    }

    .profile-name {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(45deg, #ffffff, #4ade80);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .profile-title {
      font-size: 1.3rem;
      color: #cbd5e1;
      margin: 0 0 1rem 0;
      font-weight: 500;
    }

    .profile-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      margin-bottom: 1.5rem;
    }

    .profile-stats {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      color: #4ade80;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #cbd5e1;
      margin-top: 0.25rem;
    }

    .profile-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .profile-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .tab-content {
      padding: 1rem 0;
    }

    .section-card {
      
      margin-bottom: 1.5rem;
      border-radius: 12px;
      border: none;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      color: #1e3a5f;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #4ade80;
    }

    .contact-icon {
      color: #4ade80;
      font-size: 1.2rem;
      width: 20px;
    }

    .contact-item label {
      font-weight: 600;
      color: #475569;
      display: block;
      margin-bottom: 0.25rem;
    }

    .contact-item p {
      margin: 0;
      color: #64748b;
    }

    .experience-list, .education-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .experience-card, .education-card {
      border-left: 4px solid #4ade80;
      border-radius: 8px;
    }

    .experience-header, .education-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .experience-info h4, .education-info h4 {
      color: #1e3a5f;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    .experience-info h5, .education-info h5 {
      color: #4ade80;
      font-size: 1rem;
      font-weight: 500;
      margin: 0 0 0.5rem 0;
    }

    .duration, .year {
      color: #64748b;
      font-size: 0.875rem;
      margin: 0 0 0.5rem 0;
    }

    .skills-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .skill-category h4 {
      color: #1e3a5f;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .skill-item {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .skill-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .skill-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .skill-name {
      font-weight: 600;
      color: #1e3a5f;
    }

    .skill-percentage {
      font-size: 0.875rem;
      color: #4ade80;
      font-weight: 600;
    }

    .edit-actions {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      gap: 1rem;
      z-index: 1000;
    }

    .about-content {
      line-height: 1.6;
      color: #475569;
    }

    /* PrimeNG Customizations */
    ::ng-deep .p-tabview .p-tabview-nav li .p-tabview-nav-link {
      border-radius: 8px 8px 0 0;
      transition: all 0.3s ease;
    }

    ::ng-deep .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
      background: #4ade80;
      border-color: #4ade80;
      color: white;
    }

    ::ng-deep .p-button.edit-btn {
      background: #4ade80;
      border-color: #4ade80;
    }

    ::ng-deep .p-button.edit-btn:hover {
      background: #22c55e;
      border-color: #22c55e;
    }

    ::ng-deep .p-progressbar.skill-progress .p-progressbar-value {
      background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
    }

    ::ng-deep .p-card .p-card-header {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      color: #1e3a5f;
      font-weight: 600;
      border-radius: 8px 8px 0 0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .profile-stats {
        justify-content: center;
      }

      .profile-actions {
        flex-direction: row;
        justify-content: center;
      }

      .profile-content {
        padding: 1rem;
      }

      .contact-grid {
        grid-template-columns: 1fr;
      }

      .skills-grid {
        grid-template-columns: 1fr;
      }

      .edit-actions {
        position: relative;
        bottom: auto;
        right: auto;
        justify-content: center;
        margin: 2rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit{
  
 profile: UserProfile = new UserProfile();
  user: any;
  editMode = false;
  originalProfile: UserProfile | null = null;
  githubLink = '';
  linkedinLink = '';

  constructor(private storageService: StorageService, private userService: UserService) {}

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

  saveChanges() {
    this.profile.userId = this.user.id;

    this.profile.links = [];
    if (this.linkedinLink) this.profile.links.push(this.linkedinLink);
    if (this.githubLink) this.profile.links.push(this.githubLink);
    console.log("Profile links:", this.profile);

    
  this.userService.getProfileByUser(this.user.id).subscribe({
    next:(existingProfile)=>{
      if(existingProfile){
        this.userService.updateProfile(existingProfile.profileId,this.profile).subscribe({
          next: () => console.log("Profile updated successfully"),
          error: (err) => console.error("Error updating profile:", err)
        })
      } 
      else{
        this.userService.addProfile(this.profile).subscribe({
      next: () => console.log("Profile saved successfully"),
      error: (err) => console.error("Error saving profile:", err)
    });
      }
    }
  })


    this.editMode = false;
  }

  cancelEdit() {
    if (this.originalProfile) {
      this.profile = structuredClone(this.originalProfile);
    }
    this.editMode = false;
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