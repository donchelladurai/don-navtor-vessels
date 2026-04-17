import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { Layout } from './layout';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Layout,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render sidebar with NAVTOR brand', () => {
    const el: HTMLElement = fixture.nativeElement;
    const brand = el.querySelector('.brand');
    expect(brand?.textContent).toContain('NAVTOR');
  });

  it('should render Vessels navigation link', () => {
    const el: HTMLElement = fixture.nativeElement;
    const links = el.querySelectorAll('nav a');
    const vesselLink = Array.from(links).find((a) =>
      a.textContent?.includes('Vessels')
    );
    expect(vesselLink).toBeTruthy();
    expect(vesselLink?.getAttribute('href')).toBe('/vessels');
  });

  it('should render Emissions navigation link', () => {
    const el: HTMLElement = fixture.nativeElement;
    const links = el.querySelectorAll('nav a');
    const emissionsLink = Array.from(links).find((a) =>
      a.textContent?.includes('Emissions')
    );
    expect(emissionsLink).toBeTruthy();
    expect(emissionsLink?.getAttribute('href')).toBe('/emissions');
  });

  it('should have exactly 2 navigation links', () => {
    const el: HTMLElement = fixture.nativeElement;
    const links = el.querySelectorAll('nav a');
    expect(links).toHaveLength(2);
  });

  it('should render a router-outlet', () => {
    const el: HTMLElement = fixture.nativeElement;
    const outlet = el.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  it('should render submission info footer', () => {
    const el: HTMLElement = fixture.nativeElement;
    const author = el.querySelector('.submission-info .author');
    expect(author?.textContent).toContain('Don Chelladurai');
  });

  it('should render GitHub repo link', () => {
    const el: HTMLElement = fixture.nativeElement;
    const link = el.querySelector('.repo-link') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.href).toContain('github.com/donchelladurai/don-navtor-vessels');
    expect(link.target).toBe('_blank');
  });
});
