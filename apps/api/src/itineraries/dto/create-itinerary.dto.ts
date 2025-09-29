import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { ItineraryType } from '@prisma/client';

export class CreateItineraryDto {
  @ApiProperty({ enum: ItineraryType, example: ItineraryType.SP })
  @IsEnum(ItineraryType)
  @IsNotEmpty()
  type: ItineraryType;

  @ApiProperty({ example: '2024-02-05T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  weekStart: string;
}