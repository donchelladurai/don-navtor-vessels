import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmissionsState } from './emissions-state';

describe('EmissionsState', () => {
  let component: EmissionsState;
  let fixture: ComponentFixture<EmissionsState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionsState],
    }).compileComponents();

    fixture = TestBed.createComponent(EmissionsState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
