import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { EmissionsPage } from './emissions-page';
import { EmissionsFacade } from '@don-navtor-vessels/emissions-state';
import { provideHighcharts } from 'highcharts-angular';

describe('EmissionsPage', () => {
  let component: EmissionsPage;
  let fixture: ComponentFixture<EmissionsPage>;
  let facadeMock: {
    vesselOptions: ReturnType<typeof signal>;
    selectedVesselId: ReturnType<typeof signal>;
    selectedVesselName: ReturnType<typeof signal>;
    selectedTimeSeries: ReturnType<typeof signal>;
    loading: ReturnType<typeof signal>;
    error: ReturnType<typeof signal>;
    selectVessel: ReturnType<typeof vi.fn>;
    reload: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionsPage],
      providers: [
        { provide: EmissionsFacade, useValue: facadeMock },
        provideHighcharts(),
      ],
    }).compileComponents();

    facadeMock = {
      vesselOptions: signal([
        { id: 10001, name: 'MS Alpha' },
        { id: 10002, name: 'MS Bravo' },
      ]),
      selectedVesselId: signal(10001),
      selectedVesselName: signal('MS Alpha'),
      selectedTimeSeries: signal([
        {
          report_from_utc: '2023-01-01T00:00:00Z',
          report_to_utc: '2023-01-02T00:00:00',
          co2_emissions: 94.05, sox_emissions: 1.62,
          nox_emissions: 2.8, pm_emissions: 0.37,
          ch4_emissions: 1.51,
        },
      ]),
      loading: signal(false),
      error: signal(null),
      selectVessel: vi.fn(),
      reload: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EmissionsPage],
      providers: [
        { provide: EmissionsFacade, useValue: facadeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmissionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call facade.reload on construction', () => {
    expect(facadeMock.reload).toHaveBeenCalledOnce();
  });

  it('should display page title', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Vessel Emissions');
  });

  it('should show spinner when loading', () => {
    facadeMock.loading.set(true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const spinner = el.querySelector('p-progressSpinner');
    expect(spinner).toBeTruthy();
  });

  it('should show error message on error', () => {
    facadeMock.error.set('Network failure');
    facadeMock.selectedTimeSeries.set([]);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Network failure');
  });

  it('should generate chart options with correct title', () => {
    const options = component.chartOptions();
    expect(options.title?.text).toContain('MS Alpha');
  });

  it('should generate chart with two series (CO₂ and NOₓ)', () => {
    const options = component.chartOptions();
    const series = options.series as Highcharts.SeriesOptionsType[];
    expect(series).toHaveLength(2);
    expect(series[0].name).toBe('CO₂');
    expect(series[1].name).toBe('NOₓ');
  });

  it('should map CO₂ data correctly', () => {
    const options = component.chartOptions();
    const co2Series = options.series![0] as Highcharts.SeriesLineOptions;
    expect(co2Series.data).toEqual([94.05]);
  });

  it('should map NOₓ data correctly', () => {
    const options = component.chartOptions();
    const noxSeries = options.series![1] as Highcharts.SeriesLineOptions;
    expect(noxSeries.data).toEqual([2.8]);
  });

  it('should use dual Y-axes', () => {
    const options = component.chartOptions();
    const yAxes = options.yAxis as Highcharts.YAxisOptions[];
    expect(yAxes).toHaveLength(2);
  });

  it('should have credits disabled', () => {
    const options = component.chartOptions();
    expect(options.credits?.enabled).toBe(false);
  });
});
