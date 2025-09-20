import { api } from '../http/apiClient';
export const AdminRepo = {
  async reports(params: { from?: string; to?: string }) { const { data } = await api.get('/admin/reports', { params }); return data }
};
