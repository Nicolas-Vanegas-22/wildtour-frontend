import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ServiceBooking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reservar Servicio</h1>
          
          {/* Información del servicio */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600">ID del servicio: {serviceId}</p>
          </div>

          {/* Formulario de reserva */}
          <form className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
                Número de participantes
              </label>
              <input
                type="number"
                id="participants"
                name="participants"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Continuar con la reserva
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}