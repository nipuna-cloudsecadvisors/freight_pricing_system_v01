import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { BookingService } from './booking.service';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateRoDocumentDto } from './dto/create-ro-document.dto';
import { CompleteJobDto } from './dto/complete-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Booking')
@Controller('booking-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(UserRole.SALES, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create booking request' })
  @ApiResponse({ status: 201, description: 'Booking request created successfully' })
  create(@Body() createBookingRequestDto: CreateBookingRequestDto, @Request() req) {
    return this.bookingService.createBookingRequest(createBookingRequestDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get booking requests' })
  @ApiResponse({ status: 200, description: 'Booking requests retrieved successfully' })
  findAll(@Query() filters: any, @Request() req) {
    return this.bookingService.getBookingRequests(filters, req.user.id, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking request by ID' })
  @ApiResponse({ status: 200, description: 'Booking request retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.bookingService.getBookingRequestById(id);
  }

  @Post(':id/confirm')
  @Roles(UserRole.SALES, UserRole.ADMIN)
  @ApiOperation({ summary: 'Confirm booking request' })
  @ApiResponse({ status: 200, description: 'Booking request confirmed successfully' })
  confirm(@Param('id') id: string, @Body() confirmBookingDto: ConfirmBookingDto, @Request() req) {
    return this.bookingService.confirmBooking(id, confirmBookingDto, req.user.id);
  }

  @Post(':id/cancel')
  @Roles(UserRole.SALES, UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel booking request' })
  @ApiResponse({ status: 200, description: 'Booking request cancelled successfully' })
  cancel(@Param('id') id: string, @Body() cancelBookingDto: CancelBookingDto, @Request() req) {
    return this.bookingService.cancelBooking(id, cancelBookingDto, req.user.id);
  }

  @Post(':id/ro')
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add RO document' })
  @ApiResponse({ status: 201, description: 'RO document added successfully' })
  addRoDocument(@Param('id') id: string, @Body() createRoDocumentDto: CreateRoDocumentDto) {
    return this.bookingService.addRoDocument(id, createRoDocumentDto);
  }

  @Post(':id/open-erp-job')
  @Roles(UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Open ERP job' })
  @ApiResponse({ status: 201, description: 'ERP job opened successfully' })
  openErpJob(@Param('id') id: string, @Body('erpJobNo') erpJobNo: string, @Request() req) {
    return this.bookingService.openErpJob(id, erpJobNo, req.user.id);
  }

  @Get('jobs')
  @Roles(UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get jobs' })
  @ApiResponse({ status: 200, description: 'Jobs retrieved successfully' })
  getJobs(@Query() filters: any, @Request() req) {
    return this.bookingService.getJobs(filters, req.user.id, req.user.role);
  }

  @Post('jobs/:id/complete')
  @Roles(UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Complete job' })
  @ApiResponse({ status: 201, description: 'Job completed successfully' })
  completeJob(@Param('id') id: string, @Body() completeJobDto: CompleteJobDto, @Request() req) {
    return this.bookingService.completeJob(id, completeJobDto, req.user.id);
  }
}