import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async send(message: EmailMessage): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
      console.log(`📧 Email sent to ${message.to}`);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw error;
    }
  }

  async sendBulk(messages: EmailMessage[]): Promise<void> {
    const promises = messages.map(message => this.send(message));
    await Promise.all(promises);
  }
}