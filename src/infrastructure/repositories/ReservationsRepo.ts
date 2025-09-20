import { api } from '../http/apiClient';

export const ReservationsRepo = {
  async create(payload: { itemType: string; itemId: string; date: string; people: number }) {
    const { data } = await api.post('/reservations', payload); return data;
  },
  async mine() { const { data } = await api.get('/reservations/my'); return data },
  async cancel(id: string) { const { data } = await api.delete(`/reservations/${id}`); return data }
};
