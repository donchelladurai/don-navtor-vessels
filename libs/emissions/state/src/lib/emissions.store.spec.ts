import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { EmissionsStore } from './emissions.store';
import { EmissionService, VesselService } from '@don-navtor-vessels/shared-services';
import {
  VesselEmissions,
  Vessel,
  VesselType,
} from '@don-navtor-vessels/shared-models';

const mockVessels: Vessel[] = [
  {
    id: 10001, name: 'MS Alpha', mmsi: 999999901, imo: 1023401,
    companyId: 2301, companyName: 'Alpha Company',
    startDate: '1998-01-01T00:00:00Z', active: true, vesselType: VesselType.DryCargo,
  },
  {
    id: 10002, name: 'MS Bravo', mmsi: 999999902, imo: 1023402,
    companyId: 2302, companyName: 'Bravo Company',
    startDate: '1999-02-02T00:00:00Z', active: true, vesselType: VesselType.GeneralCargo,
  },
];

const mockEmissions: VesselEmissions[] = [
  {
    id: 10001,
    timeSeries: [
      {
        report_from_utc: '2023-01-01T00:00:00Z', report_to_utc: '2023-01-02T00:00:00',
        co2_emissions: 94.05, sox_emissions: 1.62, nox_emissions: 2.8,
        pm_emissions: 0.37097, ch4_emissions: 1.51,
      },
      {
        report_from_utc: '2023-01-02T00:00:00Z', report_to_utc: '2023-01-03T00:00:00',
        co2_emissions: 78.86, sox_emissions: 1.36, nox_emissions: 2.35,
        pm_emissions: 0.3109, ch4_emissions: 1.266,
      },
    ],
  },
  {
    id: 10002,
    timeSeries: [
      {
        report_from_utc: '2023-01-01T00:00:00Z', report_to_utc: '2023-01-02T00:00:00',
        co2_emissions: 50.0, sox_emissions: 0.8, nox_emissions: 1.5,
        pm_emissions: 0.2, ch4_emissions: 0.9,
      },
    ],
  },
];

describe('EmissionsStore', () => {
  let store: InstanceType<typeof EmissionsStore>;
  let emissionServiceMock: { getEmissions: ReturnType<typeof vi.fn> };
  let vesselServiceMock: { getVessels: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    emissionServiceMock = {
      getEmissions: vi.fn().mockReturnValue(of(mockEmissions)),
    };
    vesselServiceMock = {
      getVessels: vi.fn().mockReturnValue(of(mockVessels)),
    };

    TestBed.configureTestingModule({
      providers: [
        EmissionsStore,
        { provide: EmissionService, useValue: emissionServiceMock },
        { provide: VesselService, useValue: vesselServiceMock },
      ],
    });

    store = TestBed.inject(EmissionsStore);
  });

  describe('initial state', () => {
    it('should start with no emission data', () => {
      expect(store.emissionData()).toEqual([]);
    });

    it('should start with no selected vessel', () => {
      expect(store.selectedVesselId()).toBeNull();
    });

    it('should start with loading false', () => {
      expect(store.loading()).toBe(false);
    });

    it('should start with no error', () => {
      expect(store.error()).toBeNull();
    });
  });

  describe('loadAll', () => {
    it('should fetch both emissions and vessels in parallel', async () => {
      await store.loadAll();

      expect(emissionServiceMock.getEmissions).toHaveBeenCalledOnce();
      expect(vesselServiceMock.getVessels).toHaveBeenCalledOnce();
    });

    it('should populate emission data', async () => {
      await store.loadAll();

      expect(store.emissionData()).toHaveLength(2);
    });

    it('should auto-select the first vessel', async () => {
      await store.loadAll();

      expect(store.selectedVesselId()).toBe(10001);
    });

    it('should set loading to false after success', async () => {
      await store.loadAll();

      expect(store.loading()).toBe(false);
    });
  });

  describe('computed: vesselOptions', () => {
    it('should return vessel IDs with names from the vessels list', async () => {
      await store.loadAll();

      const options = store.vesselOptions();
      expect(options).toEqual([
        { id: 10001, name: 'MS Alpha' },
        { id: 10002, name: 'MS Bravo' },
      ]);
    });

    it('should fallback to "Vessel {id}" if vessel name not found', async () => {
      vesselServiceMock.getVessels.mockReturnValue(of([]));

      await store.loadAll();

      const options = store.vesselOptions();
      expect(options[0].name).toBe('Vessel 10001');
    });
  });

  describe('computed: selectedTimeSeries', () => {
    it('should return time series for the selected vessel', async () => {
      await store.loadAll();

      const series = store.selectedTimeSeries();
      expect(series).toHaveLength(2);
      expect(series[0].co2_emissions).toBe(94.05);
    });

    it('should return empty array when no vessel is selected', () => {
      expect(store.selectedTimeSeries()).toEqual([]);
    });
  });

  describe('computed: selectedVesselName', () => {
    it('should return the name of the selected vessel', async () => {
      await store.loadAll();

      expect(store.selectedVesselName()).toBe('MS Alpha');
    });

    it('should return empty string when nothing is selected', () => {
      expect(store.selectedVesselName()).toBe('');
    });
  });

  describe('selectVessel', () => {
    it('should change the selected vessel', async () => {
      await store.loadAll();
      expect(store.selectedVesselId()).toBe(10001);

      store.selectVessel(10002);
      expect(store.selectedVesselId()).toBe(10002);
    });

    it('should update selectedTimeSeries when vessel changes', async () => {
      await store.loadAll();

      store.selectVessel(10002);

      const series = store.selectedTimeSeries();
      expect(series).toHaveLength(1);
      expect(series[0].co2_emissions).toBe(50.0);
    });

    it('should update selectedVesselName when vessel changes', async () => {
      await store.loadAll();

      store.selectVessel(10002);

      expect(store.selectedVesselName()).toBe('MS Bravo');
    });
  });

  describe('error handling', () => {
    it('should set error on failure', async () => {
      emissionServiceMock.getEmissions.mockReturnValue(
        throwError(() => new Error('fail'))
      );

      await store.loadAll();

      expect(store.error()).toBe('Failed to load emissions data.');
      expect(store.loading()).toBe(false);
    });

    it('should not change selectedVesselId on failure', async () => {
      emissionServiceMock.getEmissions.mockReturnValue(
        throwError(() => new Error('fail'))
      );

      await store.loadAll();

      expect(store.selectedVesselId()).toBeNull();
    });
  });
});
