import { api } from '../http/apiClient';
export const ReviewsRepo = {
  async create(destinationId: string, payload: { rating: number; comment: string }) {
    const { data } = await api.post(`/destinations/${destinationId}/reviews`, payload); return data;
  },
};
