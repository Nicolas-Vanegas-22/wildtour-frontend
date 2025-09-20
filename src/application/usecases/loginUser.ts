import { AuthRepo } from '../../infrastructure/repositories/AuthRepo';
export async function loginUser(email: string, password: string) {
  return AuthRepo.login({ email, password });
}
