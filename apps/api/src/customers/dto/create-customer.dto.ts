import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'ABC Trading Company' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'Mr. Rajesh Kumar' })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @ApiProperty({ example: 'rajesh@abctrading.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+94112345678', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '123 Main Street, Colombo 03', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Colombo', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Sri Lanka', required: false })
  @IsString()
  @IsOptional()
  country?: string;
}