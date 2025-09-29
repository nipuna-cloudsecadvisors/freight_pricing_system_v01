import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateItineraryItemDto {
  @ApiProperty({ example: '2024-02-06T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'customer-id-123', required: false })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ example: 'lead-id-123', required: false })
  @IsString()
  @IsOptional()
  leadId?: string;

  @ApiProperty({ example: 'Customer visit' })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiProperty({ example: '09:00 AM', required: false })
  @IsString()
  @IsOptional()
  plannedTime?: string;

  @ApiProperty({ example: 'Customer Office, Colombo', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'Discuss new shipment requirements', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}