import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MastersService {
  constructor(private prisma: PrismaService) {}

  // Ports
  async getPorts() {
    return this.prisma.port.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getPortById(id: string) {
    return this.prisma.port.findUnique({
      where: { id },
    });
  }

  // Trade Lanes
  async getTradeLanes() {
    return this.prisma.tradeLane.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getTradeLaneById(id: string) {
    return this.prisma.tradeLane.findUnique({
      where: { id },
    });
  }

  // Equipment Types
  async getEquipmentTypes() {
    return this.prisma.equipmentType.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getEquipmentTypeById(id: string) {
    return this.prisma.equipmentType.findUnique({
      where: { id },
    });
  }

  // Shipping Lines
  async getShippingLines() {
    return this.prisma.shippingLine.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getShippingLineById(id: string) {
    return this.prisma.shippingLine.findUnique({
      where: { id },
    });
  }

  // SBUs
  async getSBUs() {
    return this.prisma.sBU.findMany({
      include: {
        headUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getSBUById(id: string) {
    return this.prisma.sBU.findUnique({
      where: { id },
      include: {
        headUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Search functionality
  async searchPorts(query: string) {
    return this.prisma.port.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { unlocode: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });
  }

  async searchTradeLanes(query: string) {
    return this.prisma.tradeLane.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
          { region: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });
  }

  async searchShippingLines(query: string) {
    return this.prisma.shippingLine.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });
  }
}