import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { Vessel } from '@don-navtor-vessels/shared-models';
import { VesselService } from '@don-navtor-vessels/shared-services';

type VesselsState = {
  loading: boolean;
  error: string | null;
};

export const VesselsStore = signalStore(

  withState<VesselsState>({ loading: false, error: null }),

  withEntities<Vessel>(),

  withComputed((store) => ({
    vesselCount: computed(() => store.entities().length),
  })),

  withMethods((store, vesselService = inject(VesselService)) => ({

    async loadVessels() {
      patchState(store, { loading: true, error: null });
      try {
        const vessels = await firstValueFrom(vesselService.getVessels());
        patchState(store, setAllEntities(vessels), { loading: false });
      } catch {
        patchState(store, {
          loading: false,
          error: 'Failed to load vessels.',
        });
      }
    }

  })),
);
