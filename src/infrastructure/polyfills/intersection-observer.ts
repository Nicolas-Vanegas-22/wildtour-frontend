// Polyfill para IntersectionObserver
// Basado en la especificación W3C y compatible con navegadores antiguos

interface IntersectionObserverEntry {
  readonly boundingClientRect: DOMRectReadOnly;
  readonly intersectionRatio: number;
  readonly intersectionRect: DOMRectReadOnly;
  readonly isIntersecting: boolean;
  readonly rootBounds: DOMRectReadOnly | null;
  readonly target: Element;
  readonly time: number;
}

interface IntersectionObserverInit {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

type IntersectionObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void;

if (!('IntersectionObserver' in window)) {
  class IntersectionObserverPolyfill {
    private callback: IntersectionObserverCallback;
    private root: Element | null;
    private rootMargin: string;
    private thresholds: number[];
    private targets: Set<Element>;
    private observing: boolean;

    constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
      this.callback = callback;
      this.root = options.root || null;
      this.rootMargin = options.rootMargin || '0px';
      this.thresholds = Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold || 0];
      this.targets = new Set();
      this.observing = false;

      // Iniciar el polling cuando se observa el primer elemento
      this.startPolling = this.startPolling.bind(this);
      this.stopPolling = this.stopPolling.bind(this);
      this.checkIntersections = this.checkIntersections.bind(this);
    }

    observe(target: Element): void {
      if (this.targets.has(target)) return;

      this.targets.add(target);

      if (!this.observing) {
        this.startPolling();
      }
    }

    unobserve(target: Element): void {
      this.targets.delete(target);

      if (this.targets.size === 0) {
        this.stopPolling();
      }
    }

    disconnect(): void {
      this.targets.clear();
      this.stopPolling();
    }

    takeRecords(): IntersectionObserverEntry[] {
      // No implementado en el polyfill básico
      return [];
    }

    private intervalId: number | null = null;

    private startPolling(): void {
      if (this.observing) return;

      this.observing = true;
      this.intervalId = window.setInterval(this.checkIntersections, 100);

      // También verificar en eventos de scroll y resize
      window.addEventListener('scroll', this.checkIntersections, true);
      window.addEventListener('resize', this.checkIntersections);
    }

    private stopPolling(): void {
      if (!this.observing) return;

      this.observing = false;

      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      window.removeEventListener('scroll', this.checkIntersections, true);
      window.removeEventListener('resize', this.checkIntersections);
    }

    private checkIntersections(): void {
      const entries: IntersectionObserverEntry[] = [];

      this.targets.forEach(target => {
        const entry = this.createEntry(target);
        if (entry) {
          entries.push(entry);
        }
      });

      if (entries.length > 0) {
        this.callback(entries, this as any);
      }
    }

    private createEntry(target: Element): IntersectionObserverEntry | null {
      const targetRect = target.getBoundingClientRect();
      const rootRect = this.getRootRect();

      if (!rootRect) return null;

      const intersectionRect = this.getIntersectionRect(targetRect, rootRect);
      const intersectionArea = intersectionRect.width * intersectionRect.height;
      const targetArea = targetRect.width * targetRect.height;
      const intersectionRatio = targetArea > 0 ? intersectionArea / targetArea : 0;

      const isIntersecting = intersectionRatio > 0;

      return {
        boundingClientRect: targetRect,
        intersectionRatio,
        intersectionRect,
        isIntersecting,
        rootBounds: rootRect,
        target,
        time: performance.now()
      };
    }

    private getRootRect(): DOMRectReadOnly | null {
      if (this.root) {
        return this.root.getBoundingClientRect();
      } else {
        // Usar viewport
        return {
          top: 0,
          left: 0,
          bottom: window.innerHeight,
          right: window.innerWidth,
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
          toJSON: () => ({})
        };
      }
    }

    private getIntersectionRect(
      targetRect: DOMRectReadOnly,
      rootRect: DOMRectReadOnly
    ): DOMRectReadOnly {
      const top = Math.max(targetRect.top, rootRect.top);
      const left = Math.max(targetRect.left, rootRect.left);
      const bottom = Math.min(targetRect.bottom, rootRect.bottom);
      const right = Math.min(targetRect.right, rootRect.right);

      const width = Math.max(0, right - left);
      const height = Math.max(0, bottom - top);

      return {
        top,
        left,
        bottom,
        right,
        width,
        height,
        x: left,
        y: top,
        toJSON: () => ({})
      };
    }
  }

  // Asignar el polyfill a window
  (window as any).IntersectionObserver = IntersectionObserverPolyfill;
}

export {};