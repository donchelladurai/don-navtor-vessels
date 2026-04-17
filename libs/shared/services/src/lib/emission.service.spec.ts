import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { EmissionService } from './emission.service';
import { VesselEmissions } from '@don-navtor-vessels/shared-models';

const EMISSIONS_URL =
  'https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json';

const mockEmissions: VesselEmissions[] = [
  {
    id: 10001,
    timeSeries: [
      {
        report_from_utc: '2023-01-01T00:00:00Z',
        report_to_utc: '2023-01-02T00:00:00',
        co2_emissions: 94.05,
        sox_emissions: 1.62,
        nox_emissions: 2.8,
        pm_emissions: 0.37097,
        ch4_emissions: 1.51,
      },
      {
        report_from_utc: '2023-01-02T00:00:00Z',
        report_to_utc: '2023-01-03T00:00:00',
        co2_emissions: 78.86,
        sox_emissions: 1.36,
        nox_emissions: 2.35,
        pm_emissions: 0.3109,
        ch4_emissions: 1.266,
      },
    ],
  },
];

describe('EmissionService', () => {
  let service: EmissionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmissionService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(EmissionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch emissions from the correct URL', () => {
    service.getEmissions().subscribe((emissions) => {
      expect(emissions).toEqual(mockEmissions);
      expect(emissions).toHaveLength(1);
    });

    const req = httpMock.expectOne(EMISSIONS_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmissions);
  });

  it('should return data with timeSeries array', () => {
    service.getEmissions().subscribe((emissions) => {
      const first = emissions[0];
      expect(first.id).toBe(10001);
      expect(first.timeSeries).toHaveLength(2);
      expect(first.timeSeries[0].co2_emissions).toBe(94.05);
      expect(first.timeSeries[0].nox_emissions).toBe(2.8);
    });

    const req = httpMock.expectOne(EMISSIONS_URL);
    req.flush(mockEmissions);
  });

  it('should propagate HTTP errors', () => {
    service.getEmissions().subscribe({
      next: () => expect.unreachable('should have failed'),
      error: (err) => {
        expect(err.status).toBe(404);
      },
    });

    const req = httpMock.expectOne(EMISSIONS_URL);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
