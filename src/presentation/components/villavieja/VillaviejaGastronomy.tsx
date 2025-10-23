import React from 'react';
import { UtensilsCrossed, Star, MapPin, Clock } from 'lucide-react';

const VillaviejaGastronomy: React.FC = () => {
  const restaurants = [
    {
      id: 1,
      name: 'Restaurante El Solar',
      cuisine: 'Comida Típica',
      rating: 4.6,
      reviews: 150,
      price: '$$',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      specialties: ['Cabrito al horno', 'Mojarra frita', 'Tamal huilense'],
      hours: '8:00 AM - 8:00 PM'
    },
    {
      id: 2,
      name: 'Pizzería La Tatacoa',
      cuisine: 'Italiana',
      rating: 4.3,
      reviews: 80,
      price: '$$',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      specialties: ['Pizza artesanal', 'Pasta', 'Lasagna'],
      hours: '12:00 PM - 10:00 PM'
    },
    {
      id: 3,
      name: 'Cafetería del Desierto',
      cuisine: 'Café y Postres',
      rating: 4.7,
      reviews: 95,
      price: '$',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
      specialties: ['Café orgánico', 'Postres caseros', 'Jugos naturales'],
      hours: '7:00 AM - 7:00 PM'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-accent-700">
                {restaurant.cuisine}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {restaurant.name}
              </h3>

              <div className="flex items-center space-x-1 mb-3">
                <Star className="w-4 h-4 fill-warning-500 text-warning-500" />
                <span className="font-semibold text-neutral-700">{restaurant.rating}</span>
                <span className="text-sm text-neutral-500">({restaurant.reviews} reseñas)</span>
                <span className="ml-auto text-lg font-bold text-primary-700">{restaurant.price}</span>
              </div>

              <div className="flex items-center text-sm text-neutral-600 mb-4">
                <Clock className="w-4 h-4 mr-1" />
                {restaurant.hours}
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-neutral-700 mb-2">Especialidades:</p>
                <div className="flex flex-wrap gap-2">
                  {restaurant.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent-50 text-accent-700 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors">
                Ver menú
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VillaviejaGastronomy;
