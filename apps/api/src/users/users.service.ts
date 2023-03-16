import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: { ...createUserDto, deposit: 0 },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    const { password: _p, ...userNoPass } = user;

    return userNoPass;
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      take: 100,
      select: { id: true, username: true },
    });
  }
}
