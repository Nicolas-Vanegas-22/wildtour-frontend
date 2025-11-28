import { api } from '../http/apiClient';

export interface RNTVerificationRequest {
  rntNumber: string;
  rntType: string;
  businessName: string;
}

export interface RNTVerificationResponse {
  isValid: boolean;
  status: 'active' | 'inactive' | 'suspended' | 'not_found';
  registeredName?: string;
  registeredType?: string;
  registrationDate?: string;
  expirationDate?: string;
  message: string;
}

export interface RNTDocumentVerificationRequest {
  rntNumber: string;
  document: string | number; // ✅ Acepta string o number (se convertirá internamente)
  businessName: string;
}

export interface RNTDocumentVerificationResponse {
  isValid: boolean;
  documentMatches: boolean;
  businessNameMatches: boolean;
  registeredName?: string;
  registeredType?: string;
  city?: string;
  department?: string;
  message: string;
}

export const rntApi = {
  /**
   * Verifica si un número de RNT es válido y está activo
   */
  async verifyRNT(data: RNTVerificationRequest): Promise<RNTVerificationResponse> {
    const response = await api.post<RNTVerificationResponse>('/rnt/verify', data);
    return response.data;
  },

  /**
   * Verifica que la cédula del prestador coincida con el NIT del RNT registrado
   */
  async verifyRNTWithDocument(data: RNTDocumentVerificationRequest): Promise<RNTDocumentVerificationResponse> {
    try {
      // Limpiar y convertir el documento a número
      const documentString = typeof data.document === 'number'
        ? data.document.toString()
        : data.document;
      const cleanDocumentString = documentString.replace(/[.,\s-]/g, '');
      const documentNumber = parseInt(cleanDocumentString, 10);

      if (isNaN(documentNumber)) {
        return {
          isValid: false,
          documentMatches: false,
          businessNameMatches: false,
          message: 'El documento debe contener solo números'
        };
      }

      // ✅ CORRECCIÓN: Enviar datos en JSON body con document como número
      const requestBody = {
        rntNumber: data.rntNumber.trim(),
        document: documentNumber,
        businessName: data.businessName.trim()
      };

      // POST con datos en el body como JSON
      const response = await api.post<any>(
        '/rnt/verify-with-document',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // El backend devuelve estructura ApiResponse
      // El interceptor ya extrae response.data.data
      const responseData = response.data;

      // Verificar si la respuesta tiene la estructura esperada
      if (responseData && typeof responseData === 'object') {
        // Si viene directamente el objeto de datos
        if ('isValid' in responseData) {
          return responseData;
        }
        // Si viene envuelto en success/data
        if (responseData.success && responseData.data) {
          return responseData.data;
        }
      }

      // Si no hay datos válidos
      return {
        isValid: false,
        documentMatches: false,
        businessNameMatches: false,
        message: responseData?.message || 'Error al verificar los datos'
      };
    } catch (error: any) {
      console.error('Error verifying RNT with document:', error);

      // Intentar extraer mensaje de error del backend
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Error al verificar los datos. Por favor intenta nuevamente.';

      return {
        isValid: false,
        documentMatches: false,
        businessNameMatches: false,
        message: errorMessage
      };
    }
  },

  /**
   * Obtiene información detallada de un RNT
   */
  async getRNTDetails(rntNumber: string): Promise<any> {
    const response = await api.get(`/rnt/${rntNumber}`);
    return response.data;
  }
};
