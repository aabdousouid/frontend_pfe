import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { DashboardstatsService } from '../../../shared/services/dashboardstats.service';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Activité de la plateforme</div>
        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`
})
export class RevenueStreamWidget {
    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(public layoutService: LayoutService,private dashboardStatsService: DashboardstatsService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            /* this.initChart(); */
        });
    }

   ngOnInit() {
    this.dashboardStatsService.activityChart().subscribe(res => {
      const s = getComputedStyle(document.documentElement);

      // ensure each dataset has a type (Chart.js + PrimeNG)
      res.datasets = res.datasets.map((d: any, i: number) => ({
        ...d,
        type: 'bar',
        backgroundColor:
          i === 0 ? s.getPropertyValue('--p-primary-400') :
          i === 1 ? s.getPropertyValue('--p-primary-300') :
                    s.getPropertyValue('--p-primary-200'),
        barThickness: 32
      }));

      this.chartData = res;     // <- keep data as-is from backend
      this.buildOptions();      // <- only (re)compute options
    });
  }

  // ⬇️ Build ONLY options here; do NOT assign chartData
  private buildOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: textMutedColor },
          grid: { color: 'transparent', borderColor: 'transparent' }
        },
        y: {
          stacked: true,
          ticks: { color: textMutedColor },
          grid: { color: borderColor, borderColor: 'transparent', drawTicks: false }
        }
      }
    };
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
