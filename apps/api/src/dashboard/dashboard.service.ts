import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as sharp from 'sharp';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: string, userRole: string) {
    const [
      rateRequestStats,
      bookingStats,
      itineraryStats,
      recentActivities,
      notifications,
    ] = await Promise.all([
      this.getRateRequestStats(userId, userRole),
      this.getBookingStats(userId, userRole),
      this.getItineraryStats(userId, userRole),
      this.getRecentActivities(userId, userRole),
      this.getNotifications(userId),
    ]);

    return {
      rateRequestStats,
      bookingStats,
      itineraryStats,
      recentActivities,
      notifications,
    };
  }

  private async getRateRequestStats(userId: string, userRole: string) {
    const where: any = {};
    
    if (userRole === 'SALES') {
      where.salespersonId = userId;
    }

    const [pending, processing, completed, rejected] = await Promise.all([
      this.prisma.rateRequest.count({ where: { ...where, status: 'PENDING' } }),
      this.prisma.rateRequest.count({ where: { ...where, status: 'PROCESSING' } }),
      this.prisma.rateRequest.count({ where: { ...where, status: 'COMPLETED' } }),
      this.prisma.rateRequest.count({ where: { ...where, status: 'REJECTED' } }),
    ]);

    return { pending, processing, completed, rejected };
  }

  private async getBookingStats(userId: string, userRole: string) {
    const where: any = {};
    
    if (userRole === 'SALES') {
      where.raisedById = userId;
    }

    const [pending, confirmed, cancelled] = await Promise.all([
      this.prisma.bookingRequest.count({ where: { ...where, status: 'PENDING' } }),
      this.prisma.bookingRequest.count({ where: { ...where, status: 'CONFIRMED' } }),
      this.prisma.bookingRequest.count({ where: { ...where, status: 'CANCELLED' } }),
    ]);

    return { pending, confirmed, cancelled };
  }

  private async getItineraryStats(userId: string, userRole: string) {
    const where: any = {};
    
    if (userRole === 'SALES' || userRole === 'CSE') {
      where.ownerId = userId;
    }

    const [draft, submitted, approved, rejected] = await Promise.all([
      this.prisma.itinerary.count({ where: { ...where, status: 'DRAFT' } }),
      this.prisma.itinerary.count({ where: { ...where, status: 'SUBMITTED' } }),
      this.prisma.itinerary.count({ where: { ...where, status: 'APPROVED' } }),
      this.prisma.itinerary.count({ where: { ...where, status: 'REJECTED' } }),
    ]);

    return { draft, submitted, approved, rejected };
  }

  private async getRecentActivities(userId: string, userRole: string) {
    const where: any = {};
    
    if (userRole === 'SALES' || userRole === 'CSE') {
      where.userId = userId;
    }

    return this.prisma.salesActivity.findMany({
      where,
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });
  }

  private async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
  }

  async exportDashboardToJpeg() {
    // This is a placeholder - in a real implementation, you would:
    // 1. Generate dashboard HTML/CSS
    // 2. Use a headless browser (Puppeteer) to render it
    // 3. Convert to JPEG using sharp
    
    const dashboardData = {
      title: 'Freight Pricing Dashboard',
      timestamp: new Date().toISOString(),
      // Add more dashboard data here
    };

    // For now, return a simple text-based "image"
    const text = `Dashboard Export\n${JSON.stringify(dashboardData, null, 2)}`;
    
    // In a real implementation, you would use Puppeteer + sharp here
    return {
      message: 'Dashboard export functionality would be implemented with Puppeteer + sharp',
      data: text,
    };
  }
}