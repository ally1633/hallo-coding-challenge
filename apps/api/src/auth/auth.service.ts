import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { memoryStore } from "../memory-store";

import { PrismaService } from "../prisma.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService
  ) {}

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (user) {
      const { password: _pass, ...userNoPass } = user;
      return userNoPass;
    }

    return null;
  }

  async insertSession({ user, sessionId }) {
    return this.prisma.sessions.create({
      data: { userId: user.id, sessionId },
    });
  }

  async logout({ userId }) {
    const sessions = await this.prisma.sessions.findMany({
      where: { userId },
    });

    for (let i = 0; i < sessions.length; i++) {
      memoryStore.destroy(sessions[i].sessionId);
    }

    return this.prisma.sessions.deleteMany({
      where: { userId },
    });
  }

  async validateUser(
    username: string,
    inputPassword: string,
    isLogout?: boolean
  ) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new HttpException(`Wrong credentials`, HttpStatus.UNAUTHORIZED);
    }

    const isPasswordMatching = await bcrypt.compare(
      inputPassword,
      user.password
    );

    if (!isPasswordMatching) {
      throw new HttpException(`Wrong credentials`, HttpStatus.UNAUTHORIZED);
    }

    if (!isLogout) {
      const session = await this.prisma.sessions.findFirst({
        where: { userId: user.id },
      });

      if (session) {
        throw new HttpException(
          `There is already an active session using your account`,
          HttpStatus.UNAUTHORIZED
        );
      }
    }

    const { password: _pass, ...userNoPass } = user;
    return userNoPass;
  }

  async register({ username, password, role }: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      username,
      password: hashedPassword,
      role,
    });

    const { password: _pass, ...userNoPass } = newUser;

    return userNoPass;
  }
}
