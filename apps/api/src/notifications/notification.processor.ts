import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { EmailProvider } from './providers/email.provider';
import { SmsProvider } from './providers/sms.provider';

@Processor('notifications')
export class NotificationProcessor {
  constructor(
    private prisma: PrismaService,
    private emailProvider: EmailProvider,
    private smsProvider: SmsProvider,
  ) {}

  @Process('send')
  async handleSendNotification(job: Job<{ notificationId: string }>) {
    const { notificationId } = job.data;

    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
        include: { user: true },
      });

      if (!notification) {
        throw new Error(`Notification ${notificationId} not found`);
      }

      // Send based on channel
      switch (notification.channel) {
        case 'EMAIL':
          await this.emailProvider.send({
            to: notification.user.email,
            subject: notification.subject,
            text: notification.body,
          });
          break;
        case 'SMS':
          if (notification.user.phone) {
            await this.smsProvider.send({
              to: notification.user.phone,
              message: notification.body,
            });
          }
          break;
        case 'SYSTEM':
          // System notifications are already stored in DB
          break;
      }

      // Update notification status
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      console.log(`✅ Notification ${notificationId} sent successfully`);
    } catch (error) {
      console.error(`❌ Failed to send notification ${notificationId}:`, error);
      
      // Update notification status to failed
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  }
}