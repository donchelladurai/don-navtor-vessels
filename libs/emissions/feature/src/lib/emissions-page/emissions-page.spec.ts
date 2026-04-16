import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmissionsPage } from './emissions-page';

describe('EmissionsPage', () => {
  let component: EmissionsPage;
  let fixture: ComponentFixture<EmissionsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EmissionsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
