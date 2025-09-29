import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePredefinedRateDto } from './dto/create-predefined-rate.dto';
import { CreateRateRequestDto } from './dto/create-rate-request.dto';
import { RespondToRateRequestDto } from './dto/respond-to-rate-request.dto';
import { CreateLineQuoteDto } from './dto/create-line-quote.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RatesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // Predefined Rates
  async getPredefinedRates(filters: any) {
    const where: any = {};

    if (filters.region) {
      where.tradeLane = { region: filters.region };
    }
    if (filters.pol) {
      where.polId = filters.pol;
    }
    if (filters.pod) {
      where.podId = filters.pod;
    }
    if (filters.service) {
      where.service = { contains: filters.service, mode: 'insensitive' };
    }
    if (filters.equip) {
      where.equipTypeId = filters.equip;
    }
    if (filters.status) {
      where.status = filters.status;
    }

    const rates = await this.prisma.predefinedRate.findMany({
      where,
      include: {
        tradeLane: true,
        pol: true,
        pod: true,
        equipType: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add validity highlights
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return rates.map(rate => ({
      ...rate,
      validityStatus: rate.validTo < now ? 'expired' : 
                     rate.validTo < sevenDaysFromNow ? 'expiring' : 'active',
    }));
  }

  async createPredefinedRate(createPredefinedRateDto: CreatePredefinedRateDto) {
    return this.prisma.predefinedRate.create({
      data: createPredefinedRateDto,
      include: {
        tradeLane: true,
        pol: true,
        pod: true,
        equipType: true,
      },
    });
  }

  async requestRateUpdate(rateId: string, userId: string) {
    const rate = await this.prisma.predefinedRate.findUnique({
      where: { id: rateId },
      include: {
        tradeLane: {
          include: {
            pricingAssignments: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!rate) {
      throw new NotFoundException('Predefined rate not found');
    }

    // Notify all pricing team members assigned to this trade lane
    const pricingUsers = rate.tradeLane.pricingAssignments.map(assignment => assignment.user);
    
    if (pricingUsers.length > 0) {
      await this.notificationsService.notifyRateRequestCreated(
        { id: rateId, refNo: `RATE-${rateId}` },
        pricingUsers
      );
    }

    return { message: 'Rate update request sent to pricing team' };
  }

  // Rate Requests
  async createRateRequest(createRateRequestDto: CreateRateRequestDto, salespersonId: string) {
    // Generate reference number
    const refNo = `RR${Date.now().toString().slice(-8)}`;

    // Default POL to Colombo if not provided for sea export
    if (createRateRequestDto.mode === 'SEA' && !createRateRequestDto.polId) {
      const colomboPort = await this.prisma.port.findFirst({
        where: { unlocode: 'LKCMB' },
      });
      if (colomboPort) {
        createRateRequestDto.polId = colomboPort.id;
      }
    }

    // Validate equipment type requirements
    if (createRateRequestDto.equipTypeId) {
      const equipType = await this.prisma.equipmentType.findUnique({
        where: { id: createRateRequestDto.equipTypeId },
      });

      if (equipType?.isFlatRackOpenTop && !createRateRequestDto.palletDims) {
        throw new BadRequestException('Pallet dimensions are required for Flat Rack/Open Top equipment');
      }
    }

    const rateRequest = await this.prisma.rateRequest.create({
      data: {
        ...createRateRequestDto,
        refNo,
        salespersonId,
      },
      include: {
        pol: true,
        pod: true,
        preferredLine: true,
        equipType: true,
        salesperson: true,
        customer: true,
      },
    });

    // Notify pricing team
    const pricingUsers = await this.prisma.user.findMany({
      where: { role: 'PRICING' },
    });

    if (pricingUsers.length > 0) {
      await this.notificationsService.notifyRateRequestCreated(rateRequest, pricingUsers);
    }

    return rateRequest;
  }

  async getRateRequests(filters: any, userId: string, userRole: string) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.mine === 'true' || userRole === 'SALES') {
      where.salespersonId = userId;
    }

    return this.prisma.rateRequest.findMany({
      where,
      include: {
        pol: true,
        pod: true,
        preferredLine: true,
        equipType: true,
        salesperson: true,
        customer: true,
        responses: {
          include: {
            requestedLine: true,
            requestedEquipType: true,
          },
        },
        lineQuotes: {
          include: {
            line: true,
            equipType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRateRequestById(id: string) {
    const rateRequest = await this.prisma.rateRequest.findUnique({
      where: { id },
      include: {
        pol: true,
        pod: true,
        preferredLine: true,
        equipType: true,
        salesperson: true,
        customer: true,
        responses: {
          include: {
            requestedLine: true,
            requestedEquipType: true,
          },
        },
        lineQuotes: {
          include: {
            line: true,
            equipType: true,
          },
        },
      },
    });

    if (!rateRequest) {
      throw new NotFoundException('Rate request not found');
    }

    return rateRequest;
  }

  async respondToRateRequest(id: string, respondDto: RespondToRateRequestDto, userId: string) {
    const rateRequest = await this.getRateRequestById(id);

    if (rateRequest.status !== 'PENDING') {
      throw new ForbiddenException('Rate request is not pending');
    }

    // Validate vessel details if required
    if (rateRequest.vesselRequired) {
      if (!respondDto.vesselName || !respondDto.eta || !respondDto.etd) {
        throw new BadRequestException('Vessel details are required for this rate request');
      }
    }

    // Create response
    const response = await this.prisma.rateRequestResponse.create({
      data: {
        rateRequestId: id,
        lineNo: respondDto.lineNo,
        requestedLineId: respondDto.requestedLineId,
        requestedEquipTypeId: respondDto.requestedEquipTypeId,
        vesselName: respondDto.vesselName,
        eta: respondDto.eta,
        etd: respondDto.etd,
        fclCutoff: respondDto.fclCutoff,
        docCutoff: respondDto.docCutoff,
        validTo: respondDto.validTo,
        chargesJson: respondDto.chargesJson,
      },
    });

    // Update rate request status
    await this.prisma.rateRequest.update({
      where: { id },
      data: { status: 'PROCESSING' },
    });

    // Notify salesperson
    await this.notificationsService.notifyRateRequestResponse(rateRequest, rateRequest.salesperson);

    return response;
  }

  async createLineQuote(id: string, createLineQuoteDto: CreateLineQuoteDto) {
    const rateRequest = await this.getRateRequestById(id);

    // Ensure only one selected quote per rate request
    if (createLineQuoteDto.selected) {
      await this.prisma.lineQuote.updateMany({
        where: { rateRequestId: id },
        data: { selected: false },
      });
    }

    return this.prisma.lineQuote.create({
      data: {
        ...createLineQuoteDto,
        rateRequestId: id,
      },
      include: {
        line: true,
        equipType: true,
      },
    });
  }

  async completeRateRequest(id: string, userId: string) {
    const rateRequest = await this.getRateRequestById(id);

    if (rateRequest.status === 'COMPLETED') {
      throw new ForbiddenException('Rate request is already completed');
    }

    return this.prisma.rateRequest.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }

  async rejectRateRequest(id: string, remark: string, userId: string) {
    const rateRequest = await this.getRateRequestById(id);

    if (rateRequest.status !== 'PENDING' && rateRequest.status !== 'PROCESSING') {
      throw new ForbiddenException('Rate request cannot be rejected');
    }

    return this.prisma.rateRequest.update({
      where: { id },
      data: { 
        status: 'REJECTED',
        // Store rejection reason in special instructions
        specialInstructions: `REJECTED: ${remark}`,
      },
    });
  }

  async getProcessedPercentage(rateRequestId: string) {
    const rateRequest = await this.getRateRequestById(rateRequestId);
    
    if (rateRequest.preferredLineId) {
      // Calculate based on responses for preferred line
      const responses = await this.prisma.rateRequestResponse.count({
        where: {
          rateRequestId,
          requestedLineId: rateRequest.preferredLineId,
        },
      });
      
      return Math.min(100, responses * 20); // 20% per response
    }
    
    return 0; // No preferred line specified
  }
}