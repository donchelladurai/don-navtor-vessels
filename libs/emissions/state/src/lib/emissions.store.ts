import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import {
  VesselEmissions,
  EmissionTimeSeries,
  VesselOption,
  Vessel,
} from '@don-navtor-vessels/shared-models';
import {
  EmissionService,
  VesselService,
} from '@don-navtor-vessels/shared-services';

type EmissionsState = {
  emissionData: VesselEmissions[];
  vessels: Vessel[];
  selectedVesselId: number | null;
  loading: boolean;
  error: string | null;
};

export const EmissionsStore = signalStore(

  withState<EmissionsState>({
    emissionData: [],
    vessels: [],
    selectedVesselId: null,
    loading: false,
    error: null,
  }),

  withComputed((store) => ({

    vesselOptions: computed<VesselOption[]>(() => {
      const nameMap = new Map(store.vessels().map((v) => [v.id, v.name]));
      return store.emissionData().map((e) => ({
        id: e.id,
        name: nameMap.get(e.id) ?? `Vessel ${e.id}`,
      }));
    }),

    selectedTimeSeries: computed<EmissionTimeSeries[]>(() => {
      const id = store.selectedVesselId();
      if (id === null) return [];
      return store.emissionData().find((e) => e.id === id)?.timeSeries ?? [];
    }),

    selectedVesselName: computed<string>(() => {
      const id = store.selectedVesselId();
      if (id === null) return '';
      return store.vessels().find((v) => v.id === id)?.name ?? `Vessel ${id}`;
    })

  })),
  withMethods(
    (
      store,
      emissionService = inject(EmissionService),
      vesselService = inject(VesselService),
    ) => ({
      selectVessel(vesselId: number): void {
        patchState(store, { selectedVesselId: vesselId });
      },

      async loadAll(): Promise<void> {

        patchState(store, { loading: true, error: null });
        try {
          const [emissions, vessels] = await Promise.all([
            firstValueFrom(emissionService.getEmissions()),
            firstValueFrom(vesselService.getVessels()),
          ]);

          patchState(store, {
            emissionData: emissions,
            vessels,
            loading: false,
          });

          if (emissions.length > 0) {
            patchState(store, { selectedVesselId: emissions[0].id });
          }
        } catch {
          patchState(store, {
            loading: false,
            error: 'Failed to load emissions data.',
          });
        }
      },
    }),
  ),
);
