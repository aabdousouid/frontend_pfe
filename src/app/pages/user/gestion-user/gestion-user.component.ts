import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';

// PrimeNG Services
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'blocked' | 'pending';
  lastLogin: Date;
  createdAt: Date;
  department: string;
  avatar?: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
    CardModule,
    ToolbarModule,
    CalendarModule,
    MultiSelectModule,
    InputSwitchModule,
    AvatarModule,
    BadgeModule,
    MenuModule,
    SplitButtonModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl:'./gestion-user.component.html',
  styleUrl:'./gestion-user.component.scss'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedRole: string = '';
  
  userDetailsVisible: boolean = false;
  editUserVisible: boolean = false;
  selectedUser: User | null = null;
  editingUser: User | null = null;

  statusOptions = [
    { label: 'Actif', value: 'active' },
    { label: 'Bloqué', value: 'blocked' },
    { label: 'En attente', value: 'pending' }
  ];

  roleOptions = [
    { label: 'Administrateur', value: 'admin' },
    { label: 'Recruteur', value: 'recruiter' },
    { label: 'RH Manager', value: 'hr_manager' },
    { label: 'Candidat', value: 'candidate' },
    { label: 'Utilisateur', value: 'user' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Mock data - replace with actual API call
    this.users = [
      {
        id: 1,
        firstName: 'Ahmed',
        lastName: 'Ben Ali',
        email: 'ahmed.benali@example.com',
        role: 'admin',
        status: 'active',
        department: 'IT',
        lastLogin: new Date('2024-01-10'),
        createdAt: new Date('2023-06-15')
      },
      {
        id: 2,
        firstName: 'Fatima',
        lastName: 'Trabelsi',
        email: 'fatima.trabelsi@example.com',
        role: 'recruiter',
        status: 'active',
        department: 'RH',
        lastLogin: new Date('2024-01-09'),
        createdAt: new Date('2023-08-20')
      },
      {
        id: 3,
        firstName: 'Mohamed',
        lastName: 'Gharbi',
        email: 'mohamed.gharbi@example.com',
        role: 'hr_manager',
        status: 'blocked',
        department: 'RH',
        lastLogin: new Date('2024-01-05'),
        createdAt: new Date('2023-09-10')
      },
      {
        id: 4,
        firstName: 'Leila',
        lastName: 'Mansouri',
        email: 'leila.mansouri@example.com',
        role: 'candidate',
        status: 'pending',
        department: 'Marketing',
        lastLogin: new Date('2024-01-08'),
        createdAt: new Date('2024-01-01')
      },
      {
        id: 5,
        firstName: 'Karim',
        lastName: 'Bouazizi',
        email: 'karim.bouazizi@example.com',
        role: 'user',
        status: 'active',
        department: 'Finance',
        lastLogin: new Date('2024-01-11'),
        createdAt: new Date('2023-11-15')
      }
    ];
    
    this.filteredUsers = [...this.users];
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get activeUsers(): number {
    return this.users.filter(user => user.status === 'active').length;
  }

  get blockedUsers(): number {
    return this.users.filter(user => user.status === 'blocked').length;
  }

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  onStatusFilter() {
    this.applyFilters();
  }

  onRoleFilter() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  viewUser(user: User) {
    this.selectedUser = user;
    this.userDetailsVisible = true;
  }

  editUser(user: User) {
    this.editingUser = { ...user };
    this.editUserVisible = true;
  }

  saveUser() {
    if (this.editingUser) {
      const index = this.users.findIndex(u => u.id === this.editingUser!.id);
      if (index !== -1) {
        this.users[index] = { ...this.editingUser };
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Utilisateur mis à jour avec succès'
        });
      }
    }
    this.editUserVisible = false;
    this.editingUser = null;
  }

  toggleUserStatus(user: User) {
    const action = user.status === 'blocked' ? 'débloquer' : 'bloquer';
    
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir ${action} cet utilisateur ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        user.status = user.status === 'blocked' ? 'active' : 'blocked';
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `Utilisateur ${action === 'débloquer' ? 'débloqué' : 'bloqué'} avec succès`
        });
      }
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Utilisateur supprimé avec succès'
        });
      }
    });
  }

  openNewUserDialog() {
    // Implementation for creating new user
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Fonctionnalité de création d\'utilisateur à implémenter'
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'blocked': return 'Bloqué';
      case 'pending': return 'En attente';
      default: return status;
    }
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'active': return 'success';
      case 'blocked': return 'danger';
      case 'pending': return 'warning';
      default: return 'info';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return 'pi pi-check-circle';
      case 'blocked': return 'pi pi-ban';
      case 'pending': return 'pi pi-clock';
      default: return 'pi pi-question-circle';
    }
  }

  getRoleSeverity(role: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (role) {
      case 'admin': return 'danger';
      case 'hr_manager': return 'warning';
      case 'recruiter': return 'success';
      case 'candidate': return 'info';
      default: return 'info';
    }
  }

  getAvatarColor(userId: number): string {
    const colors = ['#28a745', '#17a2b8', '#ffc107', '#dc3545', '#6f42c1', '#20c997'];
    return colors[userId % colors.length];
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}