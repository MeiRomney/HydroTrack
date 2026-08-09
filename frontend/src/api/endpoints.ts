import { api } from './client';
import type { Channel, Batch, Reading, Harvest } from '../types';

// ---------- Channels ----------
export const getChannels = () => api.get<Channel[]>('/channels').then(r => r.data);
export const getChannel = (id: number) => api.get<Channel>(`/channels/${id}`).then(r => r.data);
export const createChannel = (data: Partial<Channel>) => api.post<Channel>('/channels', data).then(r => r.data);
export const updateChannel = (id: number, data: Partial<Channel>) => api.put<Channel>(`/channels/${id}`, data).then(r => r.data);
export const deleteChannel = (id: number) => api.delete(`/channels/${id}`);

// ---------- Batches ----------
export const getBatches = () => api.get<Batch[]>('/batches').then(r => r.data);
export const getBatch = (id: number) => api.get<Batch>(`/batches/${id}`).then(r => r.data);
export const createBatch = (data: Partial<Batch>) => api.post<Batch>('/batches', data).then(r => r.data);
export const updateBatch = (id: number, data: Partial<Batch>) => api.put<Batch>(`/batches/${id}`, data).then(r => r.data);
export const deleteBatch = (id: number) => api.delete(`/batches/${id}`);

// ---------- Readings ----------
export const getReadings = (batchId?: number) =>
  api.get<Reading[]>('/readings', { params: batchId ? { batchId } : {} }).then(r => r.data);
export const createReading = (data: Partial<Reading>) => api.post<Reading>('/readings', data).then(r => r.data);
export const deleteReading = (id: number) => api.delete(`/readings/${id}`);

// ---------- Harvests ----------
export const getHarvests = (batchId?: number) =>
  api.get<Harvest[]>('/harvests', { params: batchId ? { batchId } : {} }).then(r => r.data);
export const createHarvest = (data: Partial<Harvest>) => api.post<Harvest>('/harvests', data).then(r => r.data);
export const deleteHarvest = (id: number) => api.delete(`/harvests/${id}`);