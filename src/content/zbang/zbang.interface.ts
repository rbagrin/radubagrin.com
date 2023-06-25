export interface PriceModelI {
  level1: number; // 15 min
  level2: number; // 30 min
  level3: number; // 1h
  level4: number; // 2h
  extraPerMinute: number;
}

export interface ModelI {
  id: number;
  name: string;
  priceModel: PriceModelI;
}

export interface EntryI {
  id: number;
  modelId: number;
  start: Date | null;
  finish: Date | null;
  fullName: string;
  phoneNo: string;
  consent: boolean | null;
}
