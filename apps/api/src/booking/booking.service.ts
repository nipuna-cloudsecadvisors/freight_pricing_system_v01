import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateRoDocumentDto } from './dto/create-ro-document.dto';
import { CompleteJobDto } from './dto/complete-job.dto';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createBookingRequest(createBookingRequestDto: CreateBookingRequestDto, raisedById: string) {
    // Validate the source and link
    if (createBookingRequestDto.rateSource === 'PREDEFINED') {
      const predefinedRate = await this.prisma.predefinedRate.findUnique({
        where: { id: createBookingRequestDto.linkId },
      });
      if (!predefinedRate) {
        throw new NotFoundException('Predefined rate not found');
      }
    } else if (createBookingRequestDto.rateSource === 'REQUEST') {
      const rateRequest = await this.prisma.rateRequest.findUnique({
        where: { id: createBookingRequestDto.linkId },
      });
      if (!rateRequest) {
        throw new NotFoundException('Rate request not found');
      }
    }

    return this.prisma.bookingRequest.create({
      data: {
        ...createBookingRequestDto,
        raisedById,
      },
      include: {
        raisedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: true,
      },
    });
  }

  async getBookingRequests(filters: any, userId: string, userRole: string) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.mine === 'true' || userRole === 'SALES') {
      where.raisedById = userId;
    }

    return this.prisma.bookingRequest.findMany({
      where,
      include: {
        raisedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: true,
        roDocuments: true,
        jobs: {
          include: {
            openedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            completions: {
              include: {
                cseUser: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingRequestById(id: string) {
    const bookingRequest = await this.prisma.bookingRequest.findUnique({
      where: { id },
      include: {
        raisedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: true,
        roDocuments: true,
        jobs: {
          include: {
            openedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            completions: {
              include: {
                cseUser: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!bookingRequest) {
      throw new NotFoundException('Booking request not found');
    }

    return bookingRequest;
  }

  async confirmBooking(id: string, confirmBookingDto: ConfirmBookingDto, userId: string) {
    const bookingRequest = await this.getBookingRequestById(id);

    if (bookingRequest.status !== 'PENDING') {
      throw new ForbiddenException('Booking request is not pending');
    }

    // Check quote validity if not overridden
    if (!confirmBookingDto.overrideValidity) {
      // TODO: Implement quote validity check
    }

    const updatedBooking = await this.prisma.bookingRequest.update({
      where: { id },
      data: { status: 'CONFIRMED' },
      include: {
        raisedBy: true,
        customer: true,
      },
    });

    // Notify salesperson
    await this.notificationsService.notifyBookingConfirmed(updatedBooking, updatedBooking.raisedBy);

    return updatedBooking;
  }

  async cancelBooking(id: string, cancelBookingDto: CancelBookingDto, userId: string) {
    const bookingRequest = await this.getBookingRequestById(id);

    if (bookingRequest.status === 'CANCELLED') {
      throw new ForbiddenException('Booking request is already cancelled');
    }

    return this.prisma.bookingRequest.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelReason: cancelBookingDto.reason,
      },
    });
  }

  async addRoDocument(id: string, createRoDocumentDto: CreateRoDocumentDto) {
    const bookingRequest = await this.getBookingRequestById(id);

    if (bookingRequest.status !== 'CONFIRMED') {
      throw new ForbiddenException('Booking request must be confirmed to add RO document');
    }

    const roDocument = await this.prisma.roDocument.create({
      data: {
        ...createRoDocumentDto,
        bookingRequestId: id,
      },
    });

    // Notify CSE users
    const cseUsers = await this.prisma.user.findMany({
      where: { role: 'CSE' },
    });

    if (cseUsers.length > 0) {
      await this.notificationsService.notifyRoReceived(bookingRequest, cseUsers);
    }

    return roDocument;
  }

  async openErpJob(id: string, erpJobNo: string, openedById: string) {
    const bookingRequest = await this.getBookingRequestById(id);

    if (bookingRequest.status !== 'CONFIRMED') {
      throw new ForbiddenException('Booking request must be confirmed to open ERP job');
    }

    return this.prisma.job.create({
      data: {
        bookingRequestId: id,
        erpJobNo,
        openedById,
      },
      include: {
        openedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async completeJob(jobId: string, completeJobDto: CompleteJobDto, cseUserId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return this.prisma.jobCompletion.create({
      data: {
        jobId,
        cseUserId,
        detailsJson: completeJobDto.details,
      },
      include: {
        cseUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getJobs(filters: any, userId: string, userRole: string) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (userRole === 'CSE') {
      where.openedById = userId;
    }

    return this.prisma.job.findMany({
      where,
      include: {
        bookingRequest: {
          include: {
            customer: true,
            raisedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        openedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        completions: {
          include: {
            cseUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { openedAt: 'desc' },
    });
  }
}