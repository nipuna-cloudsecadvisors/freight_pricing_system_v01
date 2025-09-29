import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { BookingRequestSource } from '@prisma/client';

export class CreateBookingRequestDto {
  @ApiProperty({ example: 'customer-id-123' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ enum: BookingRequestSource, example: BookingRequestSource.PREDEFINED })
  @IsEnum(BookingRequestSource)
  @IsNotEmpty()
  rateSource: BookingRequestSource;

  @ApiProperty({ example: 'predefined-rate-id-123' })
  @IsString()
  @IsNotEmpty()
  linkId: string;
}