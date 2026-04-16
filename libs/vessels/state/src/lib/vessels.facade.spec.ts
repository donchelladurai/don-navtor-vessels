import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VesselsFacade } from './vessels.facade';
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
];

describe('VesselsFacade', () => {
  let facade: VesselsFacade;
  let vesselServiceMock: { getVessels: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vesselServiceMock = {
      getVessels: vi.fn().mockReturnValue(of(mockVessels)),
    };

    TestBed.configureTestingModule({
      providers: [
        VesselsStore,
        VesselsFacade,
        { provide: VesselService, useValue: vesselServiceMock },
      ],
    });

    facade = TestBed.inject(VesselsFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should expose loading signal', () => {
    expect(facade.loading()).toBe(false);
  });

  it('should expose error signal', () => {
    expect(facade.error()).toBeNull();
  });

  it('should expose empty vessels before loading', () => {
    expect(facade.vessels()).toEqual([]);
    expect(facade.vesselCount()).toBe(0);
  });

  it('should populate vessels after reload', async () => {
    facade.reload();

    // Wait for async to settle
    await vi.waitFor(() => {
      expect(facade.vessels()).toHaveLength(1);
    });

    expect(facade.vessels()[0].name).toBe('MS Alpha');
    expect(facade.vesselCount()).toBe(1);
  });

  it('should delegate reload to the store', () => {
    facade.reload();

    expect(vesselServiceMock.getVessels).toHaveBeenCalled();
  });
});
