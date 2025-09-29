import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CancelBookingDto {
  @ApiProperty({ example: 'Customer requested cancellation due to change in requirements' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}