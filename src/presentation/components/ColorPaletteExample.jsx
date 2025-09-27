import React from 'react';

const ColorPaletteExample = () => {
  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      {/* Sección principal con fondo neutro */}
      <div className="max-w-6xl mx-auto">
        {/* Encabezados */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-500 mb-4">
            Título Principal - Color Primario
          </h1>
          <h2 className="text-2xl font-semibold text-secondary-500 mb-8">
            Subtítulo - Color Secundario
          </h2>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap gap-6 justify-center mb-12">
          {/* Botón Principal */}
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg">
            Botón Principal
          </button>

          {/* Botón Secundario */}
          <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg">
            Botón Secundario
          </button>

          {/* Botón de Acento */}
          <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg">
            Botón de Acento
          </button>
        </div>

        {/* Tarjetas de demostración */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Tarjeta con tema primario */}
          <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-lg">
            <div className="w-full h-32 bg-primary-100 rounded-lg mb-4"></div>
            <h3 className="text-xl font-bold text-primary-700 mb-2">Tema Primario</h3>
            <p className="text-primary-600 mb-4">Descripción usando colores primarios para una experiencia cohesiva.</p>
            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors">
              Acción Primaria
            </button>
          </div>

          {/* Tarjeta con tema secundario */}
          <div className="bg-white border border-secondary-200 rounded-xl p-6 shadow-lg">
            <div className="w-full h-32 bg-secondary-100 rounded-lg mb-4"></div>
            <h3 className="text-xl font-bold text-secondary-700 mb-2">Tema Secundario</h3>
            <p className="text-secondary-600 mb-4">Descripción usando colores secundarios para destacar contenido especial.</p>
            <button className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-2 rounded-lg transition-colors">
              Acción Secundaria
            </button>
          </div>

          {/* Tarjeta con tema de acento */}
          <div className="bg-white border border-accent-200 rounded-xl p-6 shadow-lg">
            <div className="w-full h-32 bg-accent-100 rounded-lg mb-4"></div>
            <h3 className="text-xl font-bold text-accent-700 mb-2">Tema de Acento</h3>
            <p className="text-accent-600 mb-4">Descripción usando colores de acento para llamar la atención.</p>
            <button className="w-full bg-accent-500 hover:bg-accent-600 text-white py-2 rounded-lg transition-colors">
              Acción de Acento
            </button>
          </div>
        </div>

        {/* Sección de estados */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
          <h3 className="text-2xl font-bold text-primary-700 mb-6">Estados y Notificaciones</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Estado de éxito */}
            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-success-500 rounded-full mr-3"></div>
                <h4 className="font-semibold text-success-700">Operación Exitosa</h4>
              </div>
              <p className="text-success-600 text-sm">La acción se completó correctamente.</p>
            </div>

            {/* Estado de advertencia */}
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-warning-500 rounded-full mr-3"></div>
                <h4 className="font-semibold text-warning-700">Advertencia</h4>
              </div>
              <p className="text-warning-600 text-sm">Revisa esta información antes de continuar.</p>
            </div>

            {/* Estado de error */}
            <div className="bg-error-50 border border-error-200 rounded-lg p-4 md:col-span-2">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-error-500 rounded-full mr-3"></div>
                <h4 className="font-semibold text-error-700">Error</h4>
              </div>
              <p className="text-error-600 text-sm">Ha ocurrido un error. Por favor, intenta nuevamente.</p>
            </div>
          </div>
        </div>

        {/* Paleta de colores de referencia */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-primary-700 mb-6">Paleta de Colores</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Colores primarios */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-500 rounded-lg mx-auto mb-2 shadow-md"></div>
              <p className="font-semibold text-primary-700">Principal</p>
              <p className="text-sm text-neutral-600">#5C2D2D</p>
            </div>

            {/* Colores secundarios */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-500 rounded-lg mx-auto mb-2 shadow-md"></div>
              <p className="font-semibold text-secondary-700">Secundario</p>
              <p className="text-sm text-neutral-600">#A34C3E</p>
            </div>

            {/* Colores de acento */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-500 rounded-lg mx-auto mb-2 shadow-md"></div>
              <p className="font-semibold text-accent-700">Acento</p>
              <p className="text-sm text-neutral-600">#FFB74C</p>
            </div>

            {/* Colores neutros */}
            <div className="text-center">
              <div className="w-20 h-20 bg-neutral-100 border-2 border-neutral-300 rounded-lg mx-auto mb-2 shadow-md"></div>
              <p className="font-semibold text-neutral-700">Neutro</p>
              <p className="text-sm text-neutral-600">#F0F0F0</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-neutral-600 mb-2">
            Esta página demuestra el uso correcto de la nueva paleta de colores
          </p>
          <p className="text-sm text-neutral-500">
            Todos los elementos siguen las mejores prácticas de contraste y accesibilidad
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ColorPaletteExample;