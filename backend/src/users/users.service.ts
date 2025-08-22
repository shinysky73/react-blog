import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _password, ...result } = user;
    return result;
  }
}
