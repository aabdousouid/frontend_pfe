import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ApplicationService } from '../../../../shared/services/application.service';
import { InterviewService } from '../../../../shared/services/interview.service';
import { Router } from '@angular/router';

interface DropdownOption {
  label: string;
  value: string;
}

/** ===== BACKEND: Applications payload (minimal fields used) ===== */
interface BackendApplicationDto {
  applicationId: number;
  user?: {
    id?: number;
    username?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
  };
  job?: {
    jobId?: number;
    title?: string;
    company?: string;
    location?: string;
  };
  status?: string;
  interviews?: BackendInterviewInApplication[];
}

interface BackendInterviewInApplication {
  interviewId: number;
  scheduledDate?: string | Date;
  scheduledHour?: string | Date;
  location?: string;
  notes?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | string;
  duration?: number;
  interviewType?: 'ONSITE' | 'REMOTE' | 'PHONE' | string;
  interviewTest?: 'TECHNIQUE' | 'HR' | 'FINAL' | string;
  interviewerEmail?: string;
  interviewerName?: string;
  meetingLink?: string | null;
}

/** ===== UI VIEW MODEL ===== */
interface Interview {
  interviewId: number;
  applicationId: number;
  candidateName: string;
  candidateEmail: string;
  position: string;
  company: string;
  location: string;
  interviewType: string;   // ONSITE | REMOTE | PHONE
  interviewTest: string;   // TECHNIQUE | HR | FINAL | RH
  scheduledDate: Date;     // merged date + time
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'URGENT' | string;
  interviewer: string;
  duration: number;
}

