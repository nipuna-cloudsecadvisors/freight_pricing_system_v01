import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@freight.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '192.168.1.1', required: false })
  @IsString()
  @IsOptional()
  ip?: string;
}