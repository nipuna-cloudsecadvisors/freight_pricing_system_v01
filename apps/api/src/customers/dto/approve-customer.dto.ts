import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApproveCustomerDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;

  @ApiProperty({ example: 'Customer approved after verification', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}