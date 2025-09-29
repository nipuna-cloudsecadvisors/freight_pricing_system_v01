import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ConfirmBookingDto {
  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  overrideValidity?: boolean;
}