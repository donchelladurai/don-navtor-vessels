# DON CHELLADURAI - NAVTOR — Interview Exercise Submission

This is my submission for the NAVTOR interview exercise. It's an Angular 21 app that displays vessel fleet data and emission charts, built using an Nx monorepo.

**Live demo (I've hosted it on Azure as a static web app):** [https://proud-sea-019e0c103.2.azurestaticapps.net](https://proud-sea-019e0c103.2.azurestaticapps.net)

---

## What's Inside

### Two pages

- **Vessels** — AG Grid table showing 26 vessels with sorting, filtering, and pagination
- **Emissions** — Highcharts line chart displaying CO₂ and NOₓ emissions over time, with a PrimeNG dropdown to switch between vessels

### Architecture

I've tried to make this modular and used Domain Driven Vertical Slices. It's structured as an **Nx monorepo** with 7 libraries organised by domain and responsibility:

| Library | What it does |
|---------|-------------|
| `shared-models` | TypeScript interfaces and enums (VesselType enum, Vessel, EmissionTimeSeries, etc.) |
| `shared-services` | HTTP services for fetching vessel and emission data |
| `shared-ui` | Layout shell with sidebar navigation |
| `vessels-state` | NgRx Signal Store + Facade for vessel state management |
| `vessels-feature` | Vessels page component (AG Grid integration) |
| `emissions-state` | NgRx Signal Store + Facade for emission state management |
| `emissions-feature` | Emissions page component (Highcharts + PrimeNG Select) |

The app shell (`vessel-app`) is intentionally thin — it just wires up routing and providers. All actual logic lives in the libraries.

### Tech stack

| Library | Version |
|---------|---------|
| Angular | 21.2.x |
| Nx | 22.6.x |
| NgRx Signals | 21.x |
| AG Grid | 35.x |
| Highcharts | 12.x |
| PrimeNG | 21.x |
| TypeScript | 5.8+ |

---

## Setup & Run

### Prerequisites

- Node.js 20+ (`node -v` to check)
- npm 10+ (`npm -v` to check)

### Install and serve

```bash
git clone https://github.com/donchelladurai/don-navtor-vessels.git
cd don-navtor-vessels
npm install
npx nx serve vessel-app
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

---

Built for the purposes of an interview with by **Don Chelladurai**
