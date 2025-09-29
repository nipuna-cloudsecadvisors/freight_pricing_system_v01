import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ActivitiesService } from './activities.service';
import { CreateSalesActivityDto } from './dto/create-sales-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Activities')
@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create sales activity' })
  @ApiResponse({ status: 201, description: 'Activity created successfully' })
  create(@Body() createActivityDto: CreateSalesActivityDto, @Request() req) {
    return this.activitiesService.create(createActivityDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get sales activities' })
  @ApiResponse({ status: 200, description: 'Activities retrieved successfully' })
  findAll(@Request() req) {
    return this.activitiesService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  @ApiResponse({ status: 200, description: 'Activity retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.activitiesService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update activity' })
  @ApiResponse({ status: 200, description: 'Activity updated successfully' })
  update(@Param('id') id: string, @Body() updateActivityDto: any) {
    return this.activitiesService.update(id, updateActivityDto);
  }

  @Delete(':id')
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete activity' })
  @ApiResponse({ status: 200, description: 'Activity deleted successfully' })
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }
}