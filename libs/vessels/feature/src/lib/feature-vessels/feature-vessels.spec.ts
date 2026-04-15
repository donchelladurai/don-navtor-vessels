import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureVessels } from './feature-vessels';

describe('FeatureVessels', () => {
  let component: FeatureVessels;
  let fixture: ComponentFixture<FeatureVessels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureVessels],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureVessels);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
