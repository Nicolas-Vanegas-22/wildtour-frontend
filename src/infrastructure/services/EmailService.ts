/**
 * Email Service
 * TODO: Integrate with email provider (SendGrid, AWS SES, etc.)
 */

export interface EmailParams {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export class EmailService {
  /**
   * Send email
   * TODO: Implement with actual email service
   */
  static async sendEmail(params: EmailParams): Promise<boolean> {
    console.warn('EmailService.sendEmail not implemented - email not sent:', params);

    // Simulate email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock email sent to:', params.to);
        resolve(true);
      }, 500);
    });
  }

  /**
   * Send booking confirmation email
   */
  static async sendBookingConfirmation(
    to: string,
    bookingDetails: any
  ): Promise<boolean> {
    console.warn('EmailService.sendBookingConfirmation not implemented');

    return this.sendEmail({
      to,
      subject: 'Confirmación de Reserva - Wild Tour',
      body: `Tu reserva ha sido confirmada. ID: ${bookingDetails.id}`,
      html: `<h1>¡Reserva Confirmada!</h1><p>ID: ${bookingDetails.id}</p>`,
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordReset(to: string, resetToken: string): Promise<boolean> {
    console.warn('EmailService.sendPasswordReset not implemented');

    return this.sendEmail({
      to,
      subject: 'Restablecer Contraseña - Wild Tour',
      body: `Usa este token para restablecer tu contraseña: ${resetToken}`,
      html: `<h1>Restablecer Contraseña</h1><p>Token: ${resetToken}</p>`,
    });
  }
}
