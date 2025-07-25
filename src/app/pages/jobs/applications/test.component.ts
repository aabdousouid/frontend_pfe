import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Tag } from 'primeng/tag';

interface Country {
    name: string;
    code: string;
}

interface Representative {
    name: string;
    image: string;
}

interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string | Date;
    status?: string;
    representative?: Representative;
}

@Component({
    selector: 'table-expandable-row-group-demo',
    template: `<div class="card">
    <p-table [value]="customers" sortField="representative.name" sortMode="single" dataKey="representative.name" rowGroupMode="subheader" groupRowsBy="representative.name" [tableStyle]="{'min-width': '70rem'}">
        <ng-template #header>
            <tr>
                <th style="width:20%">Name</th>
                <th style="width:20%">Country</th>
                <th style="width:20%">Company</th>
                <th style="width:20%">Status</th>
                <th style="width:20%">Date</th>
            </tr>
        </ng-template>
        <ng-template #groupheader let-customer let-rowIndex="rowIndex" let-expanded="expanded">
            <tr>
                <td colspan="5">
                    <button
                        type="button"
                        pButton
                        pRipple
                        [pRowToggler]="customer"
                        text
                        rounded
                        plain
                        class="mr-2"
                        [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'">
                    </button>
                    <img
                        [alt]="customer.representative.name"
                        src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{customer.representative.image}}"
                        width="32"
                        style="vertical-align: middle; display: inline-block" />
                    <span class="font-bold ml-2">{{customer.representative.name}}</span>
                </td>
            </tr>
        </ng-template>
        <ng-template #groupfooter let-customer>
            <tr class="p-rowgroup-footer">
                <td colspan="4" style="text-align: right">Total Customers</td>
                <td>{{calculateCustomerTotal(customer.representative.name)}}</td>
            </tr>
        </ng-template>
        <ng-template #expandedrow let-customer>
            <tr>
                <td>
                    {{customer.name}}
                </td>
                <td>
                    <div class="flex items-center gap-2">
                        <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                        <span>{{ customer.country.name }}</span>
                    </div>
                </td>
                <td>
                    {{customer.company}}
                </td>
                <td>
                    <p-tag [value]="customer.status" severit="primary" />
                </td>
                <td>
                    {{customer.date}}
                </td>
            </tr>
        </ng-template>
    </p-table>
</div>`,
    standalone: true,
    imports: [TableModule, HttpClientModule, ButtonModule, Ripple, Tag],
    providers: [],
    styles: [
        `:host ::ng-deep .p-rowgroup-footer td {
            font-weight: 700;
        }

        :host ::ng-deep .p-rowgroup-header {
            span {
                font-weight: 700;
            }

            .p-row-toggler {
                vertical-align: middle;
                margin-right: .25rem;
            }
        }`
    ],
})
export class TableExpandableRowGroupDemo implements OnInit {
    customers!: Customer[];

    ngOnInit() {
        // Mock data
        this.customers = [
            {
                id: 1,
                name: 'James Butt',
                country: { name: 'United States', code: 'us' },
                company: 'Benton, John B Jr',
                date: '2023-05-20',
                status: 'qualified',
                representative: { name: 'Amy Elsner', image: 'amyelsner.png' }
            },
            {
                id: 2,
                name: 'Josephine Darakjy',
                country: { name: 'France', code: 'fr' },
                company: 'Chanay, Jeffrey A Esq',
                date: '2023-06-15',
                status: 'new',
                representative: { name: 'Amy Elsner', image: 'amyelsner.png' }
            },
            {
                id: 3,
                name: 'Art Venere',
                country: { name: 'Germany', code: 'de' },
                company: 'Chemel, James L Cpa',
                date: '2023-04-10',
                status: 'negotiation',
                representative: { name: 'Asiya Javayant', image: 'asiyajavayant.png' }
            },
            {
                id: 4,
                name: 'Lenna Paprocki',
                country: { name: 'Canada', code: 'ca' },
                company: 'Feltz Printing Service',
                date: '2023-07-05',
                status: 'renewal',
                representative: { name: 'Asiya Javayant', image: 'asiyajavayant.png' }
            },
            {
                id: 5,
                name: 'Donette Foller',
                country: { name: 'Australia', code: 'au' },
                company: 'Printing Dimensions',
                date: '2023-03-12',
                status: 'unqualified',
                representative: { name: 'Bernardo Dominic', image: 'bernardodominic.png' }
            },
            {
                id: 6,
                name: 'Simona Morasca',
                country: { name: 'United Kingdom', code: 'gb' },
                company: 'Chapman, Ross E Esq',
                date: '2023-08-22',
                status: 'qualified',
                representative: { name: 'Bernardo Dominic', image: 'bernardodominic.png' }
            },
            {
                id: 7,
                name: 'Mitsue Tollner',
                country: { name: 'Japan', code: 'jp' },
                company: 'Morlong Associates',
                date: '2023-09-30',
                status: 'new',
                representative: { name: 'Elwin Sharvill', image: 'elwinsharvill.png' }
            },
            {
                id: 8,
                name: 'Leota Dilliard',
                country: { name: 'Brazil', code: 'br' },
                company: 'Commercial Press',
                date: '2023-11-05',
                status: 'negotiation',
                representative: { name: 'Elwin Sharvill', image: 'elwinsharvill.png' }
            }
        ];
    }

    calculateCustomerTotal(name: string) {
        let total = 0;

        if (this.customers) {
            for (let customer of this.customers) {
                if (customer.representative?.name === name) {
                    total++;
                }
            }
        }

        return total;
    }

    /* getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    } */
}