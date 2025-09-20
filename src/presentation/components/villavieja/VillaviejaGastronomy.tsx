import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Star,
  Clock,
  MapPin,
  DollarSign,
  ChefHat,
  Coffee,
  Flame,
  Heart,
  Award,
  Users,
  Camera,
  Phone,
  ShoppingBag,
  Leaf,
  Fish
} from 'lucide-react';
import { villaviejaGastronomy } from '../../../data/villaviejaData';

type RestaurantType = 'Todos' | 'Tradicional' | 'Parrilla' | 'Cafetería';
type PriceRangeType = 'Todos' | '$' | '$$' | '$$$';

const VillaviejaGastronomy: React.FC = () => {
  const [selectedType, setSelectedType] = useState<RestaurantType>('Todos');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeType>('Todos');
  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes' | 'products'>('restaurants');

  const restaurantIcons = {
    'Tradicional': <ChefHat className="w-5 h-5" />,
    'Parrilla': <Flame className="w-5 h-5" />,
    'Cafetería': <Coffee className="w-5 h-5" />
  };

  const dishIcons = {
    'Sancocho Huilense': <UtensilsCrossed className="w-6 h-6" />,
    'Mojarra Frita': <Fish className="w-6 h-6" />,
    'Tamales Huilenses': <Leaf className="w-6 h-6" />
  };

  const filteredRestaurants = villaviejaGastronomy.restaurants.filter(restaurant => {
    const typeMatch = selectedType === 'Todos' || restaurant.type === selectedType;
    const priceMatch = selectedPriceRange === 'Todos' || restaurant.priceRange === selectedPriceRange;
    return typeMatch && priceMatch;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getPriceRangeText = (range: string) => {
    switch (range) {
      case '$': return '$10.000 - $20.000';
      case '$$': return '$20.000 - $35.000';
      case '$$$': return '$35.000 - $50.000';
      default: return '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Gastronomía Local</h2>
              <p className="text-orange-100">Sabores auténticos del Huila</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Descubre la rica tradición culinaria de Villavieja, donde los sabores del desierto se mezclan con la herencia huilense para crear experiencias gastronómicas únicas.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <UtensilsCrossed className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{villaviejaGastronomy.restaurants.length}</h3>
              <p className="text-sm text-gray-600">Restaurantes</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <ChefHat className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{villaviejaGastronomy.traditionalDishes.length}</h3>
              <p className="text-sm text-gray-600">Platos típicos</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{villaviejaGastronomy.localProducts.length}</h3>
              <p className="text-sm text-gray-600">Productos locales</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">100%</h3>
              <p className="text-sm text-gray-600">Auténtico</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'restaurants'
                  ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <UtensilsCrossed className="w-5 h-5" />
                <span>Restaurantes</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('dishes')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'dishes'
                  ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ChefHat className="w-5 h-5" />
                <span>Platos Típicos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'products'
                  ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Productos Locales</span>
              </div>
            </button>
          </div>
        </div>

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div className="p-6">
            {/* Filters */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Restaurante</label>
                  <div className="flex flex-wrap gap-2">
                    {(['Todos', 'Tradicional', 'Parrilla', 'Cafetería'] as RestaurantType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                          selectedType === type
                            ? 'bg-orange-100 border-orange-300 text-orange-800'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {type !== 'Todos' && restaurantIcons[type as keyof typeof restaurantIcons]}
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Rango de Precio</label>
                  <div className="flex flex-wrap gap-2">
                    {(['Todos', '$', '$$', '$$$'] as PriceRangeType[]).map((range) => (
                      <button
                        key={range}
                        onClick={() => setSelectedPriceRange(range)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedPriceRange === range
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {range === 'Todos' ? 'Todos' : `${range} ${getPriceRangeText(range)}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          restaurant.type === 'Tradicional' ? 'bg-green-100 text-green-800' :
                          restaurant.type === 'Parrilla' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {restaurant.type}
                        </span>
                        <span className="text-lg font-bold text-gray-600">{restaurant.priceRange}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(restaurant.rating)}
                        <span className="text-sm text-gray-600 ml-2">{restaurant.rating}</span>
                      </div>
                    </div>
                    <img
                      src={`https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop`}
                      alt={restaurant.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{restaurant.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.specialties.map((specialty, index) => (
                        <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{restaurant.hours}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Ver Contacto</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Traditional Dishes Tab */}
        {activeTab === 'dishes' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {villaviejaGastronomy.traditionalDishes.map((dish, index) => (
                <div key={index} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={`https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=250&fit=crop`}
                      alt={dish.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ${dish.price.toLocaleString()}
                      </span>
                    </div>
                    <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-orange-100 rounded-full p-2">
                        {dishIcons[dish.name as keyof typeof dishIcons] || <ChefHat className="w-6 h-6 text-orange-600" />}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{dish.name}</h3>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">{dish.description}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Ingredientes principales</h4>
                      <div className="flex flex-wrap gap-2">
                        {dish.ingredients.map((ingredient, idx) => (
                          <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-600">
                        ${dish.price.toLocaleString()}
                      </div>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                        <Camera className="w-4 h-4" />
                        <span>Ver Receta</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Traditional Cooking Info */}
            <div className="mt-8 bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center">
                <ChefHat className="w-6 h-6 mr-2" />
                Tradición Culinaria Huilense
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Ingredientes Típicos</h4>
                  <ul className="space-y-1 text-amber-700 text-sm">
                    <li>• Yuca: base de muchos platos</li>
                    <li>• Plátano verde: acompañamiento esencial</li>
                    <li>• Pescado de río: principalmente mojarra</li>
                    <li>• Gallina criolla: para sancochos</li>
                    <li>• Panela: endulzante tradicional</li>
                    <li>• Cilantro y cebolla larga: aromáticos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Técnicas Ancestrales</h4>
                  <ul className="space-y-1 text-amber-700 text-sm">
                    <li>• Cocción en fogón de leña</li>
                    <li>• Envuelto en hojas de bijao</li>
                    <li>• Asado en parrillas artesanales</li>
                    <li>• Preparación comunitaria</li>
                    <li>• Conservación con sal y humo</li>
                    <li>• Fermentación natural</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Local Products Tab */}
        {activeTab === 'products' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {villaviejaGastronomy.localProducts.map((product, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Vendedor:</p>
                      <p className="font-semibold text-gray-900">{product.vendor}</p>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Comprar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shopping Guide */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2" />
                Guía de Compras
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Dónde Comprar</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Plaza de mercado central</li>
                    <li>• Tiendas familiares</li>
                    <li>• Cooperativas locales</li>
                    <li>• Finca productoras</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Mejores Horarios</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Mañanas: productos frescos</li>
                    <li>• Fines de semana: mayor variedad</li>
                    <li>• Festivales: productos especiales</li>
                    <li>• Temporada seca: mejor calidad</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Consejos</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Regatear con respeto</li>
                    <li>• Probar antes de comprar</li>
                    <li>• Llevar bolsas reutilizables</li>
                    <li>• Pagar en efectivo</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gastronomic Tour Package */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <UtensilsCrossed className="w-6 h-6" />
            <h3 className="text-xl font-bold">Tour Gastronómico</h3>
          </div>
          <p className="text-purple-100 mt-2">Experiencia culinaria completa</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Incluye:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>Visita a 3 restaurantes tradicionales</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ChefHat className="w-4 h-4 text-purple-500" />
                  <span>Degustación de platos típicos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-purple-500" />
                  <span>Recorrido por el mercado local</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coffee className="w-4 h-4 text-purple-500" />
                  <span>Cata de café huilense</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span>Clase de cocina tradicional</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-600 mb-1">$89.000</div>
                <div className="text-sm text-purple-700">por persona</div>
              </div>

              <div className="space-y-3 text-sm text-purple-700 mb-4">
                <div className="flex items-center justify-between">
                  <span>Duración:</span>
                  <span className="font-semibold">4 horas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Grupo mínimo:</span>
                  <span className="font-semibold">4 personas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Incluye:</span>
                  <span className="font-semibold">Comida y transporte</span>
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <UtensilsCrossed className="w-5 h-5" />
                <span>Reservar Tour</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaviejaGastronomy;