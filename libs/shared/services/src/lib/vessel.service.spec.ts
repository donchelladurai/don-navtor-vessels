import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { VesselService } from './vessel.service';
import { Vessel } from '@don-navtor-vessels/shared-models';
import { VesselType } from '@don-navtor-vessels/shared-models';

const VESSELS_URL =
  'https://frontendteamfiles.blob.core.windows.net/exercises/vessels.json';

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
    active: true,
    vesselType: VesselType.GeneralCargo,
  },
];

describe('VesselService', () => {
  let service: VesselService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VesselService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(VesselService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch vessels from the correct URL', () => {
    service.getVessels().subscribe((vessels) => {
      expect(vessels).toEqual(mockVessels);
      expect(vessels).toHaveLength(2);
    });

    const req = httpMock.expectOne(VESSELS_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockVessels);
  });

  it('should return typed Vessel array', () => {
    service.getVessels().subscribe((vessels) => {
      const first = vessels[0];
      expect(first.id).toBe(10001);
      expect(first.name).toBe('MS Alpha');
      expect(first.vesselType).toBe(VesselType.DryCargo);
      expect(first.active).toBe(true);
    });

    const req = httpMock.expectOne(VESSELS_URL);
    req.flush(mockVessels);
  });

  it('should propagate HTTP errors', () => {
    service.getVessels().subscribe({
      next: () => expect.unreachable('should have failed'),
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(VESSELS_URL);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
