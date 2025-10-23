import React from 'react';
import { Car, Users, Camera, Compass, Star, Phone } from 'lucide-react';

const VillaviejaServices: React.FC = () => {
  const services = [
    {
      id: 1,
      name: 'Tours Tatacoa',
      category: 'Guías Turísticos',
      icon: <Compass className="w-8 h-8" />,
      rating: 4.9,
      reviews: 200,
      price: 'Desde $80.000',
      description: 'Tours guiados por el desierto con guías expertos locales',
      services: ['Tour día completo', 'Tour astronómico', 'Tour fotográfico'],
      contact: '+57 300 123 4567',
      color: 'primary'
    },
    {
      id: 2,
      name: 'Transporte Villavieja',
      category: 'Transporte',
      icon: <Car className="w-8 h-8" />,
      rating: 4.5,
      reviews: 150,
      price: 'Desde $50.000',
      description: 'Servicio de transporte desde Neiva y traslados internos',
      services: ['Traslado Neiva-Villavieja', 'Tours privados', 'Alquiler de vehículos'],
      contact: '+57 300 234 5678',
      color: 'blue'
    },
    {
      id: 3,
      name: 'Equipos Aventura',
      category: 'Alquiler de Equipos',
      icon: <Camera className="w-8 h-8" />,
      rating: 4.6,
      reviews: 120,
      price: 'Desde $30.000',
      description: 'Alquiler de equipos para fotografía, camping y observación astronómica',
      services: ['Telescopios', 'Cámaras', 'Equipo de camping'],
      contact: '+57 300 345 6789',
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      primary: {
        bg: 'bg-primary-100',
        text: 'text-primary-700',
        button: 'bg-primary-600 hover:bg-primary-700'
      },
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const colors = getColorClasses(service.color);
          return (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className={`${colors.bg} p-6 flex items-center justify-center`}>
                <div className={colors.text}>
                  {service.icon}
                </div>
              </div>

              <div className="p-5">
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-full font-semibold`}>
                    {service.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {service.name}
                </h3>

                <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-4 h-4 fill-warning-500 text-warning-500" />
                  <span className="font-semibold text-neutral-700">{service.rating}</span>
                  <span className="text-sm text-neutral-500">({service.reviews} reseñas)</span>
                </div>

                <p className="text-sm text-neutral-600 mb-4">
                  {service.description}
                </p>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-neutral-700 mb-2">Servicios incluidos:</p>
                  <ul className="space-y-1">
                    {service.services.map((item, index) => (
                      <li key={index} className="text-sm text-neutral-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center text-sm text-neutral-600 mb-4">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${service.contact}`} className="hover:text-primary-600">
                    {service.contact}
                  </a>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div>
                    <p className="text-xl font-bold text-primary-700">{service.price}</p>
                  </div>
                  <button className={`${colors.button} text-white px-4 py-2 rounded-lg transition-colors`}>
                    Contactar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VillaviejaServices;
