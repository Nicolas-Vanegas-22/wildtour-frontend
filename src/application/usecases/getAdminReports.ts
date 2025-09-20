import { AdminRepo } from '../../infrastructure/repositories/AdminRepo';
export async function getAdminReports(params: { from?: string; to?: string }) {
  return AdminRepo.reports(params);
}
