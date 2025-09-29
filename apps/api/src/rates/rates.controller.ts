import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { RatesService } from './rates.service';
import { CreatePredefinedRateDto } from './dto/create-predefined-rate.dto';
import { CreateRateRequestDto } from './dto/create-rate-request.dto';
import { RespondToRateRequestDto } from './dto/respond-to-rate-request.dto';
import { CreateLineQuoteDto } from './dto/create-line-quote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Rates')
@Controller('rates')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  // Predefined Rates
  @Get('predefined')
  @ApiOperation({ summary: 'Get predefined rates' })
  @ApiResponse({ status: 200, description: 'Predefined rates retrieved successfully' })
  getPredefinedRates(@Query() filters: any) {
    return this.ratesService.getPredefinedRates(filters);
  }

  @Post('predefined')
  @Roles(UserRole.PRICING, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create predefined rate' })
  @ApiResponse({ status: 201, description: 'Predefined rate created successfully' })
  createPredefinedRate(@Body() createPredefinedRateDto: CreatePredefinedRateDto) {
    return this.ratesService.createPredefinedRate(createPredefinedRateDto);
  }

  @Post('predefined/:id/request-update')
  @Roles(UserRole.SALES)
  @ApiOperation({ summary: 'Request rate update' })
  @ApiResponse({ status: 200, description: 'Rate update request sent' })
  requestRateUpdate(@Param('id') id: string, @Request() req) {
    return this.ratesService.requestRateUpdate(id, req.user.id);
  }

  // Rate Requests
  @Post('requests')
  @Roles(UserRole.SALES, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create rate request' })
  @ApiResponse({ status: 201, description: 'Rate request created successfully' })
  createRateRequest(@Body() createRateRequestDto: CreateRateRequestDto, @Request() req) {
    return this.ratesService.createRateRequest(createRateRequestDto, req.user.id);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get rate requests' })
  @ApiResponse({ status: 200, description: 'Rate requests retrieved successfully' })
  getRateRequests(@Query() filters: any, @Request() req) {
    return this.ratesService.getRateRequests(filters, req.user.id, req.user.role);
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get rate request by ID' })
  @ApiResponse({ status: 200, description: 'Rate request retrieved successfully' })
  getRateRequestById(@Param('id') id: string) {
    return this.ratesService.getRateRequestById(id);
  }

  @Post('requests/:id/respond')
  @Roles(UserRole.PRICING, UserRole.ADMIN)
  @ApiOperation({ summary: 'Respond to rate request' })
  @ApiResponse({ status: 201, description: 'Response added successfully' })
  respondToRateRequest(@Param('id') id: string, @Body() respondDto: RespondToRateRequestDto, @Request() req) {
    return this.ratesService.respondToRateRequest(id, respondDto, req.user.id);
  }

  @Post('requests/:id/line-quotes')
  @Roles(UserRole.PRICING, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create line quote' })
  @ApiResponse({ status: 201, description: 'Line quote created successfully' })
  createLineQuote(@Param('id') id: string, @Body() createLineQuoteDto: CreateLineQuoteDto) {
    return this.ratesService.createLineQuote(id, createLineQuoteDto);
  }

  @Post('requests/:id/complete')
  @Roles(UserRole.PRICING, UserRole.ADMIN)
  @ApiOperation({ summary: 'Complete rate request' })
  @ApiResponse({ status: 200, description: 'Rate request completed successfully' })
  completeRateRequest(@Param('id') id: string, @Request() req) {
    return this.ratesService.completeRateRequest(id, req.user.id);
  }

  @Post('requests/:id/reject')
  @Roles(UserRole.PRICING, UserRole.ADMIN)
  @ApiOperation({ summary: 'Reject rate request' })
  @ApiResponse({ status: 200, description: 'Rate request rejected successfully' })
  rejectRateRequest(@Param('id') id: string, @Body('remark') remark: string, @Request() req) {
    return this.ratesService.rejectRateRequest(id, remark, req.user.id);
  }

  @Get('requests/:id/processed-percentage')
  @ApiOperation({ summary: 'Get processed percentage for rate request' })
  @ApiResponse({ status: 200, description: 'Processed percentage retrieved successfully' })
  getProcessedPercentage(@Param('id') id: string) {
    return this.ratesService.getProcessedPercentage(id);
  }
}