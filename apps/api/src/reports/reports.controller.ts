import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('response-time')
  @Roles(UserRole.ADMIN, UserRole.SBU_HEAD, UserRole.MGMT)
  @ApiOperation({ summary: 'Get response time report' })
  @ApiResponse({ status: 200, description: 'Response time report retrieved successfully' })
  getResponseTimeReport() {
    return this.reportsService.getResponseTimeReport();
  }

  @Get('top-sps')
  @Roles(UserRole.ADMIN, UserRole.SBU_HEAD, UserRole.MGMT)
  @ApiOperation({ summary: 'Get top sales persons report' })
  @ApiResponse({ status: 200, description: 'Top sales persons report retrieved successfully' })
  getTopSalesPersons() {
    return this.reportsService.getTopSalesPersons();
  }

  @Get('status-cards')
  @ApiOperation({ summary: 'Get status cards' })
  @ApiResponse({ status: 200, description: 'Status cards retrieved successfully' })
  getStatusCards() {
    return this.reportsService.getStatusCards();
  }

  @Get('booking-status-cards')
  @ApiOperation({ summary: 'Get booking status cards' })
  @ApiResponse({ status: 200, description: 'Booking status cards retrieved successfully' })
  getBookingStatusCards() {
    return this.reportsService.getBookingStatusCards();
  }

  @Get('itinerary-status-cards')
  @ApiOperation({ summary: 'Get itinerary status cards' })
  @ApiResponse({ status: 200, description: 'Itinerary status cards retrieved successfully' })
  getItineraryStatusCards() {
    return this.reportsService.getItineraryStatusCards();
  }
}