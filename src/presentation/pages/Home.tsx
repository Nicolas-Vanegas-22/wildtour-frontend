import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ArrowRight,
  Calendar,
  Award,
  Shield,
  Leaf,
} from 'lucide-react';
import { Button } from '../../shared/ui';
import { Card, CardContent } from '../../shared/ui';
import { cn } from '../../shared/utils/cn';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides del hero
  const heroSlides = [
    {
      image: '/images/hero/tatacoa-1.jpg',
      title: 'Descubre la Magia de Colombia',
      subtitle: 'Vive experiencias únicas en los paisajes más espectaculares del país',
      cta: 'Explora Destinos',
      accent: 'primary',
    },
    {
      image: '/images/hero/tatacoa-2.jpg',
      title: 'Aventuras Que Transforman',
      subtitle: 'Conecta con la naturaleza y crea recuerdos inolvidables',
      cta: 'Ver Experiencias',
      accent: 'coral',
    },
    {
      image: '/images/hero/tatacoa-3.jpg',
      title: 'Desierto de la Tatacoa',
      subtitle: 'Contempla las estrellas en uno de los cielos más puros de América',
      cta: 'Visitar Villavieja',
      accent: 'accent',
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
                variant="secondary"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="text-lg px-8 py-4 bg-white text-primary-700 hover:bg-gray-100 font-semibold shadow-xl"
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