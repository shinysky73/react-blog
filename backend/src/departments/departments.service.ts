import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Department } from '../../generated/prisma';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return this.prisma.department.create({ data });
  }

  async findAll(): Promise<Department[]> {
    return this.prisma.department.findMany();
  }

  async findOne(id: number): Promise<Department | null> {
    return this.prisma.department.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.DepartmentUpdateInput): Promise<Department> {
    return this.prisma.department.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Department> {
    return this.prisma.department.delete({ where: { id } });
  }
}