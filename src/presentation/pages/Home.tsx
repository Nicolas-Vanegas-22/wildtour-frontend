import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  Star,
  ArrowRight,
  Calendar,
  Award,
  Shield,
  Leaf,
  Clock,
} from 'lucide-react';
import { Button } from '../../shared/ui';
import { Card, CardContent } from '../../shared/ui';
import { cn } from '../../shared/utils/cn';
import { tourPackages } from '../../data/tourPackages';
import { realActivities } from '../../data/realActivities';
import { mockDestinations } from '../../data/mockData';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides del hero
  const heroSlides = [
    {
      image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/e4/4a/0a/desierto-de-la-tatacoa.jpg?w=1920&h=1080&s=1',
      title: 'Descubre la Magia de Colombia',
      subtitle: 'Vive experiencias únicas en los paisajes más espectaculares del país',
      cta: 'Explora Destinos',
      accent: 'primary',
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Desierto_de_la_Tatacoa%2C_Huila%2C_Colombia.jpg/1920px-Desierto_de_la_Tatacoa%2C_Huila%2C_Colombia.jpg',
      title: 'Aventuras Que Transforman',
      subtitle: 'Conecta con la naturaleza y crea recuerdos inolvidables',
      cta: 'Ver Experiencias',
      accent: 'coral',
    },
    {
      image: 'https://i0.wp.com/www.colombiaenfotos.org/wp-content/uploads/2019/11/tatacoa-desert-night-sky-stars-milky-way-colombia.jpg?w=1920&ssl=1',
      title: 'Desierto de la Tatacoa',
      subtitle: 'Contempla las estrellas en uno de los cielos más puros de América',
      cta: 'Visitar Villavieja',
      accent: 'accent',
    },
  ];

  // Paquetes destacados (featured)
  const featuredPackages = tourPackages.filter(pkg => pkg.featured).slice(0, 3);

  // Actividades populares (ordenadas por rating)
  const popularActivities = [...realActivities]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // Destinos principales
  const topDestinations = mockDestinations.slice(0, 4);

  // Testimonios
  const testimonials = [
    {
      name: 'María González',
      location: 'Bogotá',
      comment: 'Una experiencia absolutamente increíble. El desierto de la Tatacoa me dejó sin palabras.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-b0?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Carlos Rodríguez',
      location: 'Medellín',
      comment: 'Wild Tour hizo que nuestro viaje familiar fuera perfecto. Altamente recomendado.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Ana Martínez',
      location: 'Cali',
      comment: 'La atención al detalle y la calidad del servicio superaron todas mis expectativas.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Slides */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000',
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              )}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-gray-900/20" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex justify-center">
              <Button
                size="xl"
                variant={heroSlides[currentSlide].accent as any}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="text-lg px-8 py-4"
                asChild
              >
                <Link to="/villavieja">
                  {heroSlides[currentSlide].cta}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300',
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
              )}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              ¿Por qué elegir Wild Tour?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Somos expertos en crear experiencias auténticas que conectan a nuestros viajeros
              con la increíble biodiversidad y cultura de Colombia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="w-8 h-8" />,
                title: 'Turismo Sostenible',
                description: 'Promovemos el cuidado del medio ambiente en cada experiencia.',
                color: 'primary',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Guías Expertos',
                description: 'Nuestros guías locales conocen cada secreto de Colombia.',
                color: 'coral',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Viajes Seguros',
                description: 'Tu seguridad es nuestra prioridad en cada aventura.',
                color: 'sky',
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Experiencias Únicas',
                description: 'Creamos momentos inolvidables fuera de lo común.',
                color: 'accent',
              },
            ].map((feature, index) => (
              <div key={index}>
                <Card variant="elevated" hover className="h-full text-center">
                  <CardContent className="p-8">
                    <div className={cn(
                      'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6',
                      feature.color === 'primary' && 'bg-primary-100 text-primary-600',
                      feature.color === 'coral' && 'bg-coral-100 text-coral-600',
                      feature.color === 'sky' && 'bg-sky-100 text-sky-600',
                      feature.color === 'accent' && 'bg-accent-100 text-accent-600'
                    )}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tour Packages Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Paquetes Turísticos Destacados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explora nuestras experiencias más populares diseñadas para crear recuerdos inolvidables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <div key={pkg.id}>
                <Card variant="elevated" hover className="h-full overflow-hidden">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={pkg.images[0]}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-coral-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {pkg.category}
                    </div>
                    {pkg.discountPrice && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Oferta
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{pkg.destination}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {pkg.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-900 font-semibold">{pkg.rating}</span>
                        <span className="ml-1 text-gray-500 text-sm">({pkg.reviewsCount})</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        {pkg.discountPrice ? (
                          <div>
                            <span className="text-gray-400 line-through text-sm">
                              ${pkg.price.toLocaleString()}
                            </span>
                            <span className="text-2xl font-bold text-primary-600 ml-2">
                              ${pkg.discountPrice.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-primary-600">
                            ${pkg.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Button variant="primary" size="sm" asChild>
                        <Link to="/villavieja">
                          Ver Detalles
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" rightIcon={<ArrowRight />} asChild>
              <Link to="/villavieja">
                Ver Todos los Paquetes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Activities Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Actividades Populares
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre las experiencias favoritas de nuestros viajeros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularActivities.map((activity) => (
              <div key={activity.id}>
                <Card variant="elevated" hover className="h-full overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={activity.images[0]}
                      alt={activity.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {activity.category}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="line-clamp-1">{activity.destination}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {activity.name}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-900 font-semibold">{activity.rating}</span>
                        <span className="ml-1 text-gray-500 text-sm">({activity.reviewsCount})</span>
                      </div>
                      <span className="text-gray-600 text-sm">{activity.duration}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-xl font-bold text-primary-600">
                        ${activity.price.toLocaleString()}
                      </span>
                      <Button variant="primary" size="sm" asChild>
                        <Link to="/villavieja">
                          Reservar
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Destinations Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Destinos Imperdibles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Los lugares más increíbles de Colombia te están esperando
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topDestinations.map((destination) => (
              <div key={destination.id}>
                <Card variant="elevated" hover className="h-full overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={destination.images.main}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{destination.location.city}, {destination.location.department}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold">{destination.rating}</span>
                        <span className="ml-1">({destination.totalReviews})</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={`/${destination.slug || 'villavieja'}`}>
                        Explorar Destino
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight />} asChild>
              <Link to="/destinations">
                Ver Todos los Destinos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Lo que dicen nuestros viajeros
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Historias reales de aventureros que han vivido experiencias únicas con Wild Tour.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <Card variant="elevated" className="h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.comment}"
                    </p>

                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              ¿Listo para tu próxima aventura?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Únete a miles de viajeros que han descubierto la magia de Colombia con Wild Tour.
              Tu próxima aventura está a un clic de distancia.
            </p>

            <div className="flex justify-center">
              <Button
                size="xl"
                variant="secondary"
                leftIcon={<Calendar className="w-5 h-5" />}
                className="text-lg px-8 py-4"
                asChild
              >
                <Link to="/villavieja">
                  Planifica tu Viaje
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;