import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VesselEmissions } from '@don-navtor-vessels/shared-models';

@Injectable({ providedIn: 'root' })
export class EmissionService {
  private readonly http = inject(HttpClient);
  private readonly url =
    'https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json';

  getEmissions() {
    return this.http.get<VesselEmissions[]>(this.url);
  }
}
