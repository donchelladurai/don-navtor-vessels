import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { VesselsStore } from './vessels.store';
import { VesselService } from '@don-navtor-vessels/shared-services';
import { Vessel, VesselType } from '@don-navtor-vessels/shared-models';

const mockVessels: Vessel[] = [
  {
    id: 10001,
    name: 'MS Alpha',
    mmsi: 999999901,
    imo: 1023401,
    companyId: 2301,
    companyName: 'Alpha Company',
    startDate: '1998-01-01T00:00:00Z',
    active: true,
    vesselType: VesselType.DryCargo,
  },
  {
    id: 10002,
    name: 'MS Bravo',
    mmsi: 999999902,
    imo: 1023402,
    companyId: 2302,
    companyName: 'Bravo Company',
    startDate: '1999-02-02T00:00:00Z',
    active: false,
    vesselType: VesselType.GeneralCargo,
  },
  {
    id: 10003,
    name: 'MS Charlie',
    mmsi: 999999903,
    imo: 1023403,
    companyId: 2303,
    companyName: 'Charlie Company',
    startDate: '2000-03-03T00:00:00Z',
    active: true,
    vesselType: VesselType.BulkCarrier,
  },
];

describe('VesselsStore', () => {
  let store: InstanceType<typeof VesselsStore>;
  let vesselServiceMock: { getVessels: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vesselServiceMock = {
      getVessels: vi.fn().mockReturnValue(of(mockVessels)),
    };

    TestBed.configureTestingModule({
      providers: [
        VesselsStore,
        { provide: VesselService, useValue: vesselServiceMock },
      ],
    });

    store = TestBed.inject(VesselsStore);
  });

  describe('initial state', () => {
    it('should start with empty entities', () => {
      expect(store.entities()).toEqual([]);
    });

    it('should start with loading false', () => {
      expect(store.loading()).toBe(false);
    });

    it('should start with no error', () => {
      expect(store.error()).toBeNull();
    });

    it('should start with vessel count of 0', () => {
      expect(store.vesselCount()).toBe(0);
    });
  });

  describe('loadVessels', () => {
    it('should populate entities after loading', async () => {
      await store.loadVessels();

      expect(store.entities()).toEqual(mockVessels);
      expect(store.entities()).toHaveLength(3);
    });

    it('should set loading to false after success', async () => {
      await store.loadVessels();

      expect(store.loading()).toBe(false);
    });

    it('should update vessel count after loading', async () => {
      await store.loadVessels();

      expect(store.vesselCount()).toBe(3);
    });

    it('should call VesselService.getVessels', async () => {
      await store.loadVessels();

      expect(vesselServiceMock.getVessels).toHaveBeenCalledOnce();
    });

    it('should clear previous error on successful load', async () => {
      // First: force an error
      vesselServiceMock.getVessels.mockReturnValueOnce(
        throwError(() => new Error('fail'))
      );
      await store.loadVessels();
      expect(store.error()).toBeTruthy();

      // Second: succeed
      vesselServiceMock.getVessels.mockReturnValueOnce(of(mockVessels));
      await store.loadVessels();
      expect(store.error()).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should set error message on failure', async () => {
      vesselServiceMock.getVessels.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      await store.loadVessels();

      expect(store.error()).toBe('Failed to load vessels.');
      expect(store.loading()).toBe(false);
    });

    it('should keep entities empty on failure', async () => {
      vesselServiceMock.getVessels.mockReturnValue(
        throwError(() => new Error('fail'))
      );

      await store.loadVessels();

      expect(store.entities()).toEqual([]);
      expect(store.vesselCount()).toBe(0);
    });
  });
});
