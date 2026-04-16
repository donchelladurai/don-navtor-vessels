import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighchartsChartComponent } from 'highcharts-angular';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import * as Highcharts from 'highcharts';
import { EmissionsFacade } from '@don-navtor-vessels/emissions-state';

@Component({
  selector: 'app-emissions-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    HighchartsChartComponent,
    SelectModule,
    ProgressSpinnerModule,
  ],
  providers: [DatePipe],
  templateUrl: './emissions-page.html',
  styleUrl: './emissions-page.scss',
})
export class EmissionsPage {
  readonly facade = inject(EmissionsFacade);
  private readonly datePipe = inject(DatePipe);

  chartOptions = computed<Highcharts.Options>(() => {
    const series = this.facade.selectedTimeSeries();
    const name = this.facade.selectedVesselName();

    const categories = series.map(
      (ts) =>
        this.datePipe.transform(ts.report_from_utc, 'dd MMM') ??
        ts.report_from_utc,
    );

    return {
      chart: { type: 'line', zooming: { type: 'x' } },
      title: { text: `Emissions — ${name}` },
      subtitle: { text: '(Drag across the date range to zoom in)' },
      xAxis: {
        categories,
        title: { text: 'Date' },
        labels: {
          rotation: -45,
          step: Math.max(1, Math.floor(series.length / 20)),
        },
      },
      yAxis: [
        { title: { text: 'CO₂ (tonnes)' } },
        { title: { text: 'NOₓ (tonnes)' }, opposite: true },
      ],
      tooltip: { shared: true, valueDecimals: 2 },
      series: [
        {
          name: 'CO₂',
          type: 'line',
          data: series.map((ts) => ts.co2_emissions),
          color: '#2563eb',
          yAxis: 0,
        },
        {
          name: 'NOₓ',
          type: 'line',
          data: series.map((ts) => ts.nox_emissions),
          color: '#ea580c',
          yAxis: 1,
        },
      ],
      legend: { align: 'center', verticalAlign: 'bottom' },
      credits: { enabled: false },
      plotOptions: { line: { marker: { enabled: false }, lineWidth: 2 } },
    };
  });

  constructor() {
    this.facade.reload();
  }
}
