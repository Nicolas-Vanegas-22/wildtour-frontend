import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useAccessibility';

// Tipos para animaciones
export type AnimationType =
  | 'fadeIn'
  | 'fadeOut'
  | 'slideInUp'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'bounce'
  | 'pulse'
  | 'shake'
  | 'flip'
  | 'rotate';

export type AnimationDuration = 'fast' | 'normal' | 'slow';
export type AnimationEasing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic';

interface AnimationConfig {
  type: AnimationType;
  duration?: AnimationDuration;
  delay?: number;
  easing?: AnimationEasing;
  infinite?: boolean;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Hook para animaciones
export const useAnimation = (config: AnimationConfig) => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const getDuration = (duration: AnimationDuration = 'normal'): number => {
    if (prefersReducedMotion) return 0.01;

    switch (duration) {
      case 'fast': return 0.3;
      case 'normal': return 0.5;
      case 'slow': return 0.8;
      default: return 0.5;
    }
  };

  const getEasing = (easing: AnimationEasing = 'ease'): string => {
    switch (easing) {
      case 'linear': return 'linear';
      case 'ease': return 'ease';
      case 'ease-in': return 'ease-in';
      case 'ease-out': return 'ease-out';
      case 'ease-in-out': return 'ease-in-out';
      case 'bounce': return 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      case 'elastic': return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      default: return 'ease';
    }
  };

  const getAnimationCSS = (): React.CSSProperties => {
    if (prefersReducedMotion) {
      return { opacity: isVisible ? 1 : 0 };
    }

    const duration = getDuration(config.duration);
    const easing = getEasing(config.easing);

    const baseStyle: React.CSSProperties = {
      animationDuration: `${duration}s`,
      animationTimingFunction: easing,
      animationDelay: `${config.delay || 0}s`,
      animationIterationCount: config.infinite ? 'infinite' : 1,
      animationDirection: config.direction || 'normal',
      animationFillMode: config.fillMode || 'both'
    };

    switch (config.type) {
      case 'fadeIn':
        return {
          ...baseStyle,
          animation: `fadeIn ${duration}s ${easing} ${config.delay || 0}s ${config.fillMode || 'both'}`
        };
      case 'fadeOut':
        return {
          ...baseStyle,
          animation: `fadeOut ${duration}s ${easing} ${config.delay || 0}s ${config.fillMode || 'both'}`
        };
      case 'slideInUp':
        return {
          ...baseStyle,
          animation: `slideInUp ${duration}s ${easing} ${config.delay || 0}s ${config.fillMode || 'both'}`
        };
      case 'slideInDown':
        return {
          ...baseStyle,
          animation: `slideInDown ${duration}s ${easing} ${config.delay || 0}s ${config.fillMode || 'both'}`
        };
      case 'slideInLeft':
        return {
          ...baseStyle,
          animation: `slideInLeft ${duration}s ${easing} ${config.delay || 0}s ${config.fillMode || 'both'}`
        };
      case 'slideInRight':
        return {
          ...baseStyle,
          animation: `slideInRight ${duration}s ${easing} ${config.delay || 0}s ${config.fillMode || 'both'}`
        };
      case 'zoomIn':
        return {
          ...baseStyle,
          animation: `zoomIn ${duration}s ${easing} ${config.delay || 0}s ${config.fillMode || 'both'}`
        };
      case 'zoomOut':
        return {
          ...baseStyle,
          animation: `zoomOut ${duration}s ${easing} ${config.delay || 0}s ${config.fillMode || 'both'}`
        };
      case 'bounce':
        return {
          ...baseStyle,
          animation: `bounce ${duration}s ${easing} ${config.delay || 0}s ${config.infinite ? 'infinite' : 1}`
        };
      case 'pulse':
        return {
          ...baseStyle,
          animation: `pulse ${duration}s ${easing} ${config.delay || 0}s ${config.infinite ? 'infinite' : 1}`
        };
      case 'shake':
        return {
          ...baseStyle,
          animation: `shake ${duration}s ${easing} ${config.delay || 0}s ${config.fillMode || 'both'}`
        };
      case 'flip':
        return {
          ...baseStyle,
          animation: `flip ${duration}s ${easing} ${config.delay || 0}s ${config.fillMode || 'both'}`
        };
      case 'rotate':
        return {
          ...baseStyle,
          animation: `rotate ${duration}s ${easing} ${config.delay || 0}s ${config.infinite ? 'infinite' : 1}`
        };
      default:
        return baseStyle;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return {
    ref: elementRef,
    style: getAnimationCSS(),
    isVisible
  };
};

// Componente animado genérico
interface AnimatedElementProps {
  children: React.ReactNode;
  animation: AnimationConfig;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  onAnimationEnd?: () => void;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation,
  className = '',
  tag: Tag = 'div',
  onAnimationEnd
}) => {
  const { ref, style } = useAnimation(animation);

  const handleAnimationEnd = () => {
    onAnimationEnd?.();
  };

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={style}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </Tag>
  );
};

