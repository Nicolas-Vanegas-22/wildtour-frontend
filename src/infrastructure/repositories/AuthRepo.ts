import { api } from '../http/apiClient';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../../domain/dtos/auth';


export const AuthRepo = {
  async login(payload: LoginRequest) { const { data } = await api.post<LoginResponse>('/auth/login', payload); return data },
  async register(payload: RegisterRequest) { const { data } = await api.post('/auth/register', payload); return data },
  async forgotPassword(payload: forgotPasswordRequest) { const { data } = await api.post('/auth/forgotPassword', payload); return data },
  async me() { const { data } = await api.get('/users/me'); return data },  



  resetPassword: (token: string, password: string) =>
    axios.post(`${API}/reset-password`, { token, password }).then(r => r.data),
};
