import { ReviewsRepo } from '../../infrastructure/repositories/ReviewsRepo';
export async function leaveReview(destinationId: string, rating: number, comment: string) {
  return ReviewsRepo.create(destinationId, { rating, comment });
}
