import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useVirtualScrolling } from '../hooks/usePerformance';

interface VirtualScrollListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  loading?: boolean;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

function VirtualScrollList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  className = '',
  loading = false,
  onEndReached,
  endReachedThreshold = 0.8
}: VirtualScrollListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(height);

  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  } = useVirtualScrolling(items, itemHeight, containerHeight);

  // Actualizar altura del contenedor cuando cambie
  useEffect(() => {
    setContainerHeight(height);
  }, [height]);

  // Detectar cuando se alcanza el final de la lista
  const handleScrollWithEndDetection = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    handleScroll(e);

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage >= endReachedThreshold && onEndReached) {
      onEndReached();
    }
  }, [handleScroll, onEndReached, endReachedThreshold]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScrollWithEndDetection}
      role="list"
      aria-label="Lista virtualizada"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
              role="listitem"
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>

        {loading && (
          <div
            className="flex items-center justify-center py-4"
            style={{ height: itemHeight }}
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando más elementos...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualScrollList;