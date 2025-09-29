import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { SalesActivityType } from '@prisma/client';

export class CreateSalesActivityDto {
  @ApiProperty({ example: 'customer-id-123', required: false })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ example: 'lead-id-123', required: false })
  @IsString()
  @IsOptional()
  leadId?: string;

  @ApiProperty({ enum: SalesActivityType, example: SalesActivityType.VISIT })
  @IsEnum(SalesActivityType)
  @IsNotEmpty()
  type: SalesActivityType;

  @ApiProperty({ example: '2024-02-06T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Discussed new shipment requirements with customer', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'Customer interested in FCL service', required: false })
  @IsString()
  @IsOptional()
  outcome?: string;

  @ApiProperty({ example: '2024-02-13T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  nextActionDate?: string;
}