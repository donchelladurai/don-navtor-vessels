import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { VesselsPage } from './vessels-page';
import { VesselsFacade } from '@don-navtor-vessels/vessels-state';
import { VesselType } from '@don-navtor-vessels/shared-models';

const mockVessels = [
  {
    id: 10001, name: 'MS Alpha', mmsi: 999999901, imo: 1023401,
    companyId: 2301, companyName: 'Alpha Company',
    startDate: '1998-01-01T00:00:00Z', active: true,
    vesselType: VesselType.DryCargo,
  },
];

describe('VesselsPage', () => {
  let component: VesselsPage;
  let fixture: ComponentFixture<VesselsPage>;
  let facadeMock: {
    vessels: ReturnType<typeof signal>;
    vesselCount: ReturnType<typeof signal>;
    loading: ReturnType<typeof signal>;
    error: ReturnType<typeof signal>;
    reload: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    facadeMock = {
      vessels: signal(mockVessels),
      vesselCount: signal(1),
      loading: signal(false),
      error: signal(null),
      reload: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [VesselsPage],
      providers: [
        { provide: VesselsFacade, useValue: facadeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VesselsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call facade.reload on construction', () => {
    expect(facadeMock.reload).toHaveBeenCalledOnce();
  });

  it('should display vessel count', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('1 vessels');
  });

  it('should show loading spinner when loading', () => {
    facadeMock.loading.set(true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const spinner = el.querySelector('p-progressSpinner');
    expect(spinner).toBeTruthy();
  });

  it('should show error when error exists', () => {
    facadeMock.error.set('Something went wrong');
    facadeMock.vessels.set([]);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Something went wrong');
  });

  it('should have correct column definitions', () => {
    expect(component.columnDefs).toHaveLength(7);
    expect(component.columnDefs[0].field).toBe('name');
    expect(component.columnDefs[1].field).toBe('vesselType');
    expect(component.columnDefs[6].field).toBe('active');
  });

  it('should have default column definition with flex', () => {
    expect(component.defaultColDef.flex).toBe(1);
    expect(component.defaultColDef.resizable).toBe(true);
  });
});
