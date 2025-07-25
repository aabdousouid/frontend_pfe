// add-complaint.component.ts (MODIFIED)
import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-add-complaint',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    AccordionModule,
    ButtonModule,
    TextareaModule,
    InputTextModule,
    MessageModule,
    ToastModule,
    InputNumberModule,
    CalendarModule,
    FormsModule,
    DropdownModule
  ],
  templateUrl: './add-complaint.component.html',
  styleUrl: './add-complaint.component.scss',
  providers: [MessageService]
})
export class AddComplaintComponent implements OnInit{
  @Output() complaintAdded = new EventEmitter<any>();

  showForm: boolean = false;
  savingComplaint: boolean = false;
  user!:any;

  complaint: any = {
    title: '',
    description: '',
    complaintType: '',
    complaintStatus: 'OPEN',
    user: this.user // admin selects user or set default
  };


  complaintStatus = [
   { label: 'Tous', value: 'Tous' },
  { label: 'Résolu', value: 'RESOLVED' },
  { label: 'Ouvert', value: 'OPEN' },
  { label: 'Abandonné', value: 'ABANDONED' },
  { label: 'Rejeté', value: 'REJECTED' }
    
  ];

  complaintTypes = [
    { label: 'Problème Technique', value: 'TECHNICAL_ISSUE' },
    { label: 'Service Client', value: 'PROFILE_ISSUE' },
    { label: 'Autre', value: 'OTHER' }
  ];

  constructor(
    private complaintService: ComplaintService,
    private messageService: MessageService,
    private storageService:StorageService,
    private userService:UserService
  ) {
    
  }
  ngOnInit(): void {
    this.userService.getUser(this.storageService.getUser().id).subscribe({
      next:(data=>{
        this.complaint.user = data;
        console.log(this.complaint)
      })
    })
  }

  isComplaintFormValid(): boolean {
    return !!(
      this.complaint.title &&
      this.complaint.description &&
      this.complaint.complaintType &&
      this.complaint.user !== null
    );
  }

  saveComplaint(): void {
    if (!this.isComplaintFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champs manquants',
        detail: 'Veuillez remplir tous les champs obligatoires.'
      });
      return;
    }

    this.savingComplaint = true;
    /* console.log(this.complaint); */
    this.complaintService.addComplaint(this.complaint).subscribe({
      next: (response) => {
        this.savingComplaint = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Réclamation ajoutée',
          detail: 'Votre réclamation a été envoyée avec succès.'
        });
        this.complaintAdded.emit(response);
        this.resetForm();
      },
      error: (err) => {
        this.savingComplaint = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible d\'ajouter la réclamation.'
        });
      }
    });
  }

  resetForm(): void {
    this.complaint = {
      title: '',
      description: '',
      complaintType: '',
      complaintStatus: 'OPEN',
      user: this.user
    };
  }
}
