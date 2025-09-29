import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getResponseTimeReport() {
    const rateRequests = await this.prisma.rateRequest.findMany({
      where: {
        status: { in: ['COMPLETED', 'REJECTED'] },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    });

    const responseTimes = rateRequests.map(request => {
      const responseTime = request.updatedAt.getTime() - request.createdAt.getTime();
      return {
        requestId: request.id,
        responseTimeHours: Math.round(responseTime / (1000 * 60 * 60) * 100) / 100,
        status: request.status,
      };
    });

    const averageResponseTime = responseTimes.reduce((sum, rt) => sum + rt.responseTimeHours, 0) / responseTimes.length;

    return {
      averageResponseTimeHours: Math.round(averageResponseTime * 100) / 100,
      totalRequests: rateRequests.length,
      responseTimes,
    };
  }

  async getTopSalesPersons() {
    const topSps = await this.prisma.rateRequest.groupBy({
      by: ['salespersonId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    const spsWithDetails = await Promise.all(
      topSps.map(async (sp) => {
        const user = await this.prisma.user.findUnique({
          where: { id: sp.salespersonId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        return {
          ...sp,
          user,
        };
      })
    );

    return spsWithDetails;
  }

  async getStatusCards() {
    const [pending, processing, rejected, completed] = await Promise.all([
      this.prisma.rateRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.rateRequest.count({ where: { status: 'PROCESSING' } }),
      this.prisma.rateRequest.count({ where: { status: 'REJECTED' } }),
      this.prisma.rateRequest.count({ where: { status: 'COMPLETED' } }),
    ]);

    return {
      pending,
      processing,
      rejected,
      completed,
      total: pending + processing + rejected + completed,
    };
  }

  async getBookingStatusCards() {
    const [pending, confirmed, cancelled] = await Promise.all([
      this.prisma.bookingRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.bookingRequest.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.bookingRequest.count({ where: { status: 'CANCELLED' } }),
    ]);

    return {
      pending,
      confirmed,
      cancelled,
      total: pending + confirmed + cancelled,
    };
  }

  async getItineraryStatusCards() {
    const [draft, submitted, approved, rejected] = await Promise.all([
      this.prisma.itinerary.count({ where: { status: 'DRAFT' } }),
      this.prisma.itinerary.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.itinerary.count({ where: { status: 'APPROVED' } }),
      this.prisma.itinerary.count({ where: { status: 'REJECTED' } }),
    ]);

    return {
      draft,
      submitted,
      approved,
      rejected,
      total: draft + submitted + approved + rejected,
    };
  }
}