import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ItinerariesService } from './itineraries.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { CreateItineraryItemDto } from './dto/create-itinerary-item.dto';
import { ApproveItineraryDto } from './dto/approve-itinerary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Itineraries')
@Controller('itineraries')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Post()
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create itinerary' })
  @ApiResponse({ status: 201, description: 'Itinerary created successfully' })
  create(@Body() createItineraryDto: CreateItineraryDto, @Request() req) {
    return this.itinerariesService.create(createItineraryDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get itineraries' })
  @ApiResponse({ status: 200, description: 'Itineraries retrieved successfully' })
  findAll(@Request() req) {
    return this.itinerariesService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get itinerary by ID' })
  @ApiResponse({ status: 200, description: 'Itinerary retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.itinerariesService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update itinerary' })
  @ApiResponse({ status: 200, description: 'Itinerary updated successfully' })
  update(@Param('id') id: string, @Body() updateItineraryDto: UpdateItineraryDto, @Request() req) {
    return this.itinerariesService.update(id, updateItineraryDto, req.user.id);
  }

  @Post(':id/submit')
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Submit itinerary for approval' })
  @ApiResponse({ status: 200, description: 'Itinerary submitted successfully' })
  submit(@Param('id') id: string, @Request() req) {
    return this.itinerariesService.submit(id, req.user.id);
  }

  @Post(':id/approve')
  @Roles(UserRole.SBU_HEAD, UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve or reject itinerary' })
  @ApiResponse({ status: 200, description: 'Itinerary decision made successfully' })
  approve(@Param('id') id: string, @Body() approveItineraryDto: ApproveItineraryDto, @Request() req) {
    return this.itinerariesService.approve(id, approveItineraryDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete itinerary' })
  @ApiResponse({ status: 200, description: 'Itinerary deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.itinerariesService.remove(id, req.user.id);
  }

  // Itinerary Items
  @Post(':id/items')
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add item to itinerary' })
  @ApiResponse({ status: 201, description: 'Item added successfully' })
  createItem(@Param('id') itineraryId: string, @Body() createItemDto: CreateItineraryItemDto) {
    return this.itinerariesService.createItem(itineraryId, createItemDto);
  }

  @Patch('items/:itemId')
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update itinerary item' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  updateItem(@Param('itemId') itemId: string, @Body() updateItemDto: any) {
    return this.itinerariesService.updateItem(itemId, updateItemDto);
  }

  @Delete('items/:itemId')
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete itinerary item' })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  removeItem(@Param('itemId') itemId: string) {
    return this.itinerariesService.removeItem(itemId);
  }
}