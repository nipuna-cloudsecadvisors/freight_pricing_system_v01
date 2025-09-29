import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ConfirmOtpDto {
  @ApiProperty({ example: 'admin@freight.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}