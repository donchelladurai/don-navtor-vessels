import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VesselsPage } from './vessels-page';

describe('VesselsPage', () => {
  let component: VesselsPage;
  let fixture: ComponentFixture<VesselsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VesselsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(VesselsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
