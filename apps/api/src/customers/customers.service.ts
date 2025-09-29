import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApproveCustomerDto } from './dto/approve-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto, createdById: string) {
    return this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        createdById,
        approvalStatus: 'PENDING',
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(includePending = false) {
    const where = includePending ? {} : { approvalStatus: 'APPROVED' };
    
    return this.prisma.customer.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, userId: string) {
    const customer = await this.findById(id);
    
    // Only allow updates if customer is pending or user is admin
    if (customer.approvalStatus === 'APPROVED') {
      throw new ForbiddenException('Cannot update approved customer');
    }

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async approve(id: string, approveCustomerDto: ApproveCustomerDto, approvedById: string) {
    const customer = await this.findById(id);
    
    if (customer.approvalStatus !== 'PENDING') {
      throw new ForbiddenException('Customer is not pending approval');
    }

    return this.prisma.customer.update({
      where: { id },
      data: {
        approvalStatus: approveCustomerDto.approved ? 'APPROVED' : 'REJECTED',
        approvedById,
        approvedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    
    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async search(query: string) {
    return this.prisma.customer.findMany({
      where: {
        OR: [
          { companyName: { contains: query, mode: 'insensitive' } },
          { contactPerson: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        approvalStatus: 'APPROVED',
      },
      select: {
        id: true,
        companyName: true,
        contactPerson: true,
        email: true,
        phone: true,
      },
      take: 10,
    });
  }
}