import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create Permissions
    const permissions = await prisma.permission.createMany({
      data: [
        { action: 'read', resource: 'user' },
        { action: 'write', resource: 'user' },
        { action: 'delete', resource: 'user' },
        { action: 'read', resource: 'post' },
        { action: 'write', resource: 'post' },
        { action: 'delete', resource: 'post' },
      ],
      skipDuplicates: true,
    });

    // Create Roles
    const adminRole = await prisma.role.create({
      data: { name: 'Admin' },
    });

    const userRole = await prisma.role.create({
      data: { name: 'User' },
    });

    // Assign permissions to roles
    const adminPermissions = await prisma.permission.findMany();
    await prisma.rolePermission.createMany({
      data: adminPermissions.map((perm) => ({
        role_id: adminRole.role_id,
        permission_id: perm.permission_id,
      })),
    });

    console.log('✅ Seed data inserted successfully.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
