import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EmissionsFacade } from './emissions.facade';
import { EmissionsStore } from './emissions.store';
import { EmissionService, VesselService } from '@don-navtor-vessels/shared-services';
import { VesselType } from '@don-navtor-vessels/shared-models';

describe('EmissionsFacade', () => {
  let facade: EmissionsFacade;
  let emissionServiceMock: { getEmissions: ReturnType<typeof vi.fn> };
  let vesselServiceMock: { getVessels: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    emissionServiceMock = {
      getEmissions: vi.fn().mockReturnValue(of([
        {
          id: 10001,
          timeSeries: [{
            report_from_utc: '2023-01-01T00:00:00Z',
            report_to_utc: '2023-01-02T00:00:00',
            co2_emissions: 94.05, sox_emissions: 1.62,
            nox_emissions: 2.8, pm_emissions: 0.37,
            ch4_emissions: 1.51,
          }],
        },
      ])),
    };
    vesselServiceMock = {
      getVessels: vi.fn().mockReturnValue(of([
        {
          id: 10001, name: 'MS Alpha', mmsi: 999999901, imo: 1023401,
          companyId: 2301, companyName: 'Alpha Company',
          startDate: '1998-01-01T00:00:00Z', active: true,
          vesselType: VesselType.DryCargo,
        },
      ])),
    };

    TestBed.configureTestingModule({
      providers: [
        EmissionsStore,
        EmissionsFacade,
        { provide: EmissionService, useValue: emissionServiceMock },
        { provide: VesselService, useValue: vesselServiceMock },
      ],
    });

    facade = TestBed.inject(EmissionsFacade);
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

  it('should populate data after reload', async () => {
    facade.reload();

    await vi.waitFor(() => {
      expect(facade.vesselOptions()).toHaveLength(1);
    });

    expect(facade.vesselOptions()[0].name).toBe('MS Alpha');
    expect(facade.selectedVesselId()).toBe(10001);
    expect(facade.selectedVesselName()).toBe('MS Alpha');
    expect(facade.selectedTimeSeries()).toHaveLength(1);
  });

  it('should delegate selectVessel to store', async () => {
    facade.reload();
    await vi.waitFor(() => {
      expect(facade.selectedVesselId()).toBe(10001);
    });

    // selectVessel doesn't fail even with an ID not in the data
    facade.selectVessel(99999);
    expect(facade.selectedVesselId()).toBe(99999);
  });

  it('should delegate reload to store', () => {
    facade.reload();

    expect(emissionServiceMock.getEmissions).toHaveBeenCalled();
    expect(vesselServiceMock.getVessels).toHaveBeenCalled();
  });
});
