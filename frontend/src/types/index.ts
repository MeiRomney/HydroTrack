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
  plantedDate: string;
  expectedHarvestDate: string;
  status: string;
  channelId: number;
  channel?: Channel;
  readings?: Reading[];
  harvests?: Harvest[];
}

export interface Reading {
  id: number;
  date: string;
  pH: number;
  ec: number;
  waterTemp: number;
  notes?: string;
  batchId: number;
  batch?: Batch;
}

export interface Harvest {
  id: number;
  harvestDate: string;
  yieldKg: number;
  notes?: string;
  batchId: number;
  batch?: Batch;
}
