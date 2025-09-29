import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create SBUs
  const sbu1 = await prisma.sBU.create({
    data: {
      name: 'Colombo Operations',
    },
  });

  const sbu2 = await prisma.sBU.create({
    data: {
      name: 'Regional Sales',
    },
  });

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@freight.com',
      name: 'System Administrator',
      phone: '+94112345678',
      role: 'ADMIN',
      password: await bcrypt.hash('admin123', 10),
      sbuId: sbu1.id,
    },
  });

  const sbuHeadUser = await prisma.user.create({
    data: {
      email: 'sbuhead@freight.com',
      name: 'John Smith',
      phone: '+94112345679',
      role: 'SBU_HEAD',
      password: await bcrypt.hash('sbuhead123', 10),
      sbuId: sbu1.id,
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@freight.com',
      name: 'Sarah Johnson',
      phone: '+94112345680',
      role: 'SALES',
      password: await bcrypt.hash('sales123', 10),
      sbuId: sbu1.id,
    },
  });

  const cseUser = await prisma.user.create({
    data: {
      email: 'cse@freight.com',
      name: 'Mike Wilson',
      phone: '+94112345681',
      role: 'CSE',
      password: await bcrypt.hash('cse123', 10),
      sbuId: sbu1.id,
    },
  });

  const pricingUser = await prisma.user.create({
    data: {
      email: 'pricing@freight.com',
      name: 'Lisa Brown',
      phone: '+94112345682',
      role: 'PRICING',
      password: await bcrypt.hash('pricing123', 10),
      sbuId: sbu1.id,
    },
  });

  const mgmtUser = await prisma.user.create({
    data: {
      email: 'mgmt@freight.com',
      name: 'David Lee',
      phone: '+94112345683',
      role: 'MGMT',
      password: await bcrypt.hash('mgmt123', 10),
      sbuId: sbu1.id,
    },
  });

  // Update SBU head
  await prisma.sBU.update({
    where: { id: sbu1.id },
    data: { headUserId: sbuHeadUser.id },
  });

  // Create Ports
  const colomboPort = await prisma.port.create({
    data: {
      unlocode: 'LKCMB',
      name: 'Colombo',
      country: 'Sri Lanka',
    },
  });

  const singaporePort = await prisma.port.create({
    data: {
      unlocode: 'SGSIN',
      name: 'Singapore',
      country: 'Singapore',
    },
  });

  const dubaiPort = await prisma.port.create({
    data: {
      unlocode: 'AEDXB',
      name: 'Dubai',
      country: 'UAE',
    },
  });

  const hamburgPort = await prisma.port.create({
    data: {
      unlocode: 'DEHAM',
      name: 'Hamburg',
      country: 'Germany',
    },
  });

  const losAngelesPort = await prisma.port.create({
    data: {
      unlocode: 'USLAX',
      name: 'Los Angeles',
      country: 'USA',
    },
  });

  // Create Trade Lanes
  const asiaEuropeLane = await prisma.tradeLane.create({
    data: {
      region: 'Asia-Europe',
      name: 'Colombo to Hamburg',
      code: 'CMB-HAM',
    },
  });

  const asiaUsaLane = await prisma.tradeLane.create({
    data: {
      region: 'Asia-USA',
      name: 'Colombo to Los Angeles',
      code: 'CMB-LAX',
    },
  });

  const asiaMiddleEastLane = await prisma.tradeLane.create({
    data: {
      region: 'Asia-Middle East',
      name: 'Colombo to Dubai',
      code: 'CMB-DXB',
    },
  });

  // Create Shipping Lines
  const mscLine = await prisma.shippingLine.create({
    data: {
      name: 'Mediterranean Shipping Company',
      code: 'MSC',
    },
  });

  const maerskLine = await prisma.shippingLine.create({
    data: {
      name: 'Maersk Line',
      code: 'MAEU',
    },
  });

  const cmaCgmLine = await prisma.shippingLine.create({
    data: {
      name: 'CMA CGM',
      code: 'CMAC',
    },
  });

  const coscoLine = await prisma.shippingLine.create({
    data: {
      name: 'COSCO Shipping',
      code: 'COSCO',
    },
  });

  // Create Equipment Types
  const dryContainer = await prisma.equipmentType.create({
    data: {
      name: '20ft Dry Container',
      isReefer: false,
      isFlatRackOpenTop: false,
    },
  });

  const dryContainer40 = await prisma.equipmentType.create({
    data: {
      name: '40ft Dry Container',
      isReefer: false,
      isFlatRackOpenTop: false,
    },
  });

  const reeferContainer = await prisma.equipmentType.create({
    data: {
      name: '40ft Reefer Container',
      isReefer: true,
      isFlatRackOpenTop: false,
    },
  });

  const flatRack = await prisma.equipmentType.create({
    data: {
      name: '40ft Flat Rack',
      isReefer: false,
      isFlatRackOpenTop: true,
    },
  });

  const openTop = await prisma.equipmentType.create({
    data: {
      name: '40ft Open Top',
      isReefer: false,
      isFlatRackOpenTop: true,
    },
  });

  // Create Pricing Team Assignments
  await prisma.pricingTeamAssignment.create({
    data: {
      tradeLaneId: asiaEuropeLane.id,
      userId: pricingUser.id,
    },
  });

  await prisma.pricingTeamAssignment.create({
    data: {
      tradeLaneId: asiaUsaLane.id,
      userId: pricingUser.id,
    },
  });

  // Create Sample Customers
  const customer1 = await prisma.customer.create({
    data: {
      companyName: 'ABC Trading Company',
      contactPerson: 'Mr. Rajesh Kumar',
      email: 'rajesh@abctrading.com',
      phone: '+94112345690',
      address: '123 Main Street, Colombo 03',
      city: 'Colombo',
      country: 'Sri Lanka',
      approvalStatus: 'APPROVED',
      createdById: salesUser.id,
      approvedById: adminUser.id,
      approvedAt: new Date(),
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      companyName: 'XYZ Exports Ltd',
      contactPerson: 'Ms. Priya Fernando',
      email: 'priya@xyzexports.com',
      phone: '+94112345691',
      address: '456 Galle Road, Colombo 04',
      city: 'Colombo',
      country: 'Sri Lanka',
      approvalStatus: 'PENDING',
      createdById: salesUser.id,
    },
  });

  // Create Sample Predefined Rates
  const now = new Date();
  const validFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  const validTo = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  await prisma.predefinedRate.create({
    data: {
      tradeLaneId: asiaEuropeLane.id,
      polId: colomboPort.id,
      podId: hamburgPort.id,
      service: 'Weekly Service',
      equipTypeId: dryContainer40.id,
      isLcl: false,
      validFrom,
      validTo,
      status: 'active',
      notes: 'Direct service via MSC',
    },
  });

  await prisma.predefinedRate.create({
    data: {
      tradeLaneId: asiaUsaLane.id,
      polId: colomboPort.id,
      podId: losAngelesPort.id,
      service: 'Bi-weekly Service',
      equipTypeId: dryContainer40.id,
      isLcl: false,
      validFrom,
      validTo,
      status: 'active',
      notes: 'Transshipment via Singapore',
    },
  });

  // Create Sample Leads
  await prisma.lead.create({
    data: {
      companyName: 'New Prospect Ltd',
      contact: 'Mr. Ahmed Hassan',
      stage: 'Initial Contact',
      ownerId: salesUser.id,
      source: 'Trade Fair',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Test accounts created:');
  console.log('   Admin: admin@freight.com / admin123');
  console.log('   SBU Head: sbuhead@freight.com / sbuhead123');
  console.log('   Sales: sales@freight.com / sales123');
  console.log('   CSE: cse@freight.com / cse123');
  console.log('   Pricing: pricing@freight.com / pricing123');
  console.log('   Management: mgmt@freight.com / mgmt123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });