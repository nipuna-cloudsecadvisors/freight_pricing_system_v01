import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { CreateItineraryItemDto } from './dto/create-itinerary-item.dto';
import { ApproveItineraryDto } from './dto/approve-itinerary.dto';

@Injectable()
export class ItinerariesService {
  constructor(private prisma: PrismaService) {}

  async create(createItineraryDto: CreateItineraryDto, ownerId: string) {
    return this.prisma.itinerary.create({
      data: {
        ...createItineraryDto,
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            customer: true,
            lead: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, userRole: string) {
    const where: any = {};

    if (userRole === 'SBU_HEAD') {
      // SBU Head can see all itineraries in their SBU
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { sbu: true },
      });

      if (user?.sbuId) {
        where.owner = { sbuId: user.sbuId };
      }
    } else {
      where.ownerId = userId;
    }

    return this.prisma.itinerary.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            customer: true,
            lead: true,
          },
        },
      },
      orderBy: { weekStart: 'desc' },
    });
  }

  async findById(id: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            customer: true,
            lead: true,
          },
        },
      },
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    return itinerary;
  }

  async update(id: string, updateItineraryDto: UpdateItineraryDto, userId: string) {
    const itinerary = await this.findById(id);

    if (itinerary.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own itineraries');
    }

    if (itinerary.status !== 'DRAFT') {
      throw new ForbiddenException('Can only update draft itineraries');
    }

    return this.prisma.itinerary.update({
      where: { id },
      data: updateItineraryDto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            customer: true,
            lead: true,
          },
        },
      },
    });
  }

  async submit(id: string, userId: string) {
    const itinerary = await this.findById(id);

    if (itinerary.ownerId !== userId) {
      throw new ForbiddenException('You can only submit your own itineraries');
    }

    if (itinerary.status !== 'DRAFT') {
      throw new ForbiddenException('Can only submit draft itineraries');
    }

    return this.prisma.itinerary.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });
  }

  async approve(id: string, approveItineraryDto: ApproveItineraryDto, approverId: string) {
    const itinerary = await this.findById(id);

    if (itinerary.status !== 'SUBMITTED') {
      throw new ForbiddenException('Can only approve submitted itineraries');
    }

    return this.prisma.itinerary.update({
      where: { id },
      data: {
        status: approveItineraryDto.approved ? 'APPROVED' : 'REJECTED',
        approverId,
        approveNote: approveItineraryDto.note,
        decidedAt: new Date(),
      },
    });
  }

  async remove(id: string, userId: string) {
    const itinerary = await this.findById(id);

    if (itinerary.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own itineraries');
    }

    if (itinerary.status !== 'DRAFT') {
      throw new ForbiddenException('Can only delete draft itineraries');
    }

    return this.prisma.itinerary.delete({
      where: { id },
    });
  }

  // Itinerary Items
  async createItem(itineraryId: string, createItemDto: CreateItineraryItemDto) {
    const itinerary = await this.findById(itineraryId);

    if (itinerary.status !== 'DRAFT') {
      throw new ForbiddenException('Can only add items to draft itineraries');
    }

    return this.prisma.itineraryItem.create({
      data: {
        ...createItemDto,
        itineraryId,
      },
      include: {
        customer: true,
        lead: true,
      },
    });
  }

  async updateItem(itemId: string, updateItemDto: any) {
    return this.prisma.itineraryItem.update({
      where: { id: itemId },
      data: updateItemDto,
      include: {
        customer: true,
        lead: true,
      },
    });
  }

  async removeItem(itemId: string) {
    return this.prisma.itineraryItem.delete({
      where: { id: itemId },
    });
  }
}