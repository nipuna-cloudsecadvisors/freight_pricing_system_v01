import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreatePredefinedRateDto {
  @ApiProperty({ example: 'trade-lane-id-123' })
  @IsString()
  @IsNotEmpty()
  tradeLaneId: string;

  @ApiProperty({ example: 'port-id-123' })
  @IsString()
  @IsNotEmpty()
  polId: string;

  @ApiProperty({ example: 'port-id-456' })
  @IsString()
  @IsNotEmpty()
  podId: string;

  @ApiProperty({ example: 'Weekly Service' })
  @IsString()
  @IsNotEmpty()
  service: string;

  @ApiProperty({ example: 'equipment-type-id-123' })
  @IsString()
  @IsNotEmpty()
  equipTypeId: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  isLcl: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  validFrom: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  @IsNotEmpty()
  validTo: string;

  @ApiProperty({ example: 'Direct service via MSC', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}