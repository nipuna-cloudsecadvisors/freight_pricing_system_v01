import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsNotEmpty } from 'class-validator';

export class CompleteJobDto {
  @ApiProperty({ 
    example: {
      containerNumber: 'MSCU1234567',
      sealNumber: 'SL123456',
      vesselName: 'MSC LORETO',
      voyage: '001E',
      eta: '2024-02-15T08:00:00Z',
      etd: '2024-02-10T12:00:00Z',
      finalDestination: 'Hamburg',
      notes: 'Job completed successfully'
    }
  })
  @IsObject()
  @IsNotEmpty()
  details: any;
}