import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsObject, Min } from 'class-validator';

export class RespondToRateRequestDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  lineNo: number;

  @ApiProperty({ example: 'shipping-line-id-123', required: false })
  @IsString()
  @IsOptional()
  requestedLineId?: string;

  @ApiProperty({ example: 'equipment-type-id-123', required: false })
  @IsString()
  @IsOptional()
  requestedEquipTypeId?: string;

  @ApiProperty({ example: 'MSC LORETO', required: false })
  @IsString()
  @IsOptional()
  vesselName?: string;

  @ApiProperty({ example: '2024-02-15T08:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  eta?: string;

  @ApiProperty({ example: '2024-02-10T12:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  etd?: string;

  @ApiProperty({ example: '2024-02-08T18:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  fclCutoff?: string;

  @ApiProperty({ example: '2024-02-09T12:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  docCutoff?: string;

  @ApiProperty({ example: '2024-03-01T23:59:59Z' })
  @IsDateString()
  @IsNotEmpty()
  validTo: string;

  @ApiProperty({ 
    example: {
      oceanFreight: 1200,
      thc: 150,
      documentation: 50,
      total: 1400
    }
  })
  @IsObject()
  @IsNotEmpty()
  chargesJson: any;
}