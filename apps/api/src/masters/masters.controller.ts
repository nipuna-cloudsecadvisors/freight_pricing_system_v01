import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { MastersService } from './masters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Masters')
@Controller('masters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @Get('ports')
  @ApiOperation({ summary: 'Get all ports' })
  @ApiResponse({ status: 200, description: 'Ports retrieved successfully' })
  getPorts() {
    return this.mastersService.getPorts();
  }

  @Get('ports/search')
  @ApiOperation({ summary: 'Search ports' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  searchPorts(@Query('q') query: string) {
    return this.mastersService.searchPorts(query);
  }

  @Get('ports/:id')
  @ApiOperation({ summary: 'Get port by ID' })
  @ApiResponse({ status: 200, description: 'Port retrieved successfully' })
  getPortById(@Param('id') id: string) {
    return this.mastersService.getPortById(id);
  }

  @Get('trade-lanes')
  @ApiOperation({ summary: 'Get all trade lanes' })
  @ApiResponse({ status: 200, description: 'Trade lanes retrieved successfully' })
  getTradeLanes() {
    return this.mastersService.getTradeLanes();
  }

  @Get('trade-lanes/search')
  @ApiOperation({ summary: 'Search trade lanes' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  searchTradeLanes(@Query('q') query: string) {
    return this.mastersService.searchTradeLanes(query);
  }

  @Get('trade-lanes/:id')
  @ApiOperation({ summary: 'Get trade lane by ID' })
  @ApiResponse({ status: 200, description: 'Trade lane retrieved successfully' })
  getTradeLaneById(@Param('id') id: string) {
    return this.mastersService.getTradeLaneById(id);
  }

  @Get('equipment-types')
  @ApiOperation({ summary: 'Get all equipment types' })
  @ApiResponse({ status: 200, description: 'Equipment types retrieved successfully' })
  getEquipmentTypes() {
    return this.mastersService.getEquipmentTypes();
  }

  @Get('equipment-types/:id')
  @ApiOperation({ summary: 'Get equipment type by ID' })
  @ApiResponse({ status: 200, description: 'Equipment type retrieved successfully' })
  getEquipmentTypeById(@Param('id') id: string) {
    return this.mastersService.getEquipmentTypeById(id);
  }

  @Get('shipping-lines')
  @ApiOperation({ summary: 'Get all shipping lines' })
  @ApiResponse({ status: 200, description: 'Shipping lines retrieved successfully' })
  getShippingLines() {
    return this.mastersService.getShippingLines();
  }

  @Get('shipping-lines/search')
  @ApiOperation({ summary: 'Search shipping lines' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  searchShippingLines(@Query('q') query: string) {
    return this.mastersService.searchShippingLines(query);
  }

  @Get('shipping-lines/:id')
  @ApiOperation({ summary: 'Get shipping line by ID' })
  @ApiResponse({ status: 200, description: 'Shipping line retrieved successfully' })
  getShippingLineById(@Param('id') id: string) {
    return this.mastersService.getShippingLineById(id);
  }

  @Get('sbus')
  @ApiOperation({ summary: 'Get all SBUs' })
  @ApiResponse({ status: 200, description: 'SBUs retrieved successfully' })
  getSBUs() {
    return this.mastersService.getSBUs();
  }

  @Get('sbus/:id')
  @ApiOperation({ summary: 'Get SBU by ID' })
  @ApiResponse({ status: 200, description: 'SBU retrieved successfully' })
  getSBUById(@Param('id') id: string) {
    return this.mastersService.getSBUById(id);
  }
}