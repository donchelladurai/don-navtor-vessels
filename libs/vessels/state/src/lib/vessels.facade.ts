import { Injectable, inject } from '@angular/core';
import { VesselsStore } from './vessels.store';

@Injectable()
export class VesselsFacade {
  private readonly store = inject(VesselsStore);

  readonly vessels = this.store.entities;
  readonly vesselCount = this.store.vesselCount;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  reload(): void {
    this.store.loadVessels();
  }
}
