import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  getDashboardData(@Request() req) {
    return this.dashboardService.getDashboardData(req.user.id, req.user.role);
  }

  @Get('export-jpeg')
  @ApiOperation({ summary: 'Export dashboard to JPEG' })
  @ApiResponse({ status: 200, description: 'Dashboard exported successfully' })
  exportDashboardToJpeg() {
    return this.dashboardService.exportDashboardToJpeg();
  }
}