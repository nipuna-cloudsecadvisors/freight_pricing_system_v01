import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesActivityDto } from './dto/create-sales-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createActivityDto: CreateSalesActivityDto, userId: string) {
    return this.prisma.salesActivity.create({
      data: {
        ...createActivityDto,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: true,
        lead: true,
      },
    });
  }

  async findAll(userId: string, userRole: string) {
    const where: any = {};

    if (userRole === 'SALES' || userRole === 'CSE') {
      where.userId = userId;
    }

    return this.prisma.salesActivity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: true,
        lead: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.salesActivity.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: true,
        lead: true,
      },
    });
  }

  async update(id: string, updateActivityDto: any) {
    return this.prisma.salesActivity.update({
      where: { id },
      data: updateActivityDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: true,
        lead: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.salesActivity.delete({
      where: { id },
    });
  }
}