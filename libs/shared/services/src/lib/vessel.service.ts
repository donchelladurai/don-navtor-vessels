import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vessel } from '@don-navtor-vessels/shared-models';

@Injectable({ providedIn: 'root' })
export class VesselService {
  private readonly http = inject(HttpClient);
  private readonly url =
    'https://frontendteamfiles.blob.core.windows.net/exercises/vessels.json';

  getVessels() {
    return this.http.get<Vessel[]>(this.url);
  }
}
