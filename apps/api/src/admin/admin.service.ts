import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getSystemStats() {
    const [
      totalUsers,
      totalCustomers,
      totalRateRequests,
      totalBookings,
      totalItineraries,
      totalActivities,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.customer.count(),
      this.prisma.rateRequest.count(),
      this.prisma.bookingRequest.count(),
      this.prisma.itinerary.count(),
      this.prisma.salesActivity.count(),
    ]);

    return {
      totalUsers,
      totalCustomers,
      totalRateRequests,
      totalBookings,
      totalItineraries,
      totalActivities,
    };
  }

  async getAuditLogs(filters: any) {
    const where: any = {};

    if (filters.actorId) {
      where.actorId = filters.actorId;
    }

    if (filters.entity) {
      where.entity = filters.entity;
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.fromDate) {
      where.ts = {
        gte: new Date(filters.fromDate),
      };
    }

    if (filters.toDate) {
      where.ts = {
        ...where.ts,
        lte: new Date(filters.toDate),
      };
    }

    return this.prisma.auditEvent.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { ts: 'desc' },
      take: 100,
    });
  }

  async searchGlobal(query: string) {
    const results = {
      users: [],
      customers: [],
      rateRequests: [],
      bookingRequests: [],
      itineraries: [],
    };

    // Search users
    results.users = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      take: 10,
    });

    // Search customers
    results.customers = await this.prisma.customer.findMany({
      where: {
        OR: [
          { companyName: { contains: query, mode: 'insensitive' } },
          { contactPerson: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        companyName: true,
        contactPerson: true,
        email: true,
        approvalStatus: true,
      },
      take: 10,
    });

    // Search rate requests
    results.rateRequests = await this.prisma.rateRequest.findMany({
      where: {
        refNo: { contains: query, mode: 'insensitive' },
      },
      select: {
        id: true,
        refNo: true,
        mode: true,
        type: true,
        status: true,
        createdAt: true,
      },
      take: 10,
    });

    // Search booking requests
    results.bookingRequests = await this.prisma.bookingRequest.findMany({
      where: {
        id: { contains: query, mode: 'insensitive' },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
      take: 10,
    });

    // Search itineraries
    results.itineraries = await this.prisma.itinerary.findMany({
      where: {
        id: { contains: query, mode: 'insensitive' },
      },
      select: {
        id: true,
        type: true,
        status: true,
        weekStart: true,
      },
      take: 10,
    });

    return results;
  }

  async getSystemConfig() {
    // This would typically come from a configuration table or environment variables
    return {
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        from: process.env.SMTP_FROM,
      },
      sms: {
        provider: process.env.SMS_PROVIDER,
        apiKey: process.env.SMS_API_KEY ? '***' : null,
      },
      app: {
        webUrl: process.env.WEB_URL,
        apiUrl: process.env.API_URL,
      },
    };
  }

  async updateSystemConfig(config: any) {
    // This would typically update a configuration table
    // For now, just return the config
    return {
      message: 'System configuration updated successfully',
      config,
    };
  }
}