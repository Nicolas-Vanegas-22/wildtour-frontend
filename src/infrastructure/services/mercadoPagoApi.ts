// MercadoPago Integration Service
// Para producción, necesitarás instalar el SDK: npm install @mercadopago/sdk-js

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface PaymentData {
  items: Array<{
    id: string;
    title: string;
    description: string;
    picture_url?: string;
    category_id: string;
    quantity: number;
    currency_id: string;
    unit_price: number;
  }>;
  payer: {
    name: string;
    surname: string;
    email: string;
    phone?: {
      area_code: string;
      number: string;
    };
    identification?: {
      type: string;
      number: string;
    };
    address?: {
      street_name: string;
      street_number: number;
      zip_code: string;
    };
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: 'approved' | 'all';
  payment_methods: {
    excluded_payment_methods: Array<{ id: string }>;
    excluded_payment_types: Array<{ id: string }>;
    installments: number;
  };
  notification_url?: string;
  statement_descriptor: string;
  external_reference: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

export interface PaymentStatus {
  collection_id: string;
  collection_status: 'approved' | 'pending' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';
  payment_id: string;
  status: 'approved' | 'pending' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';
  external_reference: string;
  payment_type: 'account_money' | 'ticket' | 'bank_transfer' | 'atm' | 'credit_card' | 'debit_card' | 'prepaid_card';
  merchant_order_id: string;
  preference_id: string;
  site_id: string;
  processing_mode: 'aggregator' | 'gateway';
  merchant_account_id: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || 'TEST-your-public-key';
const USE_SANDBOX = import.meta.env.VITE_MERCADO_PAGO_SANDBOX === 'true';

class MercadoPagoApi {
  private mp: any = null;

  constructor() {
    this.initializeMercadoPago();
  }

  private async initializeMercadoPago() {
    try {
      // En producción, cargar el SDK dinámicamente
      if (typeof window !== 'undefined') {
        // Simular la carga del SDK para desarrollo
        console.log('MercadoPago SDK initialized with key:', MERCADO_PAGO_PUBLIC_KEY);

        // En producción, harías algo como:
        // const script = document.createElement('script');
        // script.src = 'https://sdk.mercadopago.com/js/v2';
        // document.body.appendChild(script);
        //
        // script.onload = () => {
        //   this.mp = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY, {
        //     locale: 'es-CO'
        //   });
        // };
      }
    } catch (error) {
      console.error('Error initializing MercadoPago:', error);
    }
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Crear preferencia de pago
  async createPreference(paymentData: PaymentData): Promise<MercadoPagoPreference> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/mercadopago/preference`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const preference = await response.json();

      // Para desarrollo, simular una preferencia
      if (!preference.id) {
        return {
          id: `PREF_${Date.now()}`,
          init_point: `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=PREF_${Date.now()}`,
          sandbox_init_point: `https://sandbox.mercadopago.com.co/checkout/v1/redirect?pref_id=PREF_${Date.now()}`
        };
      }

      return preference;
    } catch (error) {
      console.error('Error creating MercadoPago preference:', error);
      throw error;
    }
  }

  // Procesar pago con tarjeta de crédito
  async processCardPayment(paymentData: {
    token: string;
    transaction_amount: number;
    description: string;
    payment_method_id: string;
    payer: {
      email: string;
      identification: {
        type: string;
        number: string;
      };
    };
    external_reference: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/mercadopago/process`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing card payment:', error);
      throw error;
    }
  }

  // Verificar estado del pago
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/mercadopago/status/${paymentId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  // Crear token de tarjeta de crédito
  async createCardToken(cardData: {
    cardNumber: string;
    cardholderName: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    securityCode: string;
    identificationType: string;
    identificationNumber: string;
  }): Promise<{ id: string }> {
    return new Promise((resolve, reject) => {
      if (!this.mp) {
        // Simular token para desarrollo
        setTimeout(() => {
          resolve({ id: `CARD_TOKEN_${Date.now()}` });
        }, 1000);
        return;
      }

      // En producción usarías el SDK real:
      // this.mp.createCardToken({
      //   cardNumber: cardData.cardNumber,
      //   cardholderName: cardData.cardholderName,
      //   cardExpirationMonth: cardData.cardExpirationMonth,
      //   cardExpirationYear: cardData.cardExpirationYear,
      //   securityCode: cardData.securityCode,
      //   identificationType: cardData.identificationType,
      //   identificationNumber: cardData.identificationNumber,
      // }, (error: any, token: any) => {
      //   if (error) {
      //     reject(error);
      //   } else {
      //     resolve(token);
      //   }
      // });
    });
  }

  // Obtener métodos de pago disponibles
  async getPaymentMethods(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/mercadopago/payment-methods`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const methods = await response.json();

      // Para desarrollo, devolver métodos simulados
      if (!methods || methods.length === 0) {
        return [
          {
            id: 'visa',
            name: 'Visa',
            payment_type_id: 'credit_card',
            thumbnail: 'https://img.icons8.com/color/48/000000/visa.png',
            secure_thumbnail: 'https://img.icons8.com/color/48/000000/visa.png'
          },
          {
            id: 'master',
            name: 'Mastercard',
            payment_type_id: 'credit_card',
            thumbnail: 'https://img.icons8.com/color/48/000000/mastercard.png',
            secure_thumbnail: 'https://img.icons8.com/color/48/000000/mastercard.png'
          },
          {
            id: 'amex',
            name: 'American Express',
            payment_type_id: 'credit_card',
            thumbnail: 'https://img.icons8.com/color/48/000000/amex.png',
            secure_thumbnail: 'https://img.icons8.com/color/48/000000/amex.png'
          },
          {
            id: 'pse',
            name: 'PSE',
            payment_type_id: 'bank_transfer',
            thumbnail: 'https://img.icons8.com/color/48/000000/bank.png',
            secure_thumbnail: 'https://img.icons8.com/color/48/000000/bank.png'
          }
        ];
      }

      return methods;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  // Obtener cuotas disponibles
  async getInstallments(paymentMethodId: string, amount: number): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/mercadopago/installments?payment_method_id=${paymentMethodId}&amount=${amount}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting installments:', error);
      throw error;
    }
  }

  // Crear orden de pago simplificada para checkout
  async createSimplePayment(bookingId: string, amount: number): Promise<{ checkoutUrl: string }> {
    try {
      // Simular creación de orden de pago
      await new Promise(resolve => setTimeout(resolve, 1000));

      const checkoutUrl = USE_SANDBOX
        ? `https://sandbox.mercadopago.com.co/checkout/v1/redirect?pref_id=BOOKING_${bookingId}`
        : `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=BOOKING_${bookingId}`;

      return { checkoutUrl };
    } catch (error) {
      console.error('Error creating simple payment:', error);
      throw error;
    }
  }

  // Webhook para procesar notificaciones de MercadoPago
  async processWebhookNotification(data: any): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/payments/mercadopago/webhook`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error processing webhook notification:', error);
      throw error;
    }
  }
}

export const mercadoPagoApi = new MercadoPagoApi();