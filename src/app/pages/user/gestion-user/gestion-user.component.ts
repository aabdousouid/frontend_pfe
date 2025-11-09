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
import { TooltipModule } from 'primeng/tooltip';

// PrimeNG Services
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserManagementService } from '../../../shared/services/user-management.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router } from '@angular/router';

/** ===== Backend types (as returned by your API) ===== */
interface BackendRole {
  id: number;
  name: string; // e.g., "ROLE_ADMIN", "ROLE_USER"
}

interface BackendEducation {
  degree: string;
  school: string;
  duration: string;
}

interface BackendWorkHistory {
  company: string;
  title: string;
  duration: string;
  description: string;
}

interface BackendProfile {
  profileId: number;
  title: string | null;
  phoneNumber: string | null;
  address: string | null;
  links: string[];
  summary: string | null;
  skills: string[];
  experienceYears: number | null;
  languages: string[];
  certifications: string[];
  cvFilePath: string | null;
  education: BackendEducation[];
  workHistory: BackendWorkHistory[];
}

interface BackendUser {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  emailVerified: boolean;
  roles: BackendRole[];
  verificationToken?: string | null;
  verificationTokenExpiry?: string | null;
  profile?: BackendProfile | null;
  isActive?: boolean;
  active?: boolean;
}

/** ===== UI model used by the table & dialogs ===== */
type UserStatus = 'active' | 'blocked' | 'pending';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  /** normalized, e.g. "admin" | "user" | "recruiter" | "hr_manager" | "candidate" */
  role: string;
  /** derived from emailVerified (and you can later wire real status) */
  status: UserStatus;
  /** taken from profile?.title or "—" */
  department: string;
  /** optional fields not present in backend: keep nullable */
  lastLogin: Date | null;
  createdAt: Date | null;
  avatar?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    IconFieldModule,
    InputIconModule,
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
  templateUrl: './gestion-user.component.html',
  styleUrl: './gestion-user.component.scss'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  searchTerm = '';
  selectedStatus = '';
  selectedRole = '';

  userDetailsVisible = false;
  editUserVisible = false;
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
    private messageService: MessageService,
    private userService: UserManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  /** Map "ROLE_ADMIN" -> "admin", "ROLE_USER" -> "user", etc. */
  private normalizeRole(backendRoles: BackendRole[]): string {
    if (!backendRoles || backendRoles.length === 0) return 'user';
    const primary = backendRoles[0].name || '';
    // take the substring after "ROLE_" and lower it, fallback to raw
    return primary.startsWith('ROLE_') ? primary.substring(5).toLowerCase() : primary.toLowerCase();
  }

  /** Derive a status from emailVerified for now */
private deriveStatus(emailVerified: boolean, isActive: boolean): 'active' | 'blocked' | 'pending' {
  if (!isActive) return 'blocked';
  return emailVerified ? 'active' : 'pending';
}

  /** Safely pick department from profile.title (or "—") */
  private deriveDepartment(profile?: BackendProfile | null): string {
    return (profile?.title?.trim() || '—');
  }

  /** Convert backend payload to UI model */
 private mapBackendToUI(bu: BackendUser): User {
  // tolerate either "isActive" or "active"; default true so you don't show everything as blocked when missing
  const active = (bu.isActive ?? bu.active ?? true);
  const verified = (bu.emailVerified ?? false);

  return {
    id: bu.id,
    firstName: bu.firstname,
    lastName: bu.lastname,
    email: bu.email,
    role: this.normalizeRole(bu.roles),
    isActive: active,
    status: this.deriveStatus(verified, active),
    department: this.deriveDepartment(bu.profile ?? null),
    lastLogin: null,
    createdAt: null
  };
}

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data: BackendUser[]) => {
        this.users = (data || []).map(this.mapBackendToUI.bind(this));
        this.applyFilters();
        console.log('[DEBUG] users:', this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.users = [];
        this.filteredUsers = [];
      }
    });
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get activeUsers(): number {
    return this.users.filter(u => u.status === 'active').length;
  }

  get blockedUsers(): number {
    return this.users.filter(u => u.status === 'blocked').length;
  }

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value || '';
    this.applyFilters();
  }

  onStatusFilter() {
    this.applyFilters();
  }

  onRoleFilter() {
    this.applyFilters();
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch =
        !term ||
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.department || '').toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term);

      const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  viewUser(user: User) {
    this.selectedUser = user;
    this.userDetailsVisible = true;
  }
  viewUserProfile(userId:number | undefined){
        this.router.navigate(['/app/profile/', userId]);
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
  const willDeactivate = user.isActive; // if active -> deactivate
  const actionLabel = willDeactivate ? 'désactiver' : 'activer';

  this.confirmationService.confirm({
    message: `Êtes-vous sûr de vouloir ${actionLabel} cet utilisateur ?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.userService.setActive(user.id, !willDeactivate).subscribe({
        next: (updated) => {
          const updatedActive = (updated.isActive ?? updated.active);
          const updatedVerified = (updated.emailVerified ?? false);

          user.isActive = updatedActive;
          user.status = this.deriveStatus(updatedVerified, updatedActive);
          this.applyFilters();
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Utilisateur ${willDeactivate ? 'désactivé' : 'activé'} avec succès`
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de ${actionLabel} l'utilisateur`
          });
        }
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
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Fonctionnalité de création d\'utilisateur à implémenter'
    });
  }

  getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'Actif';
    case 'blocked': return 'Désactivé'; // or "Bloqué"
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

  formatDate(date: Date | null): string {
    if (!date) return '—';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
