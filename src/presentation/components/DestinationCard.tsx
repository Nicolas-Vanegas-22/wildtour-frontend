import { Link } from 'react-router-dom';

export default function DestinationCard({ destination }: { destination: any }) {
  return (
    <Link to={`/destinos/${destination.id}`} className="block rounded-2xl overflow-hidden border hover:shadow-lg focus:outline-none focus:ring">
      <img src={destination.imageUrl} alt={destination.name} className="w-full aspect-video object-cover" />
      <div className="p-4 space-y-1">
        <h3 className="font-semibold">{destination.name}</h3>
        <p className="text-sm opacity-70 line-clamp-2">{destination.description}</p>
        <div className="text-sm opacity-80">Desde ${destination.priceFrom ?? 0}</div>
      </div>
    </Link>
  );
}
