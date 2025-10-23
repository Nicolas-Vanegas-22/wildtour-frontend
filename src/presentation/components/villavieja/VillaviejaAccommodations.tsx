import React from 'react';
import { Bed, Star, MapPin, Wifi, Coffee, ParkingCircle } from 'lucide-react';

const VillaviejaAccommodations: React.FC = () => {
  const accommodations = [
    {
      id: 1,
      name: 'Hotel Bethel',
      type: 'Hotel',
      rating: 4.5,
      reviews: 120,
      price: 'Desde $120.000',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      amenities: ['WiFi', 'Piscina', 'Restaurante', 'Parqueadero'],
      location: 'Centro de Villavieja'
    },
    {
      id: 2,
      name: 'Glamping Tatacoa',
      type: 'Glamping',
      rating: 4.8,
      reviews: 85,
      price: 'Desde $200.000',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop',
      amenities: ['Vista al desierto', 'Baño privado', 'Desayuno'],
      location: 'Sector Los Hoyos'
    },
    {
      id: 3,
      name: 'Hostal El Desierto',
      type: 'Hostal',
      rating: 4.2,
      reviews: 95,
      price: 'Desde $50.000',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
      amenities: ['WiFi', 'Cocina compartida', 'Tours'],
      location: 'Centro de Villavieja'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations.map((accommodation) => (
          <div
            key={accommodation.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={accommodation.image}
                alt={accommodation.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-700">
                {accommodation.type}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {accommodation.name}
              </h3>

              <div className="flex items-center space-x-1 mb-3">
                <Star className="w-4 h-4 fill-warning-500 text-warning-500" />
                <span className="font-semibold text-neutral-700">{accommodation.rating}</span>
                <span className="text-sm text-neutral-500">({accommodation.reviews} reseñas)</span>
              </div>

              <div className="flex items-center text-sm text-neutral-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {accommodation.location}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {accommodation.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <div>
                  <p className="text-2xl font-bold text-primary-700">{accommodation.price}</p>
                  <p className="text-xs text-neutral-500">por noche</p>
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Ver más
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VillaviejaAccommodations;
