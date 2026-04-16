import { VesselType } from '../enums/vessel-type.enum';

export interface Vessel {
  id: number;
  name: string;
  mmsi: number;
  imo: number;
  companyId: number;
  companyName: string;
  startDate: string;
  active: boolean;
  vesselType: VesselType;
}
