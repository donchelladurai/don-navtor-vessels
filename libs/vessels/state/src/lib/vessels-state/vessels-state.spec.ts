import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VesselsState } from './vessels-state';

describe('VesselsState', () => {
  let component: VesselsState;
  let fixture: ComponentFixture<VesselsState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VesselsState],
    }).compileComponents();

    fixture = TestBed.createComponent(VesselsState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
