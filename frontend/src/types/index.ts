export type DateValue = string | Date;

export interface Channel {
  id: number;
  name: string;
  capacity: number;
  status: string;
  batches?: Batch[];
}

export interface Batch {
  id: number;
  cropType: string;
  plantedDate: DateValue;
  expectedHarvestDate: DateValue;
  status: string;
  channelId: number;
  channel?: Channel;
  readings?: Reading[];
  harvests?: Harvest[];
}

export interface Reading {
  id: number;
  date: DateValue;
  pH: number;
  ec: number;
  waterTemp: number;
  notes?: string;
  batchId: number;
  batch?: Batch;
}

export interface Harvest {
  id: number;
  harvestDate: DateValue;
  yieldKg: number;
  notes?: string;
  batchId: number;
  batch?: Batch;
}

export interface BatchInput {
  cropType?: string;
  plantedDate?: DateValue;
  expectedHarvestDate?: DateValue;
  status?: string;
  channelId?: number;
}

export interface ReadingInput {
  batchId: number;
  date?: DateValue;
  pH?: number;
  ec?: number;
  waterTemp?: number;
  notes?: string;
}

export interface HarvestInput {
  batchId: number;
  harvestDate?: DateValue;
  yieldKg?: number;
  notes?: string;
}
