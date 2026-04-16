import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { VesselsFacade } from '@don-navtor-vessels/vessels-state';
import { Vessel } from '@don-navtor-vessels/shared-models';
import { themeAlpine } from 'ag-grid-community';

@Component({
  selector: 'app-vessels-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridAngular, ProgressSpinnerModule],
  providers: [DatePipe],
  templateUrl: './vessels-page.html',
  styleUrl: './vessels-page.scss',
})
export class VesselsPage {
  readonly facade = inject(VesselsFacade);
  private readonly datePipe = inject(DatePipe);
  readonly gridTheme = themeAlpine;

  constructor() {
    this.facade.reload();
  }

  columnDefs: ColDef<Vessel>[] = [
    {
      field: 'name',
      headerName: 'Vessel Name',
      filter: 'agTextColumnFilter',
      sortable: true,
      pinned: 'left',
      minWidth: 150,
    },
    {
      field: 'vesselType',
      headerName: 'Type',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      field: 'imo',
      headerName: 'IMO',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'mmsi',
      headerName: 'MMSI',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'companyName',
      headerName: 'Company',
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      filter: 'agDateColumnFilter',
      sortable: true,
      valueFormatter: (p: ValueFormatterParams<Vessel>) =>
        p.value ? (this.datePipe.transform(p.value, 'dd MMM yyyy') ?? '') : '',
    },
    {
      field: 'active',
      headerName: 'Status',
      filter: true,
      sortable: true,
      maxWidth: 120,
      cellRenderer: (p: { value: boolean }) =>
        p.value
          ? '<span style="color:#16a34a;font-weight:600;">Active</span>'
          : '<span style="color:#dc2626;font-weight:600;">Inactive</span>',
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 110,
    resizable: true,
  };

  onGridReady(event: GridReadyEvent): void {
    event.api.sizeColumnsToFit();
  }
}
