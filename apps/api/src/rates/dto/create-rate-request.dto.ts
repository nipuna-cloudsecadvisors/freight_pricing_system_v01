import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsNumber, IsDateString, IsObject, Min, Max } from 'class-validator';
import { RateRequestMode, RateRequestType } from '@prisma/client';

export class CreateRateRequestDto {
  @ApiProperty({ enum: RateRequestMode, example: RateRequestMode.SEA })
  @IsEnum(RateRequestMode)
  @IsNotEmpty()
  mode: RateRequestMode;

  @ApiProperty({ enum: RateRequestType, example: RateRequestType.FCL })
  @IsEnum(RateRequestType)
  @IsNotEmpty()
  type: RateRequestType;

  @ApiProperty({ example: 'port-id-123', required: false })
  @IsString()
  @IsOptional()
  polId?: string;

  @ApiProperty({ example: 'port-id-456' })
  @IsString()
  @IsNotEmpty()
  podId: string;

  @ApiProperty({ example: 'DOOR', required: false })
  @IsString()
  @IsOptional()
  doorOrCy?: string;

  @ApiProperty({ example: '90210', required: false })
  @IsString()
  @IsOptional()
  usZip?: string;

  @ApiProperty({ example: 'shipping-line-id-123', required: false })
  @IsString()
  @IsOptional()
  preferredLineId?: string;

  @ApiProperty({ example: 'equipment-type-id-123', required: false })
  @IsString()
  @IsOptional()
  equipTypeId?: string;

  @ApiProperty({ example: -18, required: false })
  @IsNumber()
  @IsOptional()
  @Min(-30)
  @Max(30)
  reeferTemp?: number;

  @ApiProperty({ example: 20, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  palletCount?: number;

  @ApiProperty({ example: '120x80x144 cm', required: false })
  @IsString()
  @IsOptional()
  palletDims?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsString()
  @IsOptional()
  hsCode?: string;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.1)
  weightTons: number;

  @ApiProperty({ example: 'FOB' })
  @IsString()
  @IsNotEmpty()
  incoterm: string;

  @ApiProperty({ example: 2500, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  marketRate?: number;

  @ApiProperty({ example: 'Urgent shipment, please prioritize', required: false })
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @ApiProperty({ example: '2024-02-01T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  cargoReadyDate?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  vesselRequired: boolean;

  @ApiProperty({ example: '7', required: false })
  @IsString()
  @IsOptional()
  detentionFreeTime?: string;

  @ApiProperty({ example: 'customer-id-123' })
  @IsString()
  @IsNotEmpty()
  customerId: string;
}