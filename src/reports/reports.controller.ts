import { Controller, Get, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // 1. API cho Admin Dashboard
  @Get('admin')
  async getAdminStats(@Request() req) {
    // Kiểm tra quyền Admin (Nếu trong User Model có field role)
    if (req.user.role !== 'ADMIN') {
        throw new ForbiddenException('Bạn không có quyền truy cập báo cáo Admin');
    }
    return this.reportsService.getAdminStats();
  }

  // 2. API cho Host Dashboard
  @Get('host')
  async getHostStats(@Request() req) {
    // Host chỉ xem được số liệu của chính mình
    return this.reportsService.getHostStats(req.user.id);
  }
}