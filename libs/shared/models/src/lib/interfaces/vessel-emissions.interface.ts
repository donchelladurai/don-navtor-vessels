import { EmissionTimeSeries } from './emission-time-series.interface';

export interface VesselEmissions {
  id: number;
  timeSeries: EmissionTimeSeries[];
}
