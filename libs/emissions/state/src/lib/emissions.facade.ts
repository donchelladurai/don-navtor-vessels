import { Injectable, inject } from '@angular/core';
import { EmissionsStore } from './emissions.store';

@Injectable()
export class EmissionsFacade {
  private readonly store = inject(EmissionsStore);

  readonly vesselOptions = this.store.vesselOptions;
  readonly selectedVesselId = this.store.selectedVesselId;
  readonly selectedVesselName = this.store.selectedVesselName;
  readonly selectedTimeSeries = this.store.selectedTimeSeries;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  selectVessel(vesselId: number): void {
    this.store.selectVessel(vesselId);
  }

  reload(): void {
    this.store.loadAll();
  }
}
