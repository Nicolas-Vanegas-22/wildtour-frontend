import { DestinationsRepo, SearchParams } from '../../infrastructure/repositories/DestinationsRepo';
export async function searchActivities(params: SearchParams) { return DestinationsRepo.search(params); }