// Componentes específicos pre-configurados

export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: AnimationDuration;
  className?: string;
}> = ({ children, delay, duration, className }) => (
  <AnimatedElement
    animation={{ type: 'fadeIn', delay, duration }}
    className={className}
  >
    {children}
  </AnimatedElement>
);

export const SlideInUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: AnimationDuration;
  className?: string;
}> = ({ children, delay, duration, className }) => (
  <AnimatedElement
    animation={{ type: 'slideInUp', delay, duration }}
    className={className}
  >
    {children}
  </AnimatedElement>
);

export const ZoomIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: AnimationDuration;
  className?: string;
}> = ({ children, delay, duration, className }) => (
  <AnimatedElement
    animation={{ type: 'zoomIn', delay, duration }}
    className={className}
  >
    {children}
  </AnimatedElement>
);

// Componente para stagger animations (animaciones escalonadas)
interface StaggerAnimationProps {
  children: React.ReactElement[];
  animation: Omit<AnimationConfig, 'delay'>;
  staggerDelay?: number;
  className?: string;
}

export const StaggerAnimation: React.FC<StaggerAnimationProps> = ({
  children,
  animation,
  staggerDelay = 0.1,
  className
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimatedElement
          animation={{
            ...animation,
            delay: index * staggerDelay
          }}
          key={index}
        >
          {child}
        </AnimatedElement>
      ))}
    </div>
  );
};

// Componente para scroll reveal
interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fadeIn',
  threshold = 0.1,
  className,
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        prefersReducedMotion
          ? (isVisible ? 'opacity-100' : 'opacity-0')
          : (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
      } ${className || ''}`}
    >
      {children}
    </div>
  );
};

// Componente para hover animations
interface HoverAnimationProps {
  children: React.ReactNode;
  scale?: number;
  rotate?: number;
  translateY?: number;
  duration?: number;
  className?: string;
}

export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  children,
  scale = 1.05,
  rotate = 0,
  translateY = 0,
  duration = 0.3,
  className
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`transition-transform cursor-pointer ${className || ''}`}
      style={{
        transitionDuration: `${duration}s`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale}) rotate(${rotate}deg) translateY(${translateY}px)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg) translateY(0px)';
      }}
    >
      {children}
    </div>
  );
};

// Componente para loading animations
export const LoadingAnimation: React.FC<{
  type?: 'spinner' | 'dots' | 'bars' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}> = ({ type = 'spinner', size = 'md', color = '#3B82F6' }) => {
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (prefersReducedMotion) {
    return (
      <div
        className={`${sizeClasses[size]} border-2 border-neutral-300 border-t-current rounded-full`}
        style={{ borderTopColor: color }}
      />
    );
  }

  switch (type) {
    case 'spinner':
      return (
        <div
          className={`${sizeClasses[size]} border-2 border-neutral-300 border-t-current rounded-full animate-spin`}
          style={{ borderTopColor: color }}
        />
      );

    case 'dots':
      return (
        <div className="flex space-x-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} rounded-full animate-pulse`}
              style={{
                backgroundColor: color,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      );

    case 'bars':
      return (
        <div className="flex space-x-1 items-end">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`${size === 'sm' ? 'w-1' : size === 'md' ? 'w-2' : 'w-3'} bg-current animate-pulse`}
              style={{
                height: `${20 + (i % 2) * 10}px`,
                backgroundColor: color,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
      );

    case 'pulse':
      return (
        <div
          className={`${sizeClasses[size]} rounded-full animate-pulse`}
          style={{ backgroundColor: color }}
        />
      );

    default:
      return null;
  }
};

// Componente para transiciones de página
interface PageTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isVisible,
  direction = 'up'
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    );
  }

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';

    switch (direction) {
      case 'up': return 'translate3d(0, 20px, 0)';
      case 'down': return 'translate3d(0, -20px, 0)';
      case 'left': return 'translate3d(20px, 0, 0)';
      case 'right': return 'translate3d(-20px, 0, 0)';
      default: return 'translate3d(0, 20px, 0)';
    }
  };

  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform()
      }}
    >
      {children}
    </div>
  );
};