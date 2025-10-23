/**
 * Payment Repository
 * TODO: Integrate with MercadoPago and backend API
 */

export interface PaymentMethod {
  id: string;
  type: 'card' | 'pse' | 'nequi' | 'daviplata';
  name: string;
  isDefault: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class PaymentRepo {
  /**
   * Process payment
   * TODO: Implement with MercadoPago SDK
   */
  static async processPayment(
    bookingId: string,
    amount: number,
    paymentMethodId: string
  ): Promise<PaymentResult> {
    console.warn('PaymentRepo.processPayment not implemented - using mock data');

    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `txn-${Date.now()}`,
        });
      }, 1000);
    });
  }

  /**
   * Get user payment methods
   */
  static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    console.warn('PaymentRepo.getPaymentMethods not implemented - using mock data');
    return [];
  }

  /**
   * Add payment method
   */
  static async addPaymentMethod(userId: string, method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    console.warn('PaymentRepo.addPaymentMethod not implemented - using mock data');
    return {
      id: `pm-${Date.now()}`,
      ...method,
    };
  }
}
