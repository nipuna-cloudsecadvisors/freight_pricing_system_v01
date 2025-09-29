import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({ example: 'admin@freight.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}