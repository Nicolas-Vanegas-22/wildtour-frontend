import { api } from '../http/apiClient';

export interface SearchParams { query?: string; region?: string; type?: string; minPrice?: number; maxPrice?: number; page?: number; size?: number }

export const DestinationsRepo = {
  //async search(params: SearchParams) { const { data } = await api.get('/destinations', { params }); return data },
  async byId(id: string) { const { data } = await api.get(`/destinations/${id}`); return data },
  async reviews(id: string) { const { data } = await api.get(`/destinations/${id}/reviews`); return data },

  
  //estas son tarjetas simulatorias de hoteles borrarla cuando este en producción
  async search(filters: any) {
    // MOCK: destinos de Villavieja y Desierto de la Tatacoa
    const all = [
      {
        id: '1',
        name: 'Hotel Boutique La Casona',
        location: 'Villavieja',
        type: 'hotel',
        price: 120000,
        image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tripadvisor.co%2FHotel_Review-g1507128-d23902569-Reviews-Hotel_Infinito_La_Casona-Villavieja_Huila_Department.html&psig=AOvVaw1W7d5YK-A5bxEPW-3XtXFP&ust=1757721218011000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKiT9Pjz0Y8DFQAAAAAdAAAAABAE',
        description: 'Hotel colonial en el centro histórico de Villavieja.'
      },
      {
        id: '2',
        name: 'Observatorio Astronómico y Hospedaje',
        location: 'Desierto de la Tatacoa',
        type: 'hostal',
        price: 90000,
        image: '/images/observatorio.jpg',
        description: 'Hospedaje con experiencia de observación de estrellas.'
      },
      {
        id: '3',
        name: 'Hotel Villa del Sol',
        location: 'Villavieja',
        type: 'hotel',
        price: 150000,
        image: '/images/villadelsol.jpg',
        description: 'Hotel con piscina y restaurante cerca al río Magdalena.'
      },
      {
        id: '4',
        name: 'Eco Hotel Noches de Saturno',
        location: 'Desierto de la Tatacoa',
        type: 'eco-hotel',
        price: 110000,
        image: '/images/nochesdesaturno.jpg',
        description: 'Eco hotel en medio del desierto, ideal para desconexión y naturaleza.'
      },
      {
        id: '3',
        name: 'Hotel Villa del Sol',
        location: 'Villavieja',
        type: 'hotel',
        price: 150000,
        image: '/images/villadelsol.jpg',
        description: 'Hotel con piscina y restaurante cerca al río Magdalena.'
      },
      {
        id: '4',
        name: 'Eco Hotel Noches de Saturno',
        location: 'Desierto de la Tatacoa',
        type: 'eco-hotel',
        price: 110000,
        image: '/images/nochesdesaturno.jpg',
        description: 'Eco hotel en medio del desierto, ideal para desconexión y naturaleza.'
      }
    ];

    // Simple filtro por query
    const items = all.filter(d => {
      if (filters.query && !d.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.region && d.location !== filters.region) return false;
      if (filters.type && d.type !== filters.type) return false;
      if (filters.minPrice && d.price < filters.minPrice) return false;
      if (filters.maxPrice && d.price > filters.maxPrice) return false;
      return true;
    });

    return { items, total: items.length };
  }
};
