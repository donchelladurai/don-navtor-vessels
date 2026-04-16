import { Routes } from '@angular/router';
import { Layout } from '@don-navtor-vessels/shared-ui';
import {
  VesselsStore,
  VesselsFacade,
} from '@don-navtor-vessels/vessels-state';
import {
  EmissionsStore,
  EmissionsFacade,
} from '@don-navtor-vessels/emissions-state';

export const appRoutes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'vessels',
        providers: [VesselsStore, VesselsFacade],
        loadComponent: () =>
          import('@don-navtor-vessels/feature-vessels').then(
            (m) => m.VesselsPage,
          ),
        title: 'Vessels — NAVTOR',
      },
      {
        path: 'emissions',
        providers: [EmissionsStore, EmissionsFacade],
        loadComponent: () =>
          import('@don-navtor-vessels/feature-emissions').then(
            (m) => m.EmissionsPage,
          ),
        title: 'Emissions — NAVTOR',
      },
      { path: '', redirectTo: 'vessels', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
