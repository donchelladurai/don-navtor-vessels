import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureEmissions } from './feature-emissions';

describe('FeatureEmissions', () => {
  let component: FeatureEmissions;
  let fixture: ComponentFixture<FeatureEmissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureEmissions],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureEmissions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
