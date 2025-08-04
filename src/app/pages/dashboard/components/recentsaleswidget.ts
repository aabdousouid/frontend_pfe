import { Component, Input } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../service/product.service';
import { UpcomingInterview } from '../../../shared/services/interview.service';
import { TagModule } from 'primeng/tag';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule,TagModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Les prochains entretiens</div>
        <p-table [value]="interviews" [paginator]="true" [rows]="5" responsiveLayout="scroll">
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

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((data) => (this.products = data));
    }
}
