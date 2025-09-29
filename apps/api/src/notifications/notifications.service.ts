import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { EmailProvider } from './providers/email.provider';
import { SmsProvider } from './providers/sms.provider';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications') private notificationQueue: Queue,
    private emailProvider: EmailProvider,
    private smsProvider: SmsProvider,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: createNotificationDto,
    });

    // Queue the notification for processing
    await this.notificationQueue.add('send', {
      notificationId: notification.id,
    });

    return notification;
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { status: 'SENT' },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, status: 'PENDING' },
      data: { status: 'SENT' },
    });
  }

  async sendOtp(user: any, otp: string) {
    const subject = 'Password Reset OTP';
    const body = `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`;

    // Send via email
    await this.emailProvider.send({
      to: user.email,
      subject,
      text: body,
    });

    // Send via SMS if phone number exists
    if (user.phone) {
      await this.smsProvider.send({
        to: user.phone,
        message: body,
      });
    }
  }

  async notifyRateRequestCreated(rateRequest: any, pricingUsers: any[]) {
    const subject = 'New Rate Request Created';
    const body = `A new rate request ${rateRequest.refNo} has been created and requires pricing team attention.`;

    for (const user of pricingUsers) {
      await this.create({
        userId: user.id,
        channel: 'SYSTEM',
        subject,
        body,
        meta: {
          type: 'rate_request_created',
          rateRequestId: rateRequest.id,
        },
      });

      // Send email notification
      await this.emailProvider.send({
        to: user.email,
        subject,
        text: body,
      });

      // Send SMS if phone exists
      if (user.phone) {
        await this.smsProvider.send({
          to: user.phone,
          message: body,
        });
      }
    }
  }

  async notifyRateRequestResponse(rateRequest: any, salesperson: any) {
    const subject = 'Rate Request Response Received';
    const body = `Your rate request ${rateRequest.refNo} has received a response from the pricing team.`;

    await this.create({
      userId: salesperson.id,
      channel: 'SYSTEM',
      subject,
      body,
      meta: {
        type: 'rate_request_response',
        rateRequestId: rateRequest.id,
      },
    });

    // Send email notification
    await this.emailProvider.send({
      to: salesperson.email,
      subject,
      text: body,
    });

    // Send SMS if phone exists
    if (salesperson.phone) {
      await this.smsProvider.send({
        to: salesperson.phone,
        message: body,
      });
    }
  }

  async notifyItinerarySubmitted(itinerary: any, approver: any) {
    const subject = 'Itinerary Submitted for Approval';
    const body = `An itinerary has been submitted for your approval.`;

    await this.create({
      userId: approver.id,
      channel: 'SYSTEM',
      subject,
      body,
      meta: {
        type: 'itinerary_submitted',
        itineraryId: itinerary.id,
      },
    });

    // Send email notification
    await this.emailProvider.send({
      to: approver.email,
      subject,
      text: body,
    });
  }

  async notifyBookingConfirmed(bookingRequest: any, salesperson: any) {
    const subject = 'Booking Request Confirmed';
    const body = `Your booking request has been confirmed.`;

    await this.create({
      userId: salesperson.id,
      channel: 'SYSTEM',
      subject,
      body,
      meta: {
        type: 'booking_confirmed',
        bookingRequestId: bookingRequest.id,
      },
    });

    // Send email notification
    await this.emailProvider.send({
      to: salesperson.email,
      subject,
      text: body,
    });
  }

  async notifyRoReceived(bookingRequest: any, cseUsers: any[]) {
    const subject = 'RO Document Received';
    const body = `RO document has been received for booking request.`;

    for (const user of cseUsers) {
      await this.create({
        userId: user.id,
        channel: 'SYSTEM',
        subject,
        body,
        meta: {
          type: 'ro_received',
          bookingRequestId: bookingRequest.id,
        },
      });

      // Send email notification
      await this.emailProvider.send({
        to: user.email,
        subject,
        text: body,
      });
    }
  }
}