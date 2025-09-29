import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApproveItineraryDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;

  @ApiProperty({ example: 'Itinerary looks good, approved', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}