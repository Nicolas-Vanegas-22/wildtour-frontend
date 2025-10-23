/**
 * Reports Repository
 * TODO: Integrate with backend API
 */

export interface ReportData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface AnalyticsMetrics {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  bookingGrowth: number;
  revenueGrowth: number;
}

export class ReportsRepo {
  /**
   * Get analytics metrics
   */
  static async getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
    console.warn('ReportsRepo.getAnalyticsMetrics not implemented - using mock data');

    return {
      totalUsers: 1542,
      totalBookings: 847,
      totalRevenue: 125600000,
      averageBookingValue: 148400,
      bookingGrowth: 12.5,
      revenueGrowth: 18.3,
    };
  }

  /**
   * Get bookings report
   */
  static async getBookingsReport(startDate: string, endDate: string): Promise<ReportData> {
    console.warn('ReportsRepo.getBookingsReport not implemented - using mock data');

    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Reservas',
          data: [65, 78, 90, 81, 95, 105],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
        },
      ],
    };
  }

  /**
   * Get revenue report
   */
  static async getRevenueReport(startDate: string, endDate: string): Promise<ReportData> {
    console.warn('ReportsRepo.getRevenueReport not implemented - using mock data');

    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Ingresos',
          data: [12500000, 15600000, 18900000, 17200000, 21000000, 23400000],
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgb(16, 185, 129)',
        },
      ],
    };
  }
}
