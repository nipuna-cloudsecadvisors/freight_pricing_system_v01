import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsObject } from 'class-validator';

export class CreateLineQuoteDto {
  @ApiProperty({ example: 'shipping-line-id-123' })
  @IsString()
  @IsNotEmpty()
  lineId: string;

  @ApiProperty({ example: 'equipment-type-id-123', required: false })
  @IsString()
  @IsOptional()
  equipTypeId?: string;

  @ApiProperty({ 
    example: {
      oceanFreight: 1200,
      thc: 150,
      documentation: 50,
      total: 1400,
      validity: '30 days',
      terms: 'FOB Colombo'
    }
  })
  @IsObject()
  @IsNotEmpty()
  termsJson: any;

  @ApiProperty({ example: '2024-03-01T23:59:59Z' })
  @IsDateString()
  @IsNotEmpty()
  validTo: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  selected: boolean;
}