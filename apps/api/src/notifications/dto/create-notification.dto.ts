import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject } from 'class-validator';
import { NotificationChannel } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: NotificationChannel, example: NotificationChannel.SYSTEM })
  @IsEnum(NotificationChannel)
  @IsNotEmpty()
  channel: NotificationChannel;

  @ApiProperty({ example: 'New Rate Request' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'A new rate request has been created' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ example: { type: 'rate_request', id: '123' }, required: false })
  @IsObject()
  @IsOptional()
  meta?: any;
}