@Component({
  selector: 'app-interview-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    DialogModule,
    CardModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule
  ],
  templateUrl: './interview-list.component.html',
  styleUrl: './interview-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class InterviewListComponent implements OnInit {
  interviews: Interview[] = [];

  // Filters / search
  searchValue = '';
  selectedLocation: string | null = null;
  selectedInterviewType: string | null = null;
  selectedStatus: string | null = null;
  selectedDateRange: Date[] | null = null;

  selectedRows: Interview[] = [];

  // Track cancel-in-flight to disable the button
  private cancelling = new Set<number>();

  // Dropdown options
  locationOptions: DropdownOption[] = []; // built from data
  interviewTypeOptions: DropdownOption[] = [
    { label: 'Sur site', value: 'ONSITE' },
    { label: 'À distance', value: 'REMOTE' },
    { label: 'Téléphonique', value: 'PHONE' }
  ];
  statusOptions: DropdownOption[] = [
    { label: 'Programmé', value: 'SCHEDULED' },
    { label: 'Terminé', value: 'COMPLETED' },
    { label: 'Annulé', value: 'CANCELLED' }
    // { label: 'Urgent', value: 'URGENT' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private applicationService: ApplicationService,
    private interviewService: InterviewService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadFromApplications();
  }

  /** ===== Utilities ===== */
  private toDateSafe(v?: string | Date | null): Date | null {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  private mergeDateAndTime(day?: string | Date | null, time?: string | Date | null): Date {
    const date = this.toDateSafe(day) ?? new Date();
    const t = this.toDateSafe(time);
    if (t) {
      date.setHours(t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds());
    }
    return date;
  }

  private displayName(user?: BackendApplicationDto['user']): string {
    const username = user?.username?.trim();
    const full = `${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim();
    return username || full || '—';
  }

  private mapFromApplication(app: BackendApplicationDto, iv: BackendInterviewInApplication): Interview {
    return {
      interviewId: iv.interviewId,
      applicationId: app.applicationId,
      candidateName: this.displayName(app.user),
      candidateEmail: app.user?.email ?? '',
      position: app.job?.title ?? '—',
      company: app.job?.company ?? '',
      location: iv.location ?? (app.job?.location ?? '—'),
      interviewType: iv.interviewType ?? 'ONSITE',
      interviewTest: iv.interviewTest ?? 'TECHNIQUE',
      scheduledDate: this.mergeDateAndTime(iv.scheduledDate, iv.scheduledHour),
      status: (iv.status as Interview['status']) ?? 'SCHEDULED',
      interviewer: iv.interviewerName ?? iv.interviewerEmail ?? '',
      duration: iv.duration ?? 0
    };
  }

  private buildLocationOptionsFromData(): void {
    const uniq = Array.from(new Set(this.interviews.map(i => i.location).filter(Boolean))) as string[];
    this.locationOptions = uniq.map(loc => ({ label: loc, value: loc }));
  }

  /** ===== Load from Applications (flatten interviews) ===== */
  loadFromApplications(): void {
    this.applicationService.getAllApplications().subscribe({
      next: (apps: any) => {
        const rows: Interview[] = [];
        for (const app of apps ?? []) {
          if (Array.isArray(app.interviews) && app.interviews.length) {
            for (const iv of app.interviews) {
              rows.push(this.mapFromApplication(app, iv));
            }
          }
        }
        this.interviews = rows;
        this.buildLocationOptionsFromData();
      },
      error: (err) => {
        console.error('Error fetching applications', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les entretiens'
        });
      }
    });
  }

  /** ===== Cancel interview (API) ===== */
  onCancelInterview(row: Interview) {
    // Optional: prevent cancel if already completed/cancelled
    if (row.status === 'COMPLETED' || row.status === 'CANCELLED') {
      alert(`L'entretien est déjà ${row.status.toLowerCase()}.`);
      return;
    }

    if (!confirm("Confirmer l'annulation de cet entretien ?")) {
      return;
    }

    const reason = prompt('Raison (optionnelle) :') || undefined;

    // mark as cancelling to disable the button
    this.cancelling.add(row.interviewId);

    this.interviewService.cancelInterview(row.interviewId, reason as any).subscribe({
      next: (updated: any) => {
        row.status = (updated?.status as string) || 'CANCELLED';
        this.messageService.add({
          severity: 'warn',
          summary: 'Entretien annulé',
          detail: `L'entretien a été annulé${reason ? ` (raison: ${reason})` : ''}.`
        });
        this.cancelling.delete(row.interviewId);
      },
      error: (_) => {
        // Fallback to legacy PUT endpoint
        this.interviewService.cancelUsingPut(row.interviewId).subscribe({
          next: () => {
            row.status = 'CANCELLED';
            this.messageService.add({
              severity: 'warn',
              summary: 'Entretien annulé',
              detail: `L'entretien a été annulé.`
            });
            this.cancelling.delete(row.interviewId);
          },
          error: (err) => {
            console.error('Failed to cancel interview:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: `Échec d'annulation de l'entretien.`
            });
            this.cancelling.delete(row.interviewId);
          }
        });
      },
    });
  }

  /** ===== Filtering / Search ===== */
  getFilteredInterviews(): Interview[] {
    let filtered = [...this.interviews];

    // Global search
    if (this.searchValue) {
      const q = this.searchValue.toLowerCase();
      filtered = filtered.filter(i =>
        i.candidateName.toLowerCase().includes(q) ||
        i.position.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.interviewer.toLowerCase().includes(q) ||
        i.interviewTest.toLowerCase().includes(q) ||
        i.interviewType.toLowerCase().includes(q) ||
        i.status.toLowerCase().includes(q)
      );
    }

    // Location
    if (this.selectedLocation) {
      filtered = filtered.filter(i => i.location === this.selectedLocation);
    }

    // Type
    if (this.selectedInterviewType) {
      filtered = filtered.filter(i => i.interviewType === this.selectedInterviewType);
    }

    // Status
    if (this.selectedStatus) {
      filtered = filtered.filter(i => i.status === this.selectedStatus);
    }

    // Date range
    if (
      this.selectedDateRange &&
      this.selectedDateRange.length === 2 &&
      this.selectedDateRange[0] &&
      this.selectedDateRange[1]
    ) {
      const start = new Date(this.selectedDateRange[0]);
      const end = new Date(this.selectedDateRange[1]);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter(i => {
        const d = new Date(i.scheduledDate);
        return d >= start && d <= end;
      });
    }

    return filtered;
  }

  /** ===== Stats ===== */
  getTotalInterviews(): number {
    return this.getFilteredInterviews().length;
  }
  getScheduledInterviews(): number {
    return this.getFilteredInterviews().filter(i => i.status === 'SCHEDULED').length;
  }
  getCompletedInterviews(): number {
    return this.getFilteredInterviews().filter(i => i.status === 'COMPLETED').length;
  }
  getUrgentInterviews(): number {
    return this.getFilteredInterviews().filter(i => i.status === 'URGENT').length;
  }

  /** ===== UI Helpers ===== */
  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      SCHEDULED: 'Programmé',
      COMPLETED: 'Terminé',
      CANCELLED: 'Annulé',
      URGENT: 'Urgent'
    };
    return labels[status] ?? status;
  }

  getStatusSeverity(status: string): string {
    const severities: Record<string, string> = {
      SCHEDULED: 'info',
      COMPLETED: 'success',
      CANCELLED: 'secondary',
      URGENT: 'danger'
    };
    return severities[status] ?? 'info';
  }

  getInterviewTypeSeverity(type: string): string {
    const severities: Record<string, string> = {
      ONSITE: 'warning',
      REMOTE: 'info',
      PHONE: 'secondary'
    };
    return severities[type] ?? 'secondary';
  }

  /** ===== Filter Events ===== */
  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchValue = target?.value ?? '';
  }
  onFilterChange() { /* computed via getFilteredInterviews() */ }
  clearFilters() {
    this.selectedLocation = null;
    this.selectedInterviewType = null;
    this.selectedStatus = null;
    this.selectedDateRange = null;
    this.searchValue = '';

    this.messageService.add({
      severity: 'info',
      summary: 'Filtres effacés',
      detail: 'Tous les filtres ont été réinitialisés'
    });
  }

  /** ===== Local actions (edit/delete examples) ===== */
  addNewInterview() {
    this.messageService.add({
      severity: 'info',
      summary: 'Nouvel Entretien',
      detail: 'Redirection vers le formulaire de création d\'entretien'
    });
  }

  exportData() {
    const rows = this.getFilteredInterviews();
    const headers = [
      'ApplicationId','Candidat','Email','Poste','Entreprise','Localisation',
      'Type','Test','Date','Statut','Interviewer','Durée(min)'
    ];
    const csv = [
      headers.join(','),
      ...rows.map(i => [
        i.applicationId,
        i.candidateName,
        i.candidateEmail,
        i.position,
        i.company,
        i.location,
        i.interviewType,
        i.interviewTest,
        this.formatDate(i.scheduledDate),
        i.status,
        i.interviewer,
        i.duration?.toString() ?? '0'
      ].map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `entretiens_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);

    this.messageService.add({
      severity: 'success',
      summary: 'Export réussi',
      detail: `${rows.length} entretiens exportés`
    });
  }

  viewInterview(i: Interview) {
    this.router.navigate(['/app/applications/', i.applicationId]);
    this.messageService.add({
      severity: 'info',
      summary: 'Voir l\'entretien',
      detail: `Consultation de l'entretien avec ${i.candidateName}`
    });
  }

  editInterview(i: Interview) {
    this.router.navigate(['/app/applications']);
    /* this.router.navigate(['/app/interview-edit', i.interviewId]); */
    this.messageService.add({
      severity: 'info',
      summary: 'Modifier l\'entretien',
      detail: `Modification de l'entretien avec ${i.candidateName}`
    });
  }

  deleteInterview(i: Interview) {
  this.confirmationService.confirm({
    message: `Voulez-vous vraiment supprimer l'entretien avec ${i.candidateName} ?`,
    header: 'Supprimer l\'entretien',
    icon: 'pi pi-trash',
    acceptLabel: 'Oui, supprimer',
    rejectLabel: 'Annuler',
    accept: () => {
      this.interviewService.deleteInterview(i.interviewId).subscribe({
        next: () => {
          // Remove from UI only after successful delete
          this.interviews = this.interviews.filter(x => x.interviewId !== i.interviewId);

          this.messageService.add({
            severity: 'success',
            summary: 'Entretien supprimé',
            detail: `L'entretien avec ${i.candidateName} a été supprimé`
          });
        },
        error: (err) => {
          console.error('Failed to delete interview:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de supprimer l'entretien. Veuillez réessayer.`
          });
        }
      });
    }
  });
}

  /** Expose a helper to know if a row is currently cancelling */
  isCancelling(id: number): boolean {
    return this.cancelling.has(id);
  }
}
