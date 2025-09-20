import { ReservationsRepo } from '../../infrastructure/repositories/ReservationsRepo';
export async function createReservation(payload: { itemType: string; itemId: string; date: string; people: number }) {
  return ReservationsRepo.create(payload);
}
