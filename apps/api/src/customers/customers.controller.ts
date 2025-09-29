import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApproveCustomerDto } from './dto/approve-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  create(@Body() createCustomerDto: CreateCustomerDto, @Request() req) {
    return this.customersService.create(createCustomerDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  findAll(@Query('includePending') includePending?: string) {
    return this.customersService.findAll(includePending === 'true');
  }

  @Get('search')
  @ApiOperation({ summary: 'Search customers' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  search(@Query('q') query: string) {
    return this.customersService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id') id: string) {
    return this.customersService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.SALES, UserRole.CSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto, @Request() req) {
    return this.customersService.update(id, updateCustomerDto, req.user.id);
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve or reject customer' })
  @ApiResponse({ status: 200, description: 'Customer approval status updated' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  approve(@Param('id') id: string, @Body() approveCustomerDto: ApproveCustomerDto, @Request() req) {
    return this.customersService.approve(id, approveCustomerDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete customer' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}