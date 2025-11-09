import { Component, Input } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../service/product.service';
import { UpcomingInterview } from '../../../shared/services/interview.service';
import { TagModule } from 'primeng/tag';
import { StorageService } from '../../../shared/services/storage.service';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule,TagModule,MenuModule],
    template: `<div class="card !mb-8">
      <div class="flex justify-between items-center mb-6">
        <div class="font-semibold text-xl mb-4"><span *ngIf="!isAdmin">Les</span>Prochains entretiens</div>
         
    
          <div>
        <button pButton type="button" icon="pi pi-ellipsis-v"
                class="p-button-rounded p-button-text p-button-plain"
                (click)="menu.toggle($event)"></button>
        <p-menu #menu [popup]="true" [model]="items"></p-menu>
      </div>
      </div>
  
        <p-table [value]="interviews" [paginator]="true" [rows]="5" responsiveLayout="scroll" *ngIf="interviews.length>0">
            <ng-template #header>
                <tr>
                    <th pSortableColumn="candidateName">Candidat <p-sortIcon field="candidateName"></p-sortIcon></th>
                    <th pSortableColumn="jobTitle">Job <p-sortIcon field="jobTitle"></p-sortIcon></th>
                    <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
                    <th pSortableColumn="scheduledDate">Scheduled Date <p-sortIcon field="scheduledDate"></p-sortIcon></th>
                    <th>View</th>
                </tr>
            </ng-template>
            <ng-template #body let-interview>
                <tr>
                    <td style="width: 15%; min-width: 5rem;">
                       {{interview.candidateName}}
                    </td>
                    <td style="width: 35%; min-width: 7rem;">{{ interview.jobTitle }}</td>
                    <td style="width: 35%; min-width: 8rem;"><p-tag severity="success" [value]="interview.status" /></td>
                    <td style="width: 35%; min-width: 8rem;">{{ interview.scheduledDate | date :'short' }}</td>
                    <td style="width: 15%;">
                        <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-component p-button-text p-button-icon-only"></button>
                    </td>
                </tr>
            </ng-template>
            
        </p-table>
        <div *ngIf="interviews.length === 0" #empty>
                <tr>
                    <td colspan="5" class="text-center">Aucune donnée disponible pour le moment.</td>
                </tr>
        </div>
    </div>
   <!--  <div class="card !mb-8">
      <div class="font-semibold text-xl mb-4">Upcoming Interviews</div>
      <p-table [value]="interviews" [paginator]="false" [rows]="5" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th>Candidate</th>
            <th>Job</th>
            <th>Status</th>
            <th>Scheduled Date</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-interview>
          <tr>
            <td>{{ interview.candidateName }}</td>
            <td>{{ interview.jobTitle }}</td>
            <td>{{ interview.status }}</td>
            <td>{{ interview.scheduledDate | date: 'short' }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div> -->
    `,
    providers: [ProductService]
})
export class RecentSalesWidget {

    products!: Product[];
    @Input() interviews: UpcomingInterview[] = [];
    isAdmin = false;


        items = [
    { label: 'Voir tous les entretiens', icon: 'pi pi-fw pi-refresh' ,command: () => this.redirect() }
  ];
    constructor(private productService: ProductService,private storageService:StorageService,private router:Router) {}
    redirect(){ 
    
      this.router.navigate(['/app/interviews-list']);
    }
    ngOnInit() {

        this.checkRole();
        this.productService.getProductsSmall().then((data) => (this.products = data));
        console.log('Upcoming Interviews:', this.interviews);
    }

    checkRole(){
      this.isAdmin = this.storageService.isAdmin();
      console.log("is admin : ",this.isAdmin);
    }
}
