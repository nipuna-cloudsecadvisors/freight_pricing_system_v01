import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private notificationsService: NotificationsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      sbuId: user.sbuId 
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { 
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }
    );

    // Log audit event
    await this.prisma.auditEvent.create({
      data: {
        actorId: user.id,
        entity: 'User',
        entityId: user.id,
        action: 'LOGIN',
        payload: { email: user.email, ip: loginDto.ip },
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        sbuId: user.sbuId,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User not found or inactive');
      }

      const newPayload = { 
        sub: user.id, 
        email: user.email, 
        role: user.role,
        sbuId: user.sbuId 
      };

      const accessToken = this.jwtService.sign(newPayload);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async requestOtp(requestOtpDto: RequestOtpDto) {
    const user = await this.usersService.findByEmail(requestOtpDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in user record (in production, use Redis)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        // In a real app, store hashed OTP and expiry
        // For now, we'll use a simple approach
      },
    });

    // Send OTP via email and SMS
    await this.notificationsService.sendOtp(user, otp);

    return { message: 'OTP sent successfully' };
  }

  async confirmOtp(confirmOtpDto: ConfirmOtpDto) {
    const user = await this.usersService.findByEmail(confirmOtpDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify OTP (in production, verify against stored OTP)
    // For now, accept any 6-digit OTP
    if (!/^\d{6}$/.test(confirmOtpDto.otp)) {
      throw new BadRequestException('Invalid OTP format');
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(confirmOtpDto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password cannot be the same as current password');
    }

    // Update password
    const hashedPassword = await bcrypt.hash(confirmOtpDto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Log audit event
    await this.prisma.auditEvent.create({
      data: {
        actorId: user.id,
        entity: 'User',
        entityId: user.id,
        action: 'UPDATE',
        payload: { field: 'password', method: 'otp_reset' },
      },
    });

    return { message: 'Password reset successfully' };
  }

  async logout(userId: string) {
    // Log audit event
    await this.prisma.auditEvent.create({
      data: {
        actorId: userId,
        entity: 'User',
        entityId: userId,
        action: 'LOGOUT',
      },
    });

    return { message: 'Logged out successfully' };
  }
}