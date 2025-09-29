import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoDocumentDto {
  @ApiProperty({ example: 'RO123456789' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'https://example.com/ro-document.pdf', required: false })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}