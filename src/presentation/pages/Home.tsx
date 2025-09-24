import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Play,
  Calendar,
  Heart,
  Award,
  Compass,
  Shield,
  Leaf,
  Navigation,
} from 'lucide-react';
import { Button } from '../../shared/ui';
import { Card, CardContent } from '../../shared/ui';
import { cn } from '../../shared/utils/cn';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides del hero
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop',
      title: 'Descubre la Magia de Colombia',
      subtitle: 'Vive experiencias únicas en los paisajes más espectaculares del país',
      cta: 'Explora Destinos',
      accent: 'primary',
    },
    {
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
      title: 'Aventuras Que Transforman',
      subtitle: 'Conecta con la naturaleza y crea recuerdos inolvidables',
      cta: 'Ver Experiencias',
      accent: 'coral',
    },
    {
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&h=1080&fit=crop',
      title: 'Desierto de la Tatacoa',
      subtitle: 'Contempla las estrellas en uno de los cielos más puros de América',
      cta: 'Visitar Villavieja',
      accent: 'accent',
    },
  ];

  // Destino destacado - Solo Villavieja
  const featuredDestination = {
    id: 1,
    name: 'Desierto de la Tatacoa',
    location: 'Villavieja, Huila',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 234,
    price: 'Desde $150.000',
    category: 'Astronomía',
    slug: 'villavieja',
  };

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
              <Button
                size="xl"
                variant="ghost"
                leftIcon={<Play className="w-5 h-5" />}
                className="text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                Ver Video
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

      {/* Featured Destination - Villavieja */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Descubre Villavieja
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Vive una experiencia única en el Desierto de la Tatacoa, donde la magia del universo se encuentra con la belleza de la naturaleza.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Link to="/villavieja">
              <Card variant="elevated" hover className="overflow-hidden group">
                <div className="relative h-80">
                  <img
                    src={featuredDestination.image}
                    alt={featuredDestination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                      {featuredDestination.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <button className="bg-white/90 backdrop-blur-sm hover:bg-white transition-colors p-2 rounded-full">
                      <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">{featuredDestination.name}</h3>
                    <div className="flex items-center text-sm opacity-90">
                      <MapPin className="w-4 h-4 mr-1" />
                      {featuredDestination.location}
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                      <span className="font-semibold text-gray-900 text-lg">{featuredDestination.rating}</span>
                      <span className="text-gray-600 ml-2">({featuredDestination.reviews} reseñas)</span>
                    </div>
                    <span className="text-2xl font-bold text-primary-600">
                      {featuredDestination.price}
                    </span>
                  </div>

                  <Button variant="primary" size="lg" fullWidth className="group-hover:bg-primary-600">
                    Explorar Villavieja
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

              <Button
                size="xl"
                variant="ghost"
                leftIcon={<Navigation className="w-5 h-5" />}
                className="text-white hover:bg-white/10 text-lg px-8 py-4"
                asChild
              >
                <Link to="/contacto">
                  Habla con un Experto
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