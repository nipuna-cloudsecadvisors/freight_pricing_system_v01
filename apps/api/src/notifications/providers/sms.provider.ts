import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SmsMessage {
  to: string;
  message: string;
}

@Injectable()
export class SmsProvider {
  constructor(private configService: ConfigService) {}

  async send(message: SmsMessage): Promise<void> {
    const provider = this.configService.get<string>('SMS_PROVIDER', 'dummy');
    
    switch (provider) {
      case 'dummy':
        await this.sendDummy(message);
        break;
      case 'twilio':
        await this.sendTwilio(message);
        break;
      case 'aws-sns':
        await this.sendAwsSns(message);
        break;
      default:
        console.warn(`Unknown SMS provider: ${provider}`);
    }
  }

  private async sendDummy(message: SmsMessage): Promise<void> {
    console.log(`📱 SMS (Dummy): ${message.to} - ${message.message}`);
  }

  private async sendTwilio(message: SmsMessage): Promise<void> {
    // TODO: Implement Twilio SMS
    console.log(`📱 SMS (Twilio): ${message.to} - ${message.message}`);
  }

  private async sendAwsSns(message: SmsMessage): Promise<void> {
    // TODO: Implement AWS SNS SMS
    console.log(`📱 SMS (AWS SNS): ${message.to} - ${message.message}`);
  }

  async sendBulk(messages: SmsMessage[]): Promise<void> {
    const promises = messages.map(message => this.send(message));
    await Promise.all(promises);
  }
